<div align="center">
  <img src="https://raw.githubusercontent.com/DevanshuNEU/financial-copilot/main/assets/logo.png" alt="Financial Copilot Logo" width="120" height="120">
  
  # Financial Copilot 🤖💰
  
  ### AI-powered financial intelligence platform
  
  Transform how businesses manage expenses, process receipts, and make data-driven financial decisions with cutting-edge AI technology.
  
  [![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
  [![Built with Flask](https://img.shields.io/badge/Built%20with-Flask-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

  [Demo](#demo) • [Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Contributing](#contributing)
</div>

---

## 🎯 Overview

Financial Copilot is a modern, AI-powered financial intelligence platform designed for businesses who want to streamline their expense management, automate receipt processing, and gain actionable insights from their financial data. Built with enterprise-grade architecture and a focus on developer experience.

**Why Financial Copilot?**
- **🧠 AI-First**: Natural language queries for complex financial analysis
- **📸 Smart Processing**: OCR + AI categorization with confidence scoring
- **📊 Real-time Intelligence**: Live dashboards with predictive analytics  
- **🔮 Future-Ready**: Built for scale with microservices architecture
- **💬 Conversational**: Chat with your financial data like never before

---

## ✨ Features

### Core Financial Management
- **💳 Expense Tracking** - Comprehensive expense management with automatic categorization
- **📊 Real-time Dashboard** - Beautiful, responsive financial insights and KPIs
- **📈 Analytics & Reporting** - Advanced financial reporting with custom date ranges
- **🔍 Smart Search** - Find expenses instantly with intelligent search algorithms

### AI-Powered Intelligence  
- **🤖 Natural Language Queries** - Ask questions like "Show me software expenses over $100 this quarter"
- **📸 Receipt Processing** - OCR + AI categorization with confidence scores
- **🔮 Predictive Analytics** - Budget forecasting and anomaly detection
- **💡 Smart Insights** - AI-generated financial recommendations

### Developer Experience
- **🚀 Modern Stack** - React 18, TypeScript, Flask, PostgreSQL
- **🎨 Beautiful UI** - shadcn/ui components with Tailwind CSS
- **📱 Mobile-First** - Responsive design that works on all devices
- **🔄 Real-time Updates** - WebSocket-powered live data synchronization
- **🏗️ Scalable Architecture** - Enterprise-ready microservices design

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Python** (3.9 or higher) - [Download here](https://python.org/)
- **Git** - [Download here](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DevanshuNEU/financial-copilot.git
   cd financial-copilot
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1 - Backend (Flask)
   cd backend && source venv/bin/activate && python simple_app.py
   
   # Terminal 2 - Frontend (React)
   cd frontend && npm start
   ```

5. **Open your browser**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5002](http://localhost:5002)

**🎉 That's it!** You should see the Financial Copilot dashboard with sample expense data.

---## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Financial Copilot                        │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React + TypeScript)                             │
│  ├── Dashboard Components                                   │
│  ├── API Service Layer                                      │
│  ├── shadcn/ui + Tailwind CSS                              │
│  └── Real-time WebSocket Client                            │
├─────────────────────────────────────────────────────────────┤
│  Backend (Flask Python)                                    │
│  ├── RESTful API Endpoints                                 │
│  ├── SQLAlchemy ORM                                        │
│  ├── AI Service Integration                                │
│  └── WebSocket Server                                      │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                │
│  ├── PostgreSQL (Production)                               │
│  ├── SQLite (Development)                                  │
│  ├── Redis (Caching & Jobs)                               │
│  └── OpenAI API                                           │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

**Frontend**
- ⚡️ **React 18** - Modern React with concurrent features
- 🔷 **TypeScript** - Type-safe development
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **shadcn/ui** - High-quality, accessible UI components
- 📊 **Recharts** - Responsive chart library
- 🔄 **WebSocket** - Real-time data updates

**Backend**
- 🐍 **Flask** - Lightweight, flexible Python web framework
- 🗄️ **SQLAlchemy** - Python SQL toolkit and ORM
- 🚀 **Flask-CORS** - Cross-origin resource sharing
- 🔌 **Flask-SocketIO** - WebSocket support
- 🧠 **OpenAI API** - Natural language processing

**Database & Infrastructure**
- 🐘 **PostgreSQL** - Production database
- 🗃️ **SQLite** - Development database
- ⚡ **Redis** - Caching and job queues
- 🐳 **Docker** - Containerization
- ☁️ **Railway/Vercel** - Deployment platforms

---

## 📊 API Reference

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/api/expenses` | List all expenses |
| `POST` | `/api/expenses` | Create new expense |
| `GET` | `/api/expenses/:id` | Get specific expense |
| `PUT` | `/api/expenses/:id` | Update expense |
| `DELETE` | `/api/expenses/:id` | Delete expense |
| `GET` | `/api/dashboard/overview` | Dashboard analytics |

### Example Usage

**Get all expenses**
```javascript
const response = await fetch('/api/expenses');
const data = await response.json();
console.log(data.expenses); // Array of expense objects
```

**Create new expense**
```javascript
const expense = {
  amount: 120.50,
  category: 'software',
  description: 'Monthly subscription',
  vendor: 'Adobe'
};

const response = await fetch('/api/expenses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(expense)
});
```

---## 🧪 Development

### Project Structure

```
financial-copilot/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   └── dashboard/  # Dashboard components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript definitions
│   │   └── lib/           # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Dependencies & scripts
├── backend/                 # Flask Python API
│   ├── simple_app.py       # Main application
│   ├── requirements.txt    # Python dependencies
│   └── venv/              # Virtual environment
├── docker-compose.yml      # Multi-container setup
└── README.md              # You are here
```

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend `.env`**
```env
DATABASE_URL=sqlite:///financial_copilot.db
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=sk-your-openai-api-key
REDIS_URL=redis://localhost:6379
```

**Frontend `.env.local`**
```env
REACT_APP_API_URL=http://localhost:5002
REACT_APP_WS_URL=ws://localhost:5002
```

### Available Scripts

**Backend**
```bash
cd backend
source venv/bin/activate
python simple_app.py          # Start development server
python -m pytest             # Run tests
python -m flask db upgrade   # Run database migrations
```

**Frontend**
```bash
cd frontend
npm start                     # Start development server
npm test                      # Run test suite
npm run build                # Build for production
npm run lint                 # Run ESLint
```

### Code Quality

We maintain high code quality standards:

- **ESLint + Prettier** for frontend code formatting
- **Black + isort + Flake8** for Python code formatting  
- **Conventional Commits** for commit message standards
- **TypeScript** for type safety
- **Comprehensive testing** with Jest and Pytest

---

## 🚀 Deployment

### Docker Deployment

The easiest way to run Financial Copilot in production:

```bash
# Clone and navigate to project
git clone https://github.com/DevanshuNEU/financial-copilot.git
cd financial-copilot

# Start with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5002
```

### Manual Deployment

**Railway (Backend)**
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main

**Vercel (Frontend)**
1. Connect repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set environment variables
4. Deploy automatically

### Environment Setup

**Production Environment Variables**
```env
# Backend
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
OPENAI_API_KEY=sk-...
SECRET_KEY=your-production-secret-key

# Frontend
NEXT_PUBLIC_API_URL=https://your-api.railway.app
NEXT_PUBLIC_WS_URL=wss://your-api.railway.app
```

---## 🤝 Contributing

We love our contributors! Here's how you can contribute to Financial Copilot:

### Getting Started

1. **Fork the repository** and clone your fork
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow our development setup** from the [Development](#development) section
4. **Make your changes** and ensure they follow our coding standards
5. **Test your changes** thoroughly
6. **Commit your changes**: `git commit -m "feat: add amazing feature"`
7. **Push to your fork**: `git push origin feature/amazing-feature`
8. **Submit a Pull Request**

### Development Guidelines

- **Follow conventional commits**: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- **Write tests** for new functionality
- **Update documentation** as needed
- **Ensure code quality** with our linting rules
- **Keep PRs focused** - one feature/fix per PR

### Code Style

**Frontend (React/TypeScript)**
- Use functional components with hooks
- Follow React best practices
- Use TypeScript for type safety
- Style with Tailwind CSS utility classes
- Use shadcn/ui components when possible

**Backend (Python/Flask)**
- Follow PEP 8 style guidelines
- Use type hints where appropriate
- Write comprehensive docstrings
- Handle errors gracefully
- Use SQLAlchemy for database operations

### Reporting Issues

Found a bug? Have a feature request? Please use our issue templates:
- 🐛 [Bug Report](https://github.com/DevanshuNEU/financial-copilot/issues/new?template=bug_report.md)
- 💡 [Feature Request](https://github.com/DevanshuNEU/financial-copilot/issues/new?template=feature_request.md)

---

## 📚 Documentation

### Additional Resources

- **[API Documentation](docs/api.md)** - Complete API reference
- **[Component Guide](docs/components.md)** - Frontend component documentation  
- **[Deployment Guide](docs/deployment.md)** - Production deployment instructions
- **[Contributing Guide](CONTRIBUTING.md)** - Detailed contribution guidelines
- **[Changelog](CHANGELOG.md)** - Version history and updates

### Learning Resources

- **[React Documentation](https://reactjs.org/docs)** - Learn React
- **[TypeScript Handbook](https://www.typescriptlang.org/docs)** - TypeScript guide
- **[Flask Documentation](https://flask.palletsprojects.com/)** - Flask framework
- **[Tailwind CSS](https://tailwindcss.com/docs)** - CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - UI component library

---

## 🎯 Roadmap

### Phase 1: Foundation ✅
- [x] Basic expense management
- [x] Real-time dashboard
- [x] REST API endpoints
- [x] TypeScript integration
- [x] shadcn/ui components

### Phase 2: AI Integration 🚧
- [ ] Receipt OCR processing
- [ ] Natural language queries
- [ ] AI-powered categorization
- [ ] Smart insights generation
- [ ] Expense prediction models

### Phase 3: Advanced Features 📋
- [ ] Multi-user support
- [ ] Role-based permissions
- [ ] Advanced reporting
- [ ] Export capabilities
- [ ] Mobile app development

### Phase 4: Enterprise 🔮
- [ ] SSO integration
- [ ] Advanced analytics
- [ ] API rate limiting
- [ ] Audit logging
- [ ] Custom integrations

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Financial Copilot

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 🙏 Acknowledgments

Special thanks to the amazing open-source community and these projects that inspired Financial Copilot:

- **[shadcn/ui](https://ui.shadcn.com/)** for the incredible component library
- **[Cal.com](https://github.com/calcom/cal.com)** for open-source inspiration and architectural patterns
- **[Dub](https://github.com/dubinc/dub)** for demonstrating modern SaaS development practices
- **[OpenAI](https://openai.com/)** for AI capabilities and API access
- **The React and Flask communities** for excellent documentation and support

---

## 💫 Support

- **⭐ Star this repository** if you find it helpful
- **🐛 Report bugs** via GitHub Issues
- **💡 Request features** through GitHub Discussions
- **📧 Contact us** at [your-email@domain.com](mailto:your-email@domain.com)

---

<div align="center">
  
  **Built with ❤️ and ☕ by [DevanshuNEU](https://github.com/DevanshuNEU)**
  
  Made with modern web technologies • Designed for developers • Built for the future
  
  [⬆ Back to Top](#financial-copilot-)
  
</div>
