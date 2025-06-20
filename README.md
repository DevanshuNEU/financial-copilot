# Financial Copilot 🤖💰

> AI-powered financial intelligence platform that transforms how businesses manage expenses, process receipts, and make data-driven financial decisions.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDevanshuNEU%2Ffinancial-copilot)

## ✨ Features

- 🧠 **AI-Powered Analytics** - Natural language queries for financial data
- 📸 **Smart Receipt Processing** - OCR + AI categorization with confidence scores  
- 📊 **Real-time Dashboards** - Beautiful, responsive financial insights
- 🔮 **Predictive Intelligence** - Budget forecasting and anomaly detection
- 💬 **Conversational Interface** - Chat with your financial data
- 📱 **Mobile-First Design** - Works seamlessly across all devices
- 🔄 **Real-time Updates** - WebSocket-powered live data synchronization
- 🏗️ **Enterprise Architecture** - Scalable microservices design

## 🚀 Tech Stack

### Frontend
- **React 18+** with TypeScript
- **shadcn/ui** + Tailwind CSS for beautiful, accessible components
- **Recharts** for data visualization  
- **WebSocket** for real-time updates

### Backend
- **Flask** (Python) RESTful API
- **PostgreSQL** for robust data storage
- **Redis** for caching and job queues
- **OpenAI API** for natural language processing

### Infrastructure
- **Railway** / **Render** for backend deployment
- **Vercel** for frontend deployment
- **Supabase** for managed PostgreSQL
- **Cloudinary** for asset management

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- Redis 6+

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/DevanshuNEU/financial-copilot.git
cd financial-copilot

# Install frontend dependencies
cd frontend
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API URLs and keys

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Add your database URL, OpenAI API key, etc.

# Run database migrations
flask db upgrade

# Start development server
flask run
```

### Docker Setup (Alternative)
```bash
# Run the entire stack with Docker Compose
docker-compose up -d

# The application will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

## 🏗️ Architecture

```mermaid
graph TB
    A[React Frontend] --> B[Flask API]
    B --> C[PostgreSQL]
    B --> D[Redis Cache]
    B --> E[OpenAI API]
    B --> F[OCR Service]
    G[WebSocket Server] --> A
    B --> G
    H[Background Workers] --> D
    H --> C
```

### Key Components

- **Dashboard Service** - Real-time financial overview and KPIs
- **Expense Service** - CRUD operations for expense management
- **Receipt Service** - OCR processing and smart categorization
- **AI Service** - Natural language query processing
- **Analytics Service** - Predictive modeling and insights
- **Notification Service** - Real-time alerts and updates

## 📊 API Documentation

### Core Endpoints

```typescript
// Expense Management
GET    /api/expenses              # List all expenses
POST   /api/expenses              # Create new expense
GET    /api/expenses/:id          # Get specific expense
PUT    /api/expenses/:id          # Update expense
DELETE /api/expenses/:id          # Delete expense

// Receipt Processing
POST   /api/receipts/upload       # Upload and process receipt
GET    /api/receipts/:id/status   # Check processing status

// AI Analytics
POST   /api/ai/query              # Natural language query
GET    /api/ai/insights           # Get AI-generated insights
POST   /api/ai/categorize         # Categorize expense

// Real-time Features
WS     /ws/expenses               # Live expense updates
WS     /ws/notifications          # Real-time alerts
```

### Example API Usage

```javascript
// Natural language query
const response = await fetch('/api/ai/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "Show me software expenses over $100 this quarter"
  })
});

// Receipt processing
const formData = new FormData();
formData.append('receipt', file);
const result = await fetch('/api/receipts/upload', {
  method: 'POST',
  body: formData
});
```

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) for consistency and accessibility:

- `<ExpenseCard />` - Individual expense display
- `<ReceiptUpload />` - Drag-and-drop receipt processing
- `<AIChat />` - Conversational query interface
- `<InsightsDashboard />` - Analytics overview
- `<ExpenseChart />` - Interactive data visualization

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test              # Run unit tests
npm run test:e2e          # Run Cypress E2E tests
npm run test:coverage     # Generate coverage report
```

### Backend Tests
```bash
cd backend
pytest                    # Run all tests
pytest --cov             # Run with coverage
pytest tests/unit         # Unit tests only
pytest tests/integration  # Integration tests only
```

## 🚀 Deployment

### Railway (Backend)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main

### Vercel (Frontend)
1. Connect repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set environment variables
4. Deploy automatically

### Environment Variables

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-api.railway.app
NEXT_PUBLIC_WS_URL=wss://your-api.railway.app
```

#### Backend (.env)
```bash
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
OPENAI_API_KEY=sk-...
SECRET_KEY=your-secret-key
CLOUDINARY_URL=cloudinary://...
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
5. Push to your fork and submit a Pull Request

### Code Style
- **Frontend**: ESLint + Prettier
- **Backend**: Black + isort + Flake8
- **Commits**: Conventional Commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the amazing component library
- [Cal.com](https://github.com/calcom/cal.com) for open-source inspiration
- [OpenAI](https://openai.com/) for AI capabilities
- The React and Flask communities for excellent documentation

---

<div align="center">
  <strong>Built with ❤️ and ☕</strong>
  <br />
  <sub>Star ⭐ the repo if you find it useful!</sub>
</div>
