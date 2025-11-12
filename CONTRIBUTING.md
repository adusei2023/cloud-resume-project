# Contributing to Cloud Resume Project

Thank you for your interest in contributing to the Cloud Resume Project! This document provides guidelines for contributing to this repository.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/cloud-resume-project.git
   cd cloud-resume-project
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/adusei2023/cloud-resume-project.git
   ```

## 💻 Development Setup

### Prerequisites

- Node.js (v14+)
- Python 3.9+
- AWS CLI configured
- Terraform 1.0+

### Install Dependencies

```bash
npm install
```

### Run Local Development Server

```bash
npm run serve
```

The site will be available at `http://localhost:8080`

## 🔧 Making Changes

1. **Create a new branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the [Coding Standards](#coding-standards)

3. **Test your changes** thoroughly:
   ```bash
   npm run lint        # Lint JavaScript
   npm run format      # Format code
   npm test            # Run tests (if available)
   ```

4. **Commit your changes** with a clear message:
   ```bash
   git commit -m "feat: add new feature"
   ```

   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### JavaScript

- Use ES6+ features
- Follow ESLint configuration
- Use single quotes for strings
- Add JSDoc comments for functions
- Use meaningful variable names
- Keep functions small and focused

Example:
```javascript
/**
 * Calculate and animate visitor count
 * @param {HTMLElement} element - Target element
 * @param {number} count - Target count
 */
function animateCounter(element, count) {
    // Implementation
}
```

### Python

- Follow PEP 8 style guide
- Use type hints where appropriate
- Add docstrings for functions and classes
- Keep functions focused and testable

### CSS

- Use CSS custom properties (variables)
- Follow BEM naming convention when applicable
- Mobile-first responsive design
- Use semantic class names

### Terraform

- Use consistent naming conventions
- Add comments for complex logic
- Use variables for configurable values
- Tag all resources appropriately

## 🔄 Pull Request Process

1. **Update documentation** if you've made changes to functionality
2. **Ensure all tests pass** and code is linted
3. **Update the README.md** with details of changes if needed
4. **Create a Pull Request** with a clear title and description:
   - What changes were made
   - Why the changes were necessary
   - Any additional context or screenshots

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Local testing completed
- [ ] Linting passed
- [ ] Code formatted

## Screenshots (if applicable)
Add screenshots here

## Additional Notes
Any additional information
```

## 🐛 Reporting Issues

When reporting issues, please include:

1. **Clear title** describing the issue
2. **Detailed description** of the problem
3. **Steps to reproduce** the issue
4. **Expected behavior** vs actual behavior
5. **Screenshots or error messages** if applicable
6. **Environment details**:
   - OS
   - Browser (if frontend issue)
   - Node/Python version
   - AWS region

### Issue Template

```markdown
## Issue Description
Clear description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. ...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Ubuntu 22.04]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.x]
- Python version: [e.g., 3.11]

## Additional Context
Any other relevant information
```

## 🎯 Areas for Contribution

We welcome contributions in these areas:

- 🐛 **Bug fixes** - Fix issues and improve stability
- ✨ **Features** - Add new functionality
- 📚 **Documentation** - Improve or add documentation
- 🎨 **UI/UX** - Enhance user interface and experience
- ⚡ **Performance** - Optimize code performance
- 🧪 **Testing** - Add or improve tests
- 🔒 **Security** - Improve security practices
- ♿ **Accessibility** - Improve accessibility features

## 📞 Questions?

If you have questions about contributing:

- Open a [Discussion](https://github.com/adusei2023/cloud-resume-project/discussions)
- Reach out via [email](mailto:samuelad1949@gmail.com)
- Check existing issues and PRs

## 📄 License

By contributing, you agree that your contributions will be licensed under the same [MIT License](LICENSE) as the project.

---

Thank you for contributing to the Cloud Resume Project! 🎉
