# Cloud Resume Challenge - Samuel Adusei Boateng

[![Deploy Cloud Resume](https://github.com/adusei2023/cloud-resume-project/actions/workflows/deploy.yml/badge.svg)](https://github.com/adusei2023/cloud-resume-project/actions/workflows/deploy.yml)
[![AWS](https://img.shields.io/badge/AWS-Cloud-orange)](https://aws.amazon.com/)
[![Terraform](https://img.shields.io/badge/Terraform-IaC-blue)](https://terraform.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A modern, serverless cloud resume website built as part of the [Cloud Resume Challenge](https://cloudresumechallenge.dev/). This project demonstrates modern cloud architecture patterns, Infrastructure as Code (IaC), CI/CD best practices, and contemporary web development standards.

## 🚀 Live Demo

- **Website**: [http://samuel-cloud-resume-website-2025.s3-website-us-east-1.amazonaws.com](http://samuel-cloud-resume-website-2025.s3-website-us-east-1.amazonaws.com)
- **API Endpoint**: Available via API Gateway (see deployment outputs)

## 📋 Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🏗️ Architecture

This project implements a serverless architecture on AWS:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudFront    │    │   S3 Bucket      │    │   API Gateway   │
│   (Optional)    ├────┤  Static Website  ├────┤   REST API      │
└─────────────────┘    └──────────────────┘    └─────────┬───────┘
                                                         │
                       ┌─────────────────┐              │
                       │   DynamoDB      │              │
                       │  Visitor Count  │◄─────────────┤
                       └─────────────────┘              │
                                                         │
                       ┌─────────────────┐              │
                       │  Lambda Function│◄─────────────┘
                       │  Python Runtime │
                       └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   CloudWatch    │
                       │  Logs & Alarms  │
                       └─────────────────┘
```

### Architecture Components

1. **Frontend (S3 + Static Website Hosting)**
   - Responsive HTML/CSS/JavaScript
   - Hosted on S3 with static website configuration
   - Displays resume content and visitor counter

2. **Backend (Lambda + API Gateway)**
   - Python Lambda function for visitor counting
   - RESTful API through API Gateway
   - CORS enabled for cross-origin requests

3. **Database (DynamoDB)**
   - NoSQL database for storing visitor count
   - Pay-per-request billing mode
   - Single table with visitor count record

4. **Infrastructure as Code (Terraform)**
   - Complete AWS infrastructure defined in code
   - Modular and reusable configuration
   - State managed remotely

5. **CI/CD (GitHub Actions)**
   - Automated testing and deployment
   - Infrastructure provisioning
   - Frontend deployment to S3

6. **Monitoring (CloudWatch)**
   - Lambda function logs and metrics
   - API Gateway request/error tracking
   - Custom alarms for error rates

## ✨ Features

### Core Functionality
- **Serverless Architecture**: Cost-effective, scalable, and maintenance-free
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Real-time Visitor Counter**: Dynamic visitor tracking with smooth animations
- **Infrastructure as Code**: Complete infrastructure defined in Terraform
- **CI/CD Pipeline**: Automated deployment with GitHub Actions

### Modern Development Practices
- **Code Quality**: ESLint and Prettier for consistent code formatting
- **Testing Infrastructure**: Example tests for both frontend and backend
- **Performance Monitoring**: Built-in performance tracking and logging
- **Error Handling**: Comprehensive error handling and user feedback
- **Documentation**: Extensive documentation and contribution guidelines

### Security & Monitoring
- **Security Best Practices**: IAM roles with least privilege access
- **CloudWatch Integration**: Comprehensive logging and monitoring
- **CORS Configuration**: Proper CORS headers for API security
- **Environment Management**: Secure environment variable handling

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS custom properties (variables)
- **JavaScript (ES6+)** - Modern class-based architecture
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Inter)
### Backend
- **Python 3.9+** - Lambda runtime with type hints
- **Boto3** - AWS SDK for Python
- **AWS Lambda** - Serverless compute
- **Amazon API Gateway** - REST API
- **Amazon DynamoDB** - NoSQL database

### Infrastructure & DevOps
- **AWS S3** - Static website hosting
- **AWS CloudWatch** - Logging and monitoring
- **AWS IAM** - Security and access management
- **Terraform** - Infrastructure as Code
- **GitHub Actions** - CI/CD pipeline with automated testing

### Development Tools
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Pytest** - Python testing framework
- **Jest** - JavaScript testing framework (configured)
- **Make** - Build automation

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v14+) and npm installed
2. **Python** (3.9+) installed
3. **AWS Account** with appropriate permissions
4. **AWS CLI** configured with your credentials
5. **Terraform** (v1.0+) installed
6. **Git** for version control

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/adusei2023/cloud-resume-project.git
   cd cloud-resume-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run local development server**:
   ```bash
   npm run serve
   ```

   Visit `http://localhost:8080` to see the resume locally.

## 💻 Local Development

### Frontend Development

Start the local development server:
```bash
npm run serve
# or
make dev
```

### Code Quality Checks

Run linting and formatting:
```bash
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting
npm run validate      # Run all checks
```

### Python Lambda Development

Test Lambda function locally:
```bash
cd backend
python lambda_function.py
```

## 📦 Deployment

### Automated Deployment (Recommended)

The project uses GitHub Actions for automated deployment:

1. **Fork this repository**

2. **Configure GitHub Secrets** in your repository settings:
   - `AWS_ACCESS_KEY_ID` - Your AWS access key
   - `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
   
3. **Push to main branch** - GitHub Actions will:
   - Validate code (ESLint, Prettier, Python linting)
   - Run Terraform plan (on PRs)
   - Deploy infrastructure
   - Deploy frontend to S3
   - Test the deployment

### Manual Deployment

Using the Makefile:
```bash
make init              # Initialize Terraform
make plan              # Show execution plan
make deploy            # Full deployment
```

Or using Terraform directly:
```bash
cd infrastructure
terraform init
terraform plan
terraform apply
```

Then deploy frontend:
```bash
# Get bucket name from Terraform outputs
aws s3 sync frontend/ s3://your-bucket-name/
```

## 📁 Project Structure

```
cloud-resume-project/
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD pipeline
├── backend/
│   ├── lambda_function.py       # Python Lambda function
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── index.html              # Main HTML file
│   ├── style.css               # CSS with custom properties
│   ├── script.js               # Modern ES6+ JavaScript
│   └── assets/                 # Images and other assets
├── infrastructure/
│   ├── main.tf                 # Main Terraform configuration
│   ├── variables.tf            # Input variables
│   ├── outputs.tf              # Output values
│   ├── s3.tf                   # S3 bucket configuration
│   ├── lambda.tf               # Lambda function setup
│   ├── api_gateway.tf          # API Gateway configuration
│   ├── dynamodb.tf             # DynamoDB table
│   └── monitoring.tf           # CloudWatch monitoring
├── tests/
│   ├── test_lambda.py          # Python tests
│   ├── frontend.test.js        # JavaScript tests
│   └── README.md               # Testing documentation
├── .eslintrc.json              # ESLint configuration
├── .prettierrc.json            # Prettier configuration
├── package.json                # Node.js dependencies & scripts
├── Makefile                    # Build automation
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # MIT License
└── README.md                   # This file
```

## 🔧 Development Workflow

### Making Changes

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test locally:
   ```bash
   npm run validate  # Check code quality
   npm test          # Run tests
   ```

3. Commit your changes:
   ```bash
   git commit -m "feat: add new feature"
   ```

4. Push and create a Pull Request:
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

This project uses:
- **ESLint** for JavaScript linting
- **Prettier** for code formatting
- **Conventional Commits** for commit messages

Run before committing:
```bash
npm run validate
```

## 🧪 Testing

### Running Tests

Python tests:
```bash
pytest tests/test_lambda.py -v
```

JavaScript tests:
```bash
npm test
```

### Test Coverage

Generate coverage reports:
```bash
# Python
pytest --cov=backend tests/

# JavaScript
npm test -- --coverage
```

See [tests/README.md](tests/README.md) for more details.

## 📡 API Documentation

### Get Visitor Count

**Endpoint**: `GET /visitor-count`

**Description**: Retrieves and increments the visitor count

**Response**:
```json
{
  "count": 123,
  "message": "Visitor count updated successfully"
}
```

**Error Response**:
```json
{
  "error": "Internal server error",
  "message": "Error description"
}
```

### CORS Support

The API includes full CORS support with preflight handling:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token`

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:

- Code of conduct
- Development setup
- Making changes
- Coding standards
- Pull request process
- Reporting issues

Quick contribution steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test them
4. Run `npm run validate` to check code quality
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Cloud Resume Challenge](https://cloudresumechallenge.dev/) by Forrest Brazeal
- AWS Documentation and best practices
- Terraform AWS Provider documentation
- Open source community for tools and inspiration

## 📧 Contact

**Samuel Adusei-Boateng**

- 📧 Email: [samuelad1949@gmail.com](mailto:samuelad1949@gmail.com)
- 💼 LinkedIn: [linkedin.com/in/samueladuseiboateng](https://www.linkedin.com/in/samueladuseiboateng/)
- 🐙 GitHub: [github.com/adusei2023](https://github.com/adusei2023)

## ⭐ Show Your Support

If you found this project helpful, please consider:
- Giving it a ⭐ on GitHub
- Sharing it with others
- Contributing improvements
- Providing feedback

---

**Built with ❤️ as part of the Cloud Resume Challenge** | Version 2.0.0 | Updated: 2025
