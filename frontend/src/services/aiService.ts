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
You are an expert financial assistant for college students. Your job is to extract clean, professional expense information from natural language.

CRITICAL RULES:
1. Extract the EXACT amount mentioned (don't guess or estimate)
2. Create a CLEAN, professional description (remove "I spent", "paid", etc.)
3. Choose the MOST SPECIFIC category that fits
4. Use proper capitalization and formatting
5. Be smart about context clues (location, time, student life)

INPUT: "${input}"

CATEGORIES (choose the most specific one):
- Food & Dining: meals, snacks, restaurants, coffee, groceries, dining halls
- Transportation: uber, lyft, gas, bus, train, parking, metro, bike rental
- Education: textbooks, supplies, lab fees, course materials, printing, software
- Entertainment: movies, concerts, games, streaming, music, events, parties
- Healthcare: doctor, pharmacy, medicine, prescriptions, health services
- Shopping: clothes, electronics, personal items, household goods
- Bills & Utilities: rent, utilities, phone, internet, subscriptions, insurance
- Other: anything that doesn't fit the above categories

EXAMPLES OF GOOD EXTRACTION:
Input: "I spent $15 on coffee at Starbucks this morning"
Output: {"amount": 15, "description": "Coffee at Starbucks", "category": "Food & Dining", "confidence": 0.95}

Input: "paid $25 for lunch at the cafeteria"
Output: {"amount": 25, "description": "Lunch at cafeteria", "category": "Food & Dining", "confidence": 0.9}

Input: "bought textbooks for chemistry class $120"
Output: {"amount": 120, "description": "Chemistry textbooks", "category": "Education", "confidence": 0.95}

Input: "uber to campus was $8"
Output: {"amount": 8, "description": "Uber to campus", "category": "Transportation", "confidence": 0.9}

Input: "dinner with friends cost me $35"
Output: {"amount": 35, "description": "Dinner with friends", "category": "Food & Dining", "confidence": 0.85}

Input: "netflix subscription $12.99"
Output: {"amount": 12.99, "description": "Netflix subscription", "category": "Entertainment", "confidence": 0.95}

Input: "gas for car $45"
Output: {"amount": 45, "description": "Gas", "category": "Transportation", "confidence": 0.9}

Input: "went to movies spent $18"
Output: {"amount": 18, "description": "Movie tickets", "category": "Entertainment", "confidence": 0.85}

DESCRIPTION RULES:
- Remove: "I spent", "paid", "cost me", "was", etc.
- Keep: location, item name, purpose
- Use: proper capitalization, concise phrasing
- Format: "Item" or "Item at Location" or "Item for Purpose"

Now extract from the input above. Return ONLY a JSON object with this exact structure:
{
  "amount": number,
  "description": "string",
  "category": "string",
  "confidence": number (0.0 to 1.0)
}

No additional text, explanations, or formatting. Just the JSON object.
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

      // Clean up description with post-processing
      const cleanDescription = this.cleanDescription(parsed.description);

      return {
        success: true,
        expense: {
          amount: amount,
          description: cleanDescription,
          category: parsed.category,
          vendor: this.extractVendor(cleanDescription),
          status: 'approved' as const,
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
   * Clean and format description for professional appearance
   * @param description - Raw description from AI
   * @returns Clean, formatted description
   */
  private cleanDescription(description: string): string {
    let clean = description.trim();
    
    // Remove common prefixes that might slip through
    const prefixesToRemove = [
      'I spent',
      'I paid',
      'Paid for',
      'Spent on',
      'Bought',
      'Purchase of',
      'Cost of',
      'Expense for'
    ];
    
    for (const prefix of prefixesToRemove) {
      const regex = new RegExp(`^${prefix}\\s*`, 'i');
      clean = clean.replace(regex, '');
    }
    
    // Remove dollar signs and amounts that might be in description
    clean = clean.replace(/\$[\d,]+\.?\d*/g, '').trim();
    
    // Remove extra words
    clean = clean.replace(/^(on|for|at)\s+/i, '');
    
    // Capitalize first letter
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
    
    // Remove extra spaces
    clean = clean.replace(/\s+/g, ' ').trim();
    
    // If description is too generic, make it more specific
    if (clean.length < 3) {
      clean = 'Expense';
    }
    
    return clean;
  }

  /**
   * Extract vendor/location from description
   * @param description - Cleaned description
   * @returns Vendor name or 'Unknown'
   */
  private extractVendor(description: string): string {
    const lowerDesc = description.toLowerCase();
    
    // Common vendor patterns
    const vendors = [
      'starbucks', 'subway', 'mcdonalds', 'chipotle', 'panera',
      'uber', 'lyft', 'amazon', 'target', 'walmart', 'apple',
      'netflix', 'spotify', 'hulu', 'disney', 'cafeteria'
    ];
    
    for (const vendor of vendors) {
      if (lowerDesc.includes(vendor)) {
        return vendor.charAt(0).toUpperCase() + vendor.slice(1);
      }
    }
    
    // Check for "at [location]" pattern
    const atMatch = description.match(/\bat\s+([A-Za-z\s]+)/i);
    if (atMatch) {
      return atMatch[1].trim();
    }
    
    return 'Unknown';
  }

  /**
   * Fallback parsing using regex patterns
   * @param input - Natural language input
   * @returns AIExpenseProcessing
   */
  private fallbackParsing(input: string): AIExpenseProcessing {
    try {
      const lowerInput = input.toLowerCase();
      
      // Extract amount using regex - improved patterns
      const amountPatterns = [
        /\$(\d+\.?\d*)/,  // $15, $15.50
        /(\d+\.?\d*)\s*dollars?/,  // 15 dollars, 15.50 dollar
        /(\d+\.?\d*)\s*bucks?/,  // 15 bucks
        /(\d+\.?\d*)\s*\$/, // 15$
      ];
      
      let amount = 0;
      let amountMatch = null;
      
      for (const pattern of amountPatterns) {
        amountMatch = input.match(pattern);
        if (amountMatch) {
          amount = parseFloat(amountMatch[1]);
          break;
        }
      }
      
      if (!amountMatch || isNaN(amount) || amount <= 0) {
        return {
          success: false,
          error: 'No valid amount found in input',
          confidence: 0
        };
      }

      // Enhanced category detection with more patterns
      let category: string = 'Other';
      let maxMatches = 0;
      let confidence = 0.3;

      // Enhanced patterns with more context
      const enhancedPatterns = {
        'Food & Dining': [
          'coffee', 'starbucks', 'cafe', 'pizza', 'sushi', 'burger', 'sandwich',
          'lunch', 'dinner', 'breakfast', 'snack', 'restaurant', 'dining', 'food',
          'meal', 'cafeteria', 'mcdonalds', 'subway', 'chipotle', 'panera', 'kfc',
          'taco', 'pasta', 'rice', 'noodles', 'soup', 'salad', 'drink', 'smoothie'
        ],
        'Transportation': [
          'uber', 'lyft', 'taxi', 'cab', 'bus', 'train', 'metro', 'subway',
          'gas', 'fuel', 'parking', 'toll', 'flight', 'airline', 'airport',
          'ride', 'drive', 'commute', 'transport', 'car', 'bike', 'scooter'
        ],
        'Education': [
          'textbook', 'book', 'supplies', 'tuition', 'lab', 'course', 'class',
          'school', 'university', 'college', 'homework', 'assignment', 'project',
          'pen', 'pencil', 'paper', 'notebook', 'calculator', 'software', 'license'
        ],
        'Entertainment': [
          'movie', 'cinema', 'theater', 'concert', 'game', 'gaming', 'party',
          'bar', 'club', 'streaming', 'music', 'netflix', 'spotify', 'hulu',
          'disney', 'amazon prime', 'youtube', 'twitch', 'fun', 'hobby'
        ],
        'Healthcare': [
          'doctor', 'hospital', 'clinic', 'pharmacy', 'medicine', 'prescription',
          'health', 'medical', 'dentist', 'insurance', 'therapy', 'checkup'
        ],
        'Shopping': [
          'clothes', 'clothing', 'shirt', 'pants', 'shoes', 'amazon', 'target',
          'walmart', 'mall', 'store', 'shopping', 'online', 'purchase', 'buy',
          'electronics', 'phone', 'computer', 'headphones', 'watch'
        ],
        'Bills & Utilities': [
          'rent', 'utilities', 'phone', 'internet', 'wifi', 'electricity', 'water',
          'bill', 'subscription', 'insurance', 'loan', 'payment', 'monthly'
        ]
      };

      // Find best matching category
      for (const [cat, keywords] of Object.entries(enhancedPatterns)) {
        const matches = keywords.filter(keyword => lowerInput.includes(keyword)).length;
        if (matches > maxMatches) {
          maxMatches = matches;
          category = cat;
          confidence = matches > 2 ? 0.8 : matches > 1 ? 0.6 : 0.4;
        }
      }

      // Create smart description
      let description = this.createSmartDescription(input, category);
      
      // Extract vendor
      const vendor = this.extractVendor(description);

      return {
        success: true,
        expense: {
          amount: amount,
          description: description,
          category: category,
          vendor: vendor,
          status: 'approved' as const,
          created_at: new Date().toISOString(),
          id: 0
        },
        confidence: confidence,
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
   * Create smart description from input
   * @param input - Original input
   * @param category - Detected category
   * @returns Smart description
   */
  private createSmartDescription(input: string, category: string): string {
    let description = input;
    
    // Remove amount from description
    description = description.replace(/\$?\d+\.?\d*/g, '').trim();
    
    // Remove common prefixes
    const prefixes = [
      'i spent', 'i paid', 'paid for', 'spent on', 'bought', 'purchase',
      'cost me', 'was', 'were', 'for', 'on', 'at'
    ];
    
    for (const prefix of prefixes) {
      const regex = new RegExp(`^${prefix}\\s*`, 'i');
      description = description.replace(regex, '');
    }
    
    // Clean up and capitalize
    description = description.replace(/\s+/g, ' ').trim();
    description = description.charAt(0).toUpperCase() + description.slice(1);
    
    // Add context based on category if description is too generic
    if (description.length < 3) {
      switch (category) {
        case 'Food & Dining':
          description = 'Food';
          break;
        case 'Transportation':
          description = 'Transportation';
          break;
        case 'Education':
          description = 'School supplies';
          break;
        default:
          description = 'Expense';
      }
    }
    
    return description;
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
   * @returns string[] - Contextual suggestions
   */
  getSuggestions(input: string): string[] {
    const suggestions: string[] = [];
    const lower = input.toLowerCase();

    // Coffee-related suggestions
    if (lower.includes('coffee') || lower.includes('starbucks') || lower.includes('cafe')) {
      suggestions.push('I spent $5 on coffee at Starbucks');
      suggestions.push('I spent $4.50 on coffee at the campus cafe');
      suggestions.push('I spent $6 on coffee and pastry');
    }
    
    // Food-related suggestions
    else if (lower.includes('lunch') || lower.includes('dinner') || lower.includes('food')) {
      suggestions.push('I spent $12 on lunch at the cafeteria');
      suggestions.push('I spent $25 on dinner with friends');
      suggestions.push('I spent $8 on sushi for lunch');
    }
    
    // Transportation suggestions
    else if (lower.includes('uber') || lower.includes('lyft') || lower.includes('ride')) {
      suggestions.push('I spent $8 on Uber to campus');
      suggestions.push('I spent $12 on Lyft to the airport');
      suggestions.push('I spent $15 on rideshare downtown');
    }
    
    // Education suggestions
    else if (lower.includes('book') || lower.includes('textbook') || lower.includes('supplies')) {
      suggestions.push('I spent $120 on textbooks for chemistry');
      suggestions.push('I spent $45 on lab supplies');
      suggestions.push('I spent $25 on notebooks and pens');
    }
    
    // Entertainment suggestions
    else if (lower.includes('movie') || lower.includes('game') || lower.includes('fun')) {
      suggestions.push('I spent $15 on movie tickets');
      suggestions.push('I spent $60 on video games');
      suggestions.push('I spent $30 on concert tickets');
    }
    
    // General suggestions if nothing specific matches
    else if (lower.length > 1) {
      suggestions.push('I spent $15 on coffee at Starbucks');
      suggestions.push('I spent $12 on lunch at the cafeteria');
      suggestions.push('I spent $8 on Uber to campus');
      suggestions.push('I spent $25 on textbooks');
    }

    return suggestions.slice(0, 3); // Limit to 3 suggestions
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
