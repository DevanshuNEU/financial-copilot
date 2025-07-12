/**
 * AI Service for Financial Copilot
 * Handles all AI-related operations using Google Gemini API
 * 
 * Features:
 * - Natural language expense processing
 * - Expense categorization
 * - Amount extraction
 * - Smart suggestions
 * - Fallback parsing
 */

import { Expense } from '../types';

// AI Service Configuration
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Student-specific expense categories
const STUDENT_CATEGORIES: string[] = [
  'Food & Dining',
  'Transportation',
  'Education',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Bills & Utilities',
  'Other'
];

// Common student expense patterns
const STUDENT_PATTERNS = {
  food: ['coffee', 'pizza', 'sushi', 'burger', 'lunch', 'dinner', 'breakfast', 'snack', 'restaurant', 'dining', 'food', 'meal'],
  transportation: ['uber', 'lyft', 'bus', 'train', 'gas', 'parking', 'metro', 'taxi', 'ride'],
  education: ['textbook', 'book', 'supplies', 'tuition', 'lab', 'course', 'class', 'school', 'university', 'college'],
  entertainment: ['movie', 'concert', 'game', 'party', 'bar', 'club', 'streaming', 'music', 'netflix', 'spotify'],
  healthcare: ['doctor', 'pharmacy', 'medicine', 'hospital', 'clinic', 'prescription', 'health'],
  shopping: ['clothes', 'amazon', 'target', 'walmart', 'mall', 'store', 'shopping', 'online'],
  bills: ['rent', 'utilities', 'phone', 'internet', 'electricity', 'water', 'bill', 'subscription']
};

// AI Service Interface
export interface AIExpenseProcessing {
  success: boolean;
  expense?: Partial<Expense>;
  suggestions?: string[];
  confidence: number;
  error?: string;
}

export interface AIInsight {
  type: 'warning' | 'tip' | 'achievement' | 'suggestion';
  title: string;
  message: string;
  actionable?: boolean;
  priority: 'high' | 'medium' | 'low';
}

/**
 * AI Service Class
 * Handles all AI operations for the Financial Copilot
 */
export class AIService {
  private apiKey: string;
  private isInitialized: boolean = false;

  constructor() {
    this.apiKey = GEMINI_API_KEY || '';
    this.isInitialized = !!this.apiKey;
    
    if (!this.isInitialized) {
      console.warn('AI Service: Google Gemini API key not found. AI features will use fallback parsing.');
    }
  }

  /**
   * Process natural language input and extract expense information
   * @param input - User's natural language input
   * @returns Promise<AIExpenseProcessing>
   */
  async processExpense(input: string): Promise<AIExpenseProcessing> {
    try {
      // Input validation
      if (!input?.trim()) {
        return {
          success: false,
          error: 'Please provide expense details',
          confidence: 0
        };
      }

      // Try AI processing first
      if (this.isInitialized) {
        const aiResult = await this.processWithAI(input);
        if (aiResult.success) {
          return aiResult;
        }
      }

      // Fallback to regex parsing
      return this.fallbackParsing(input);

    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: false,
        error: 'Failed to process expense',
        confidence: 0
      };
    }
  }

  /**
   * Process expense using Google Gemini AI
   * @param input - Natural language input
   * @returns Promise<AIExpenseProcessing>
   */
  private async processWithAI(input: string): Promise<AIExpenseProcessing> {
    try {
      const prompt = this.createExpensePrompt(input);
      
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

      return this.parseAIResponse(aiResponse);

    } catch (error) {
      console.error('AI Processing Error:', error);
      return {
        success: false,
        error: 'AI processing failed',
        confidence: 0
      };
    }
  }

  /**
   * Create structured prompt for expense processing
   * @param input - User input
   * @returns string - Formatted prompt
   */
  private createExpensePrompt(input: string): string {
    return `
You are a financial assistant helping college students track expenses. 
Analyze this expense input and extract structured information.

Input: "${input}"

Extract and return ONLY a JSON object with this exact structure:
{
  "amount": number,
  "description": "string",
  "category": "string",
  "confidence": number (0-1)
}

Categories must be one of: ${STUDENT_CATEGORIES.join(', ')}

Rules:
- Always extract the amount as a positive number
- Use the most specific category that fits
- Description should be clean and concise
- Confidence should reflect how certain you are (0.0 to 1.0)
- If multiple amounts, use the main/first one
- Common student expenses: coffee, food, textbooks, transportation, entertainment

Example:
Input: "I spent $15 on coffee this morning"
Output: {"amount": 15, "description": "Coffee", "category": "Food & Dining", "confidence": 0.95}

Return only valid JSON, no additional text.
    `;
  }

  /**
   * Parse AI response and validate structure
   * @param response - AI response text
   * @returns AIExpenseProcessing
   */
  private parseAIResponse(response: string): AIExpenseProcessing {
    try {
      // Clean the response (remove markdown, extra text)
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const parsed = JSON.parse(cleanResponse);
      
      // Validate required fields
      if (!parsed.amount || !parsed.description || !parsed.category) {
        throw new Error('Missing required fields');
      }

      // Validate category
      if (!STUDENT_CATEGORIES.includes(parsed.category)) {
        parsed.category = 'Other';
      }

      // Validate amount
      const amount = parseFloat(parsed.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
      }

      return {
        success: true,
        expense: {
          amount: amount,
          description: parsed.description,
          category: parsed.category,
          vendor: 'Unknown', // Will be updated by the service
          status: 'pending' as const,
          created_at: new Date().toISOString(),
          id: 0 // Will be generated by the service
        },
        confidence: Math.min(Math.max(parsed.confidence || 0.7, 0), 1),
        suggestions: []
      };

    } catch (error) {
      console.error('AI Response Parsing Error:', error);
      return {
        success: false,
        error: 'Failed to parse AI response',
        confidence: 0
      };
    }
  }

  /**
   * Fallback parsing using regex patterns
   * @param input - Natural language input
   * @returns AIExpenseProcessing
   */
  private fallbackParsing(input: string): AIExpenseProcessing {
    try {
      const lowerInput = input.toLowerCase();
      
      // Extract amount using regex
      const amountMatch = input.match(/\$?(\d+\.?\d*)/);
      if (!amountMatch) {
        return {
          success: false,
          error: 'No amount found in input',
          confidence: 0
        };
      }

      const amount = parseFloat(amountMatch[1]);
      if (isNaN(amount) || amount <= 0) {
        return {
          success: false,
          error: 'Invalid amount',
          confidence: 0
        };
      }

      // Determine category based on keywords
      let category: string = 'Other';
      let maxMatches = 0;

      for (const [cat, keywords] of Object.entries(STUDENT_PATTERNS)) {
        const matches = keywords.filter(keyword => lowerInput.includes(keyword)).length;
        if (matches > maxMatches) {
          maxMatches = matches;
          switch (cat) {
            case 'food':
              category = 'Food & Dining';
              break;
            case 'transportation':
              category = 'Transportation';
              break;
            case 'education':
              category = 'Education';
              break;
            case 'entertainment':
              category = 'Entertainment';
              break;
            case 'healthcare':
              category = 'Healthcare';
              break;
            case 'shopping':
              category = 'Shopping';
              break;
            case 'bills':
              category = 'Bills & Utilities';
              break;
            default:
              category = 'Other';
          }
        }
      }

      // Create description
      const description = input.replace(/\$?\d+\.?\d*/, '').trim() || 'Expense';

      return {
        success: true,
        expense: {
          amount: amount,
          description: description,
          category: category,
          vendor: 'Unknown', // Will be updated by the service
          status: 'pending' as const,
          created_at: new Date().toISOString(),
          id: 0 // Will be generated by the service
        },
        confidence: maxMatches > 0 ? 0.6 : 0.3,
        suggestions: []
      };

    } catch (error) {
      console.error('Fallback Parsing Error:', error);
      return {
        success: false,
        error: 'Failed to parse expense',
        confidence: 0
      };
    }
  }

  /**
   * Generate proactive insights based on expense data
   * @param expenses - Recent expenses
   * @returns Promise<AIInsight[]>
   */
  async generateInsights(expenses: Expense[]): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    if (expenses.length === 0) {
      return insights;
    }

    // Calculate recent spending patterns
    const recentExpenses = expenses.filter(e => 
      new Date(e.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    const totalWeekly = recentExpenses.reduce((sum, e) => sum + e.amount, 0);
    const avgDaily = totalWeekly / 7;

    // Coffee spending analysis
    const coffeeExpenses = recentExpenses.filter(e => 
      e.description.toLowerCase().includes('coffee') || 
      e.description.toLowerCase().includes('starbucks')
    );

    if (coffeeExpenses.length > 3) {
      const coffeeTotal = coffeeExpenses.reduce((sum, e) => sum + e.amount, 0);
      insights.push({
        type: 'tip',
        title: 'Coffee Spending Alert',
        message: `You've spent $${coffeeTotal.toFixed(2)} on coffee this week. Consider making coffee at home to save money!`,
        actionable: true,
        priority: 'medium'
      });
    }

    // High daily spending
    if (avgDaily > 50) {
      insights.push({
        type: 'warning',
        title: 'High Daily Spending',
        message: `Your daily average is $${avgDaily.toFixed(2)}. Consider setting a daily budget limit.`,
        actionable: true,
        priority: 'high'
      });
    }

    // Achievement for tracking
    if (recentExpenses.length >= 5) {
      insights.push({
        type: 'achievement',
        title: 'Great Job Tracking!',
        message: `You've logged ${recentExpenses.length} expenses this week. Keep up the good work!`,
        actionable: false,
        priority: 'low'
      });
    }

    return insights;
  }

  /**
   * Get smart suggestions based on input
   * @param input - Partial input
   * @returns string[] - Suggestions
   */
  getSuggestions(input: string): string[] {
    const suggestions: string[] = [];
    const lower = input.toLowerCase();

    if (lower.includes('coffee')) {
      suggestions.push('I spent $5 on coffee at Starbucks');
    }
    if (lower.includes('lunch')) {
      suggestions.push('I spent $12 on lunch at the cafeteria');
    }
    if (lower.includes('uber')) {
      suggestions.push('I spent $8 on Uber to campus');
    }
    if (lower.includes('book')) {
      suggestions.push('I spent $120 on textbooks');
    }

    return suggestions;
  }

  /**
   * Check if AI service is available
   * @returns boolean
   */
  isAvailable(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const aiService = new AIService();
