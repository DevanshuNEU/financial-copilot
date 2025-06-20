import React from 'react';
import { Button } from '@/components/ui/button';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">
          Financial Copilot 🤖💰
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          AI-powered financial intelligence platform that transforms how businesses 
          manage expenses, process receipts, and make data-driven financial decisions.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
