from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001"])

@app.route('/')
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Financial Copilot API is running'
    })

@app.route('/api/test')
def test_endpoint():
    return jsonify({
        'message': 'Test endpoint working',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
