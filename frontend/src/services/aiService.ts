/**
 * Smart AI Service for Financial Copilot
 * 
 * This service uses pure AI intelligence to process expenses naturally.
 * No manual keywords, patterns, or regex - just smart AI conversation!
 * 
 * Features:
 * - Natural language understanding
 * - Intelligent date parsing (yesterday, last week, etc.)
 * - Context-aware vendor detection
 * - Conversational follow-ups for missing info
 * - Smart category assignment
 */

import { Expense } from '../types';

// Configuration
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Student-focused categories (simplified)
const STUDENT_CATEGORIES = [
  'Food & Dining',
  'Transportation', 
  'Education',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Bills & Utilities',
  'Other'
];

// Smart AI Response Interface
export interface SmartAIResponse {
  // Extracted expense data
  expense?: {
    amount?: number;
    description?: string;
    category?: string;
    vendor?: string;
    date?: string; // YYYY-MM-DD format
  };
  
  // Conversation management
  followUpQuestion?: string;
  needsMoreInfo: boolean;
  complete: boolean;
  confidence: number;
  
  // Error handling
  error?: string;
  success: boolean;
}

// Conversation context for follow-ups
export interface ConversationContext {
  pendingExpense?: Partial<Expense>;
  lastQuestion?: string;
  conversationHistory?: string[];
}

/**
 * Smart AI Service Class
 * Uses pure AI intelligence - no manual patterns!
 */
export class SmartAIService {
  private apiKey: string;
  private isInitialized: boolean = false;

  constructor() {
    this.apiKey = GEMINI_API_KEY || '';
    this.isInitialized = !!this.apiKey;
    
    if (!this.isInitialized) {
      console.warn('Smart AI Service: Google Gemini API key not found.');
    }
  }

  /**
   * Process expense conversation with pure AI intelligence
   * @param input - User's natural language input
   * @param context - Previous conversation context
   * @returns Promise<SmartAIResponse>
   */
  async processExpenseConversation(
    input: string, 
    context?: ConversationContext
  ): Promise<SmartAIResponse> {
    try {
      // Input validation
      if (!input?.trim()) {
        return {
          success: false,
          error: 'Please tell me about your expense',
          needsMoreInfo: false,
          complete: false,
          confidence: 0
        };
      }

      // Try AI processing
      if (this.isInitialized) {
        return await this.processWithSmartAI(input, context);
      }

      // Fallback if no AI
      return {
        success: false,
        error: 'AI service not available',
        needsMoreInfo: false,
        complete: false,
        confidence: 0
      };

    } catch (error) {
      console.error('Smart AI Service Error:', error);
      return {
        success: false,
        error: 'Failed to process expense',
        needsMoreInfo: false,
        complete: false,
        confidence: 0
      };
    }
  }

  /**
   * Handle follow-up conversations
   * @param answer - User's answer to follow-up question
   * @param context - Conversation context with pending expense
   * @returns Promise<SmartAIResponse>
   */
  async handleFollowUp(
    answer: string,
    context: ConversationContext
  ): Promise<SmartAIResponse> {
    const fullInput = `
Previous context: ${JSON.stringify(context.pendingExpense)}
Follow-up question was: ${context.lastQuestion}
User's answer: ${answer}

Please update the expense with this new information.
    `;

    return this.processExpenseConversation(fullInput, context);
  }

  /**
   * Process with smart AI prompts
   * @param input - User input
   * @param context - Conversation context
   * @returns Promise<SmartAIResponse>
   */
  private async processWithSmartAI(
    input: string,
    context?: ConversationContext
  ): Promise<SmartAIResponse> {
    try {
      const prompt = this.createSmartPrompt(input, context);
      
      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`AI API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiResponse) {
        throw new Error('No AI response received');
      }

      return this.parseSmartResponse(aiResponse);

    } catch (error) {
      console.error('Smart AI Processing Error:', error);
      return {
        success: false,
        error: 'AI processing failed',
        needsMoreInfo: false,
        complete: false,
        confidence: 0
      };
    }
  }

  /**
   * Create intelligent prompt for Gemini
   * @param input - User input
   * @param context - Conversation context
   * @returns Formatted prompt
   */
  private createSmartPrompt(input: string, context?: ConversationContext): string {
    const currentDate = new Date();
    const dateString = currentDate.toISOString().split('T')[0];
    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    return `
You are an intelligent financial assistant for college students. Your job is to extract expense information from natural language and handle conversations smartly.

CURRENT CONTEXT:
- Today's date: ${dateString} (${dayName})
- Available categories: ${STUDENT_CATEGORIES.join(', ')}
${context?.pendingExpense ? `- Pending expense: ${JSON.stringify(context.pendingExpense)}` : ''}
${context?.lastQuestion ? `- Last question asked: ${context.lastQuestion}` : ''}

USER INPUT: "${input}"

INTELLIGENCE RULES:
1. **Date Processing**: Convert relative dates to actual dates
   - "yesterday" → ${new Date(currentDate.getTime() - 86400000).toISOString().split('T')[0]}
   - "last friday" → calculate the actual date
   - "this morning", "today" → ${dateString}
   - "last week" → approximate date

2. **Context Understanding**: Be smart about context
   - "subway" with food context = Subway restaurant
   - "subway" with transport context = subway transportation
   - "coffee" usually means Food & Dining
   - "uber" usually means Transportation

3. **Missing Information**: If critical info is missing, ask ONE specific question
   - Missing amount: "How much did you spend?"
   - Missing vendor: "Where did you buy this from?"
   - Unclear context: "Was this for [specific clarification]?"

4. **Smart Descriptions**: Create clean, professional titles
   - "I spent money on coffee" → "Coffee"
   - "bought groceries yesterday" → "Groceries"  
   - "dinner with sarah" → "Dinner with Sarah"

5. **Follow-up Handling**: If this is a follow-up, update the pending expense

RESPONSE FORMAT (JSON only):
{
  "expense": {
    "amount": number or null,
    "description": "Clean title" or null,
    "category": "Category from list" or null,
    "vendor": "Vendor name" or null,
    "date": "YYYY-MM-DD" or null
  },
  "followUpQuestion": "Specific question" or null,
  "needsMoreInfo": boolean,
  "complete": boolean,
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation of your thinking"
}

EXAMPLES:

Input: "I spent 10.88$ in subway today"
Output: {
  "expense": {
    "amount": 10.88,
    "description": "Subway order",
    "category": "Food & Dining",
    "vendor": "Subway",
    "date": "${dateString}"
  },
  "followUpQuestion": null,
  "needsMoreInfo": false,
  "complete": true,
  "confidence": 0.95,
  "reasoning": "Complete expense with all information present"
}

Input: "yesterday i spent 46.77$ on groceries"  
Output: {
  "expense": {
    "amount": 46.77,
    "description": "Groceries",
    "category": "Food & Dining",
    "vendor": null,
    "date": "${new Date(currentDate.getTime() - 86400000).toISOString().split('T')[0]}"
  },
  "followUpQuestion": "Where did you buy the groceries from?",
  "needsMoreInfo": true,
  "complete": false,
  "confidence": 0.8,
  "reasoning": "Amount, description, and date clear, but vendor missing"
}

Input: "coffee this morning"
Output: {
  "expense": {
    "amount": null,
    "description": "Coffee",
    "category": "Food & Dining", 
    "vendor": null,
    "date": "${dateString}"
  },
  "followUpQuestion": "How much did you spend on coffee?",
  "needsMoreInfo": true,
  "complete": false,
  "confidence": 0.7,
  "reasoning": "Missing amount and vendor information"
}

Now process the user input above. Return ONLY the JSON response, no additional text.
    `;
  }

  /**
   * Parse AI response and validate with better error handling
   * @param response - AI response text
   * @returns SmartAIResponse
   */
  private parseSmartResponse(response: string): SmartAIResponse {
    try {
      // Clean the response more aggressively
      let cleanResponse = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^[^{]*/, '') // Remove any text before first {
        .replace(/[^}]*$/, '') // Remove any text after last }
        .trim();
      
      // Find the JSON object bounds
      const firstBrace = cleanResponse.indexOf('{');
      const lastBrace = cleanResponse.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanResponse = cleanResponse.substring(firstBrace, lastBrace + 1);
      }
      
      const parsed = JSON.parse(cleanResponse);
      
      // Validate structure
      if (!parsed.expense && !parsed.followUpQuestion) {
        throw new Error('Invalid response structure');
      }

      // Validate category if provided
      if (parsed.expense?.category && !STUDENT_CATEGORIES.includes(parsed.expense.category)) {
        parsed.expense.category = 'Other';
      }

      // Validate amount if provided
      if (parsed.expense?.amount !== null && parsed.expense?.amount !== undefined) {
        const amount = parseFloat(parsed.expense.amount);
        if (isNaN(amount) || amount <= 0) {
          parsed.expense.amount = null;
          if (!parsed.followUpQuestion) {
            parsed.followUpQuestion = "What was the amount you spent?";
            parsed.needsMoreInfo = true;
            parsed.complete = false;
          }
        }
      }

      return {
        success: true,
        expense: parsed.expense,
        followUpQuestion: parsed.followUpQuestion || undefined,
        needsMoreInfo: parsed.needsMoreInfo || false,
        complete: parsed.complete || false,
        confidence: Math.min(Math.max(parsed.confidence || 0.7, 0), 1)
      };

    } catch (error) {
      console.error('Smart AI Response Parsing Error:', error);
      console.log('Raw response:', response);
      
      // Fallback: Try to extract basic info using regex
      return this.fallbackExtraction(response);
    }
  }

  /**
   * Fallback extraction using regex when JSON parsing fails
   * @param response - AI response text
   * @returns SmartAIResponse
   */
  private fallbackExtraction(response: string): SmartAIResponse {
    try {
      // Try to extract basic information using regex
      const amountMatch = response.match(/amount["\s]*:["\s]*(\d+\.?\d*)/i);
      const descriptionMatch = response.match(/description["\s]*:["\s]*"([^"]+)"/i);
      const categoryMatch = response.match(/category["\s]*:["\s]*"([^"]+)"/i);
      const questionMatch = response.match(/followUpQuestion["\s]*:["\s]*"([^"]+)"/i);
      
      if (amountMatch || descriptionMatch || questionMatch) {
        return {
          success: true,
          expense: {
            amount: amountMatch ? parseFloat(amountMatch[1]) : undefined,
            description: descriptionMatch ? descriptionMatch[1] : undefined,
            category: categoryMatch ? categoryMatch[1] : 'Other',
            vendor: undefined,
            date: new Date().toISOString().split('T')[0]
          },
          followUpQuestion: questionMatch ? questionMatch[1] : undefined,
          needsMoreInfo: !!questionMatch,
          complete: !questionMatch,
          confidence: 0.6
        };
      }
    } catch (error) {
      console.error('Fallback extraction failed:', error);
    }
    
    return {
      success: false,
      error: 'Could not understand the expense. Please try rephrasing.',
      needsMoreInfo: false,
      complete: false,
      confidence: 0
    };
  }

  /**
   * Check if service is available
   * @returns boolean
   */
  isAvailable(): boolean {
    return this.isInitialized;
  }

  /**
   * Legacy method for backward compatibility
   * @param input - User input
   * @returns Promise<AIExpenseProcessing>
   */
  async processExpense(input: string): Promise<any> {
    const result = await this.processExpenseConversation(input);
    
    // Convert to legacy format for backward compatibility
    return {
      success: result.success,
      expense: result.expense,
      suggestions: [],
      confidence: result.confidence,
      error: result.error
    };
  }

  /**
   * Legacy method for suggestions (for backward compatibility)
   * @param input - Partial input
   * @returns string[] - Contextual suggestions
   */
  getSuggestions(input: string): string[] {
    const suggestions: string[] = [];
    const lower = input.toLowerCase();

    // Provide smart suggestions based on input
    if (lower.includes('coffee') || lower.includes('starbucks') || lower.includes('cafe')) {
      suggestions.push('I spent $5 on coffee at Starbucks');
      suggestions.push('I spent $4.50 on coffee at the campus cafe');
      suggestions.push('I spent $6 on coffee and pastry');
    } else if (lower.includes('lunch') || lower.includes('dinner') || lower.includes('food')) {
      suggestions.push('I spent $12 on lunch at the cafeteria');
      suggestions.push('I spent $25 on dinner with friends');
      suggestions.push('I spent $8 on sushi for lunch');
    } else if (lower.includes('uber') || lower.includes('lyft') || lower.includes('ride')) {
      suggestions.push('I spent $8 on Uber to campus');
      suggestions.push('I spent $12 on Lyft to the airport');
      suggestions.push('I spent $15 on rideshare downtown');
    } else if (lower.length > 1) {
      suggestions.push('I spent $15 on coffee at Starbucks');
      suggestions.push('I spent $12 on lunch at the cafeteria');
      suggestions.push('I spent $8 on Uber to campus');
    }

    return suggestions.slice(0, 3);
  }
}

// Export singleton instance (renamed for compatibility)
export const aiService = new SmartAIService();

// Additional exports for backward compatibility
export type { SmartAIResponse as AIExpenseProcessing };
export { SmartAIService as AIService };
