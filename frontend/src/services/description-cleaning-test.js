/**
 * Test the enhanced description cleaning
 */

// Test cases based on the problematic examples
const testCases = [
  {
    input: "Flight tickets for dollars to dallas $14",
    expected: "Flight tickets to Dallas"
  },
  {
    input: "Got coke from panera for $ man $5.74",
    expected: "Coke from Panera"
  },
  {
    input: "i spent on food that was sushi $100",
    expected: "Sushi"
  },
  {
    input: "paid for uber to campus $8",
    expected: "Uber to campus"
  },
  {
    input: "bought textbooks for chemistry class $120",
    expected: "Chemistry textbooks"
  }
];

console.log('Testing enhanced description cleaning...\n');

// Mock the cleaning function for testing
function mockCleanDescription(input) {
  let clean = input.trim();
  
  // Remove amounts first
  clean = clean.replace(/\$[\d,]*\.?\d*/g, '');
  
  // Remove filler words
  const fillerWords = [
    'I spent', 'I paid', 'Paid for', 'Spent on', 'Bought', 'Got', 'Purchase of', 
    'Cost of', 'Expense for', 'Was', 'Were', 'Had', 'Took', 'Went for',
    'for dollars', 'dollars', 'dollar', 'bucks', 'buck', 'money', 'cash',
    'for $', 'for', 'on', 'at', 'to', 'from', 'with', 'man', 'dude', 'bro'
  ];
  
  for (const filler of fillerWords) {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    clean = clean.replace(regex, ' ');
  }
  
  // Clean up spaces
  clean = clean.replace(/\s+/g, ' ').trim();
  
  // Remove leading/trailing articles
  clean = clean.replace(/^(a|an|the|for|to|from|at|in|on|with)\s+/i, '');
  clean = clean.replace(/\s+(a|an|the|for|to|from|at|in|on|with)$/i, '');
  
  // Smart capitalize
  const words = clean.toLowerCase().split(' ');
  const alwaysCapitalize = ['starbucks', 'panera', 'dallas', 'uber', 'campus'];
  
  const result = words.map((word, index) => {
    if (index === 0 || alwaysCapitalize.includes(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  }).join(' ');
  
  return result || 'Expense';
}

// Test each case
testCases.forEach(testCase => {
  const result = mockCleanDescription(testCase.input);
  const passed = result === testCase.expected;
  
  console.log(`Input: "${testCase.input}"`);
  console.log(`Expected: "${testCase.expected}"`);
  console.log(`Got: "${result}"`);
  console.log(`Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log('---');
});

console.log('Test complete!');
