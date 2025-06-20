from flask import Blueprint, request, jsonify
from app import db, socketio
from app.models import Expense, ExpenseCategory
from werkzeug.utils import secure_filename
import os
import pytesseract
from PIL import Image
import openai
import tempfile
import uuid

bp = Blueprint('receipts', __name__, url_prefix='/api/receipts')

# Configure upload settings
UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/upload', methods=['POST'])
def upload_receipt():
    """Upload and process receipt with OCR and AI"""
    try:
        if 'receipt' not in request.files:
            return jsonify({'error': 'No receipt file provided'}), 400
            
        file = request.files['receipt']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Save file temporarily
        filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        try:
            # Process with OCR
            ocr_result = process_receipt_ocr(filepath)
            
            # Use AI to extract structured data
            structured_data = extract_receipt_data(ocr_result)
            
            # Create expense record
            expense = Expense(
                amount=structured_data.get('amount', 0),
                category=ExpenseCategory(structured_data.get('category', 'other')),
                description=structured_data.get('description', ''),
                vendor=structured_data.get('vendor', ''),
                ai_confidence=structured_data.get('confidence', 0.0)
            )
            
            db.session.add(expense)
            db.session.commit()
            
            # Emit real-time update
            socketio.emit('receipt_processed', {
                'expense': expense.to_dict(),
                'ocr_text': ocr_result,
                'extracted_data': structured_data
            })
            
            return jsonify({
                'success': True,
                'expense': expense.to_dict(),
                'ocr_text': ocr_result,
                'extracted_data': structured_data
            })
            
        finally:
            # Clean up temporary file
            if os.path.exists(filepath):
                os.remove(filepath)
                
    except Exception as e:
        return jsonify({'error': f'Receipt processing failed: {str(e)}'}), 500

def process_receipt_ocr(image_path):
    """Extract text from receipt image using OCR"""
    try:
        # Open and process image
        image = Image.open(image_path)
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Perform OCR
        text = pytesseract.image_to_string(image, config='--psm 6')
        
        return text.strip()
        
    except Exception as e:
        raise Exception(f"OCR processing failed: {str(e)}")

def extract_receipt_data(ocr_text):
    """Extract structured data from OCR text using AI"""
    try:
        prompt = f"""
        Extract structured data from this receipt text:
        
        {ocr_text}
        
        Return a JSON object with these fields:
        - amount: total amount (number)
        - vendor: merchant/vendor name
        - description: brief description of purchase
        - category: one of (meals, travel, office, software, marketing, utilities, other)
        - confidence: confidence score 0-1
        - date: transaction date if found
        
        Return only valid JSON, no extra text.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a receipt data extraction assistant. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.3
        )
        
        import json
        result = json.loads(response.choices[0].message.content)
        
        # Validate and clean data
        return {
            'amount': float(result.get('amount', 0)),
            'vendor': str(result.get('vendor', '')),
            'description': str(result.get('description', '')),
            'category': str(result.get('category', 'other')),
            'confidence': float(result.get('confidence', 0.5)),
            'date': result.get('date', '')
        }
        
    except Exception as e:
        # Fallback extraction
        return extract_receipt_fallback(ocr_text)

def extract_receipt_fallback(ocr_text):
    """Fallback extraction using simple parsing"""
    import re
    
    # Try to find amount using regex
    amount_pattern = r'\$?(\d+\.?\d*)'
    amounts = re.findall(amount_pattern, ocr_text)
    amount = float(amounts[-1]) if amounts else 0.0
    
    # Extract vendor (first line usually)
    lines = ocr_text.split('\n')
    vendor = lines[0].strip() if lines else 'Unknown Vendor'
    
    return {
        'amount': amount,
        'vendor': vendor,
        'description': f'Receipt from {vendor}',
        'category': 'other',
        'confidence': 0.3,
        'date': ''
    }

@bp.route('/validate', methods=['POST'])
def validate_receipt_data():
    """Validate and correct receipt data"""
    try:
        data = request.get_json()
        
        # Use AI to validate the extracted data
        prompt = f"""
        Validate this receipt data for accuracy and completeness:
        
        Amount: ${data.get('amount', 0)}
        Vendor: {data.get('vendor', '')}
        Category: {data.get('category', '')}
        Description: {data.get('description', '')}
        
        Check for:
        1. Reasonable amount (not too high/low)
        2. Valid vendor name
        3. Appropriate category
        4. Policy compliance
        
        Return validation results with suggestions.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a receipt validation assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.5
        )
        
        validation_result = response.choices[0].message.content
        
        return jsonify({
            'original_data': data,
            'validation': validation_result,
            'validated_at': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': f'Validation failed: {str(e)}'}), 500

@bp.route('/batch', methods=['POST'])
def batch_process_receipts():
    """Process multiple receipts at once"""
    try:
        files = request.files.getlist('receipts')
        
        if not files:
            return jsonify({'error': 'No files provided'}), 400
        
        results = []
        
        for file in files:
            if file and allowed_file(file.filename):
                try:
                    # Process each file
                    filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
                    filepath = os.path.join(UPLOAD_FOLDER, filename)
                    file.save(filepath)
                    
                    # OCR and AI processing
                    ocr_result = process_receipt_ocr(filepath)
                    structured_data = extract_receipt_data(ocr_result)
                    
                    results.append({
                        'filename': file.filename,
                        'success': True,
                        'data': structured_data
                    })
                    
                    # Clean up
                    os.remove(filepath)
                    
                except Exception as e:
                    results.append({
                        'filename': file.filename,
                        'success': False,
                        'error': str(e)
                    })
        
        return jsonify({
            'processed': len(results),
            'results': results
        })
        
    except Exception as e:
        return jsonify({'error': f'Batch processing failed: {str(e)}'}), 500
