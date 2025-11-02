/**
 * Enhanced AI Service with Budget Context
 * Now understands your financial situation!
 */

import { Expense } from '../types';
import { CATEGORY_NAMES } from '../config/categories';  // ✅ Use centralized categories

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// ✅ Use centralized categories
const STUDENT_CATEGORIES = CATEGORY_NAMES;

export interface SmartAIResponse {
  expense?: {
    amount?: number;
    description?: string;
    category?: string;
    vendor?: string;
    date?: string;
  };
  followUpQuestion?: string;
  needsMoreInfo: boolean;
  complete: boolean;
  confidence: number;
  error?: string;
  success: boolean;
  insight?: string; // ✅ NEW: Budget-aware insights!
}

export interface ConversationContext {
  pendingExpense?: Partial<Expense>;
  lastQuestion?: string;
  conversationHistory?: string[];
  // ✅ NEW: Budget context for smart insights
  userBudget?: {
    totalBudget: number;
    fixedCosts: number;
    discretionaryBudget: number;
    spent: number;
    available: number;
    dailySafe: number;
  };
}

export class SmartAIService {
  private apiKey: string;
  private isInitialized: boolean = false;

  constructor() {
    this.apiKey = GEMINI_API_KEY || '';
    this.isInitialized = !!this.apiKey;
    
    if (!this.isInitialized) {
      console.warn('⚠️ Smart AI Service: Google Gemini API key not found. Add REACT_APP_GEMINI_API_KEY to .env');
    } else {
      console.log('✅ Smart AI Service initialized with Gemini API');
    }
  }

  /**
   * Check if AI service is available
   */
  isAvailable(): boolean {
    return this.isInitialized && !!this.apiKey;
  }

  /**
   * Get status message
   */
  getStatus(): string {
    if (this.isAvailable()) {
      return 'AI Ready';
    }
    return 'AI Not Configured - Add REACT_APP_GEMINI_API_KEY to .env';
  }

  async processExpenseConversation(
    input: string, 
    context?: ConversationContext
  ): Promise<SmartAIResponse> {
    try {
      if (!input?.trim()) {
        return {
          success: false,
          error: 'Please tell me about your expense',
          needsMoreInfo: false,
          complete: false,
          confidence: 0
        };
      }

      if (this.isInitialized) {
        return await this.processWithSmartAI(input, context);
      }

      return {
        success: false,
        error: 'AI service not configured. Please add REACT_APP_GEMINI_API_KEY to your .env file',
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

  async handleFollowUp(
    answer: string,
    context: ConversationContext
  ): Promise<SmartAIResponse> {
    const fullInput = `
Previous expense info: ${JSON.stringify(context.pendingExpense)}
You asked: ${context.lastQuestion}
User's answer: ${answer}

Update the expense with this information.
    `;

    return this.processExpenseConversation(fullInput, context);
  }

  private async processWithSmartAI(
    input: string,
    context?: ConversationContext
  ): Promise<SmartAIResponse> {
    try {
      const prompt = this.createBudgetAwarePrompt(input, context);
      
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
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiText) {
        throw new Error('No response from AI');
      }

      return this.parseAIResponse(aiText);

    } catch (error) {
      console.error('AI processing error:', error);
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
   * Create budget-aware AI prompt
   */
  private createBudgetAwarePrompt(input: string, context?: ConversationContext): string {
    const currentDate = new Date();
    const dateString = currentDate.toISOString().split('T')[0];
    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const yesterday = new Date(currentDate.getTime() - 86400000).toISOString().split('T')[0];
    
    // ✅ Budget context for smart insights
    const budgetContext = context?.userBudget ? `
STUDENT'S FINANCIAL SITUATION:
- Total Monthly Budget: $${context.userBudget.totalBudget}
- Fixed Costs (rent, bills): $${context.userBudget.fixedCosts}
- Discretionary Budget: $${context.userBudget.discretionaryBudget}
- Already Spent This Month: $${context.userBudget.spent}
- Still Available: $${context.userBudget.available}
- Safe Daily Spending: $${context.userBudget.dailySafe.toFixed(2)}

SMART INSIGHTS TO PROVIDE:
- If this expense is high relative to daily safe amount, gently warn them
- If they're close to budget limit, remind them
- If they're doing well, encourage them!
` : '';

    return `You are a friendly financial assistant helping a college student track expenses.

CURRENT CONTEXT:
- Today: ${dateString} (${dayName})
- Categories: ${STUDENT_CATEGORIES.join(', ')}
${budgetContext}
${context?.pendingExpense ? `- Pending expense: ${JSON.stringify(context.pendingExpense)}` : ''}

USER SAYS: "${input}"

YOUR JOB:
1. Extract expense details (amount, description, category, vendor, date)
2. If budget context is available, provide a helpful insight
3. If info is missing, ask ONE clear question
4. Convert relative dates: "yesterday"→${yesterday}, "today"→${dateString}

RESPONSE (JSON only, no markdown):
{
  "expense": {
    "amount": number | null,
    "description": "Brief title" | null,
    "category": "Pick from categories" | null,
    "vendor": "Store/place name" | null,
    "date": "YYYY-MM-DD" | null
  },
  "followUpQuestion": "One specific question" | null,
  "needsMoreInfo": true/false,
  "complete": true/false,
  "confidence": 0.0-1.0,
  "insight": "Budget-aware tip (1 sentence)" | null
}

EXAMPLES:

User: "I spent $45 at chipotle"
Response: {
  "expense": {"amount": 45, "description": "Chipotle", "category": "Food & Dining", "vendor": "Chipotle", "date": "${dateString}"},
  "needsMoreInfo": false,
  "complete": true,
  "confidence": 0.95,
  "insight": "That's 2 days of your daily budget - consider meal prep to save more!"
}

User: "bought coffee yesterday"
Response: {
  "expense": {"amount": null, "description": "Coffee", "category": "Food & Dining", "vendor": null, "date": "${yesterday}"},
  "followUpQuestion": "How much was the coffee?",
  "needsMoreInfo": true,
  "complete": false,
  "confidence": 0.7
}

NOW PROCESS THE USER'S INPUT ABOVE.`;
  }

  /**
   * Parse AI response into structured format
   */
  private parseAIResponse(aiText: string): SmartAIResponse {
    try {
      // Remove markdown code blocks if present
      let cleanText = aiText.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\n?/g, '').trim();
      }

      const parsed = JSON.parse(cleanText);

      return {
        expense: parsed.expense || undefined,
        followUpQuestion: parsed.followUpQuestion || undefined,
        needsMoreInfo: parsed.needsMoreInfo || false,
        complete: parsed.complete || false,
        confidence: Math.min(Math.max(parsed.confidence || 0.7, 0), 1),
        insight: parsed.insight || undefined,
        success: true
      };

    } catch (error) {
      console.error('AI Response Parsing Error:', error);
      console.log('Raw AI response:', aiText);
      
      // Try to extract basic info using fallback
      return this.fallbackExtraction(aiText);
    }
  }

  /**
   * Fallback extraction if JSON parsing fails
   */
  private fallbackExtraction(text: string): SmartAIResponse {
    const amountMatch = text.match(/\$?(\d+\.?\d*)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : undefined;

    return {
      expense: amount ? { amount } : undefined,
      followUpQuestion: 'Could you provide more details about this expense?',
      needsMoreInfo: true,
      complete: false,
      confidence: 0.3,
      success: true
    };
  }
}

// Export singleton instance
export const smartAIService = new SmartAIService();

// ✅ Alias export for backward compatibility
export const aiService = smartAIService;
