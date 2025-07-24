# Contributing to EXPENSESINK

Thank you for your interest in contributing to EXPENSESINK! We welcome contributions from the community.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/financial-copilot.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Push to your fork: `git push origin feature/your-feature-name`
6. Create a Pull Request

## 📋 Development Setup

1. **Install dependencies**
   ```bash
   npm run setup
   ```

2. **Set up Supabase**
   - Create a Supabase project
   - Copy environment variables to `frontend/.env`

3. **Start development**
   ```bash
   npm run dev
   ```

## 🧪 Code Standards

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful variable names
- Add JSDoc comments for functions

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Write unit tests for components

### Edge Functions
- Follow the patterns in `_shared/` modules
- Always validate inputs
- Use proper error handling
- Return consistent response formats

## 📝 Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

Example: `feat: add expense filtering by date range`

## 🧪 Testing

- Write tests for new features
- Ensure all tests pass: `npm test`
- Test Edge Functions locally before deployment

## 📚 Documentation

- Update README.md if needed
- Add JSDoc comments to functions
- Document API changes
- Include examples for new features

## 🔍 Code Review Process

1. All PRs require at least one review
2. Address all review comments
3. Keep PRs focused and small
4. Include tests for new features
5. Ensure CI/CD passes

## 🐛 Reporting Issues

- Use GitHub Issues
- Include reproduction steps
- Provide environment details
- Add screenshots if applicable

## 💡 Feature Requests

- Open a GitHub Issue
- Describe the use case
- Explain the expected behavior
- Discuss before implementing

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
