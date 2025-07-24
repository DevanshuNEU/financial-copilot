# EXPENSESINK Project Structure

```
financial-copilot/
├── .editorconfig           # Editor configuration
├── .gitignore             # Git ignore rules
├── CONTRIBUTING.md        # Contribution guidelines
├── LICENSE                # MIT License
├── README.md              # Project documentation
├── package.json           # Root package configuration
│
├── frontend/              # React application
│   ├── public/           # Static assets
│   ├── src/              # Source code
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── utils/        # Utilities
│   │   └── types/        # TypeScript types
│   ├── .env.example      # Environment template
│   └── package.json      # Frontend dependencies
│
├── supabase/              # Supabase configuration
│   ├── config.toml       # Project config
│   └── functions/        # Edge Functions
│       ├── _shared/      # Shared modules
│       └── [12 functions]
│
├── backend/               # Legacy Flask (archived)
│   ├── legacy_flask/     # Old Flask code
│   └── scripts/          # Utility scripts
│
├── scripts/               # Deployment scripts
│   ├── deploy_edge_functions.sh
│   └── test_edge_functions.sh
│
└── docs/                  # Documentation
    └── docker-compose.legacy.yml
```

## Key Directories

- **frontend/**: Modern React TypeScript application
- **supabase/**: Serverless Edge Functions and configuration
- **backend/**: Archived Flask code for reference
- **scripts/**: Automation and deployment scripts
- **docs/**: Additional documentation

## Clean Architecture Benefits

✅ Clear separation of concerns  
✅ Easy to navigate  
✅ Production-ready structure  
✅ Follows industry standards  
✅ Optimized for collaboration
