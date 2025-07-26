# ExpenseSink

A modern, AI-powered expense tracking application built with React and Supabase Edge Functions.

## 🚀 Features

- **Smart Expense Tracking** - Track expenses with automatic categorization
- **Real-time Analytics** - Visual dashboards and spending insights
- **Budget Management** - Set and monitor budgets by category
- **AI Insights** - Get intelligent recommendations on spending
- **Weekly Comparisons** - Track spending trends week-over-week
- **Safe-to-Spend** - Daily budget calculations

## 🏗️ Architecture

```
EXPENSESINK/
├── frontend/          # React TypeScript application
├── supabase/          # Edge Functions and configuration
│   └── functions/     # Serverless API endpoints
├── backend/           # Legacy Flask code (archived)
├── scripts/           # Deployment and utility scripts
└── docs/             # Documentation
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts
- **Backend**: Supabase Edge Functions (Deno runtime)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (frontend), Supabase (backend)

## 📋 Prerequisites

- Node.js 18+
- Supabase CLI
- Supabase account and project

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/DevanshuNEU/financial-copilot.git
   cd financial-copilot
   ```

2. **Set up environment variables**
   ```bash
   cp frontend/.env.example frontend/.env
   # Add your Supabase project URL and anon key
   ```

3. **Install dependencies**
   ```bash
   npm run setup
   ```

4. **Deploy Edge Functions**
   ```bash
   npm run deploy
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   ```
   http://localhost:3000
   ```

## 📚 API Documentation

All API endpoints are implemented as Supabase Edge Functions:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health-check` | GET | API health status |
| `/expenses-list` | GET | List expenses with filters |
| `/expenses-get/{id}` | GET | Get single expense |
| `/expenses-create` | POST | Create expense |
| `/expenses-update/{id}` | PUT | Update expense |
| `/expenses-delete/{id}` | DELETE | Delete expense |
| `/dashboard-api` | GET | Dashboard metrics |
| `/analytics-api` | GET | Analytics data |
| `/weekly-comparison` | GET | Week comparison |
| `/safe-to-spend-api` | GET | Daily budget |
| `/budget-api` | GET/POST/PUT | Budget management |

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Test Edge Functions locally
cd supabase
supabase functions serve
```

## 📦 Deployment

1. **Deploy Edge Functions**
   ```bash
   npm run deploy
   ```

2. **Build frontend**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   ```

## 🔐 Environment Variables

### Frontend (.env)
```
REACT_APP_SUPABASE_URL=your-project-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Functions
Automatically available:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues and questions, please use the [GitHub Issues](https://github.com/DevanshuNEU/financial-copilot/issues) page.
