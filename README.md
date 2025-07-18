# Cloud Resume Challenge - Samuel Adusei Boateng

[![Deploy Cloud Resume](https://github.com/samuel-boateng/cloud-resume/actions/workflows/deploy.yml/badge.svg)](https://github.com/samuel-boateng/cloud-resume/actions/workflows/deploy.yml)
[![AWS](https://img.shields.io/badge/AWS-Cloud-orange)](https://aws.amazon.com/)
[![Terraform](https://img.shields.io/badge/Terraform-IaC-blue)](https://terraform.io/)

A serverless, cloud-native resume website built as part of the [Cloud Resume Challenge](https://cloudresumechallenge.dev/). This project demonstrates modern cloud architecture patterns, Infrastructure as Code (IaC), and CI/CD best practices.

## 🚀 Live Demo

- **Website**: [Your S3 Website URL]
- **API Endpoint**: [Your API Gateway URL]

## 📋 Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Monitoring](#monitoring)
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

- **Serverless Architecture**: Cost-effective, scalable, and maintenance-free
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Real-time Visitor Counter**: Dynamic visitor tracking with smooth animations
- **Infrastructure as Code**: Complete infrastructure defined in Terraform
- **CI/CD Pipeline**: Automated deployment with GitHub Actions
- **Monitoring & Alerting**: CloudWatch integration with custom alarms
- **Security Best Practices**: IAM roles with least privilege access
- **Performance Optimized**: Fast loading times and efficient API calls

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **JavaScript (ES6+)** - Interactive functionality
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### Backend
- **Python 3.9** - Lambda runtime
- **Boto3** - AWS SDK for Python
- **AWS Lambda** - Serverless compute
- **Amazon API Gateway** - REST API
- **Amazon DynamoDB** - NoSQL database

### Infrastructure
- **AWS S3** - Static website hosting
- **AWS CloudWatch** - Logging and monitoring
- **AWS IAM** - Security and access management
- **Terraform** - Infrastructure as Code
- **GitHub Actions** - CI/CD pipeline

## 📋 Prerequisites

Before you begin, ensure you have:

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with your credentials
3. **Terraform** (v1.0+) installed
4. **Git** for version control
5. **GitHub Account** for repository hosting

### Required AWS Permissions

Your AWS user/role needs permissions for:
- S3 (bucket creation, static website hosting)
- Lambda (function creation, execution)
- API Gateway (REST API management)
- DynamoDB (table creation, read/write)
- IAM (role/policy management)
- CloudWatch (logs, alarms)

## 💻 Local Development

### Clone the Repository

```bash
git clone https://github.com/your-username/cloud-resume-project.git
cd cloud-resume-project
```

### Local Frontend Development

1. Open `frontend/index.html` in your browser
2. For local API testing, update the API URL in `frontend/script.js`
3. Use a local HTTP server for better development experience:

```bash
cd frontend
python -m http.server 8000
# Or use Node.js
npx serve .
```

### Test Lambda Function Locally

```bash
cd backend
python lambda_function.py
```

## 🚀 Deployment

### Option 1: Automated Deployment (Recommended)

1. **Fork this repository**
2. **Set up GitHub Secrets** in your repository settings:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   TF_STATE_BUCKET=your-terraform-state-bucket
   S3_BUCKET_NAME=your-unique-bucket-name
   ```
3. **Push to main branch** - GitHub Actions will handle the rest!

### Option 2: Manual Deployment

1. **Initialize Terraform Backend**:
   ```bash
   cd terraform
   terraform init
   ```

2. **Plan Infrastructure**:
   ```bash
   terraform plan -var="bucket_name=your-unique-bucket-name"
   ```

3. **Deploy Infrastructure**:
   ```bash
   terraform apply -var="bucket_name=your-unique-bucket-name"
   ```

4. **Deploy Frontend**:
   ```bash
   aws s3 sync frontend/ s3://your-bucket-name/
   ```

5. **Update API URL** in frontend/script.js with the API Gateway URL from Terraform outputs

## 📁 Project Structure

```
cloud-resume-project/
├── .github/workflows/
│   └── deploy.yml                 # GitHub Actions CI/CD pipeline
├── backend/
│   ├── lambda_function.py         # Python Lambda function
│   └── requirements.txt           # Python dependencies
├── frontend/
│   ├── index.html                 # Main HTML file
│   ├── style.css                  # CSS styling
│   └── script.js                  # JavaScript functionality
├── terraform/
│   ├── main.tf                    # Main Terraform configuration
│   ├── variables.tf               # Input variables
│   └── outputs.tf                 # Output values
└── README.md                      # This file
```

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

## 📊 Monitoring

The project includes comprehensive monitoring:

### CloudWatch Logs
- Lambda function execution logs
- API Gateway access logs
- Error tracking and debugging

### CloudWatch Alarms
- Lambda error rate monitoring (>5% threshold)
- API Gateway error rate monitoring
- Automatic notifications (configure SNS for alerts)

### Metrics Dashboard
Monitor key metrics:
- Visitor count trends
- API response times
- Error rates
- Cost optimization

## 🔧 Customization

### Personal Information
Update the following files with your information:
- `frontend/index.html` - Personal details, experience, projects
- `frontend/style.css` - Colors, fonts, layout preferences
- `terraform/variables.tf` - Default values, bucket names

### Adding New Features
- **Contact Form**: Add form handling in Lambda
- **Blog Section**: Extend with CMS integration
- **Analytics**: Add Google Analytics or AWS analytics
- **CDN**: Add CloudFront distribution for global delivery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Cloud Resume Challenge](https://cloudresumechallenge.dev/) by Forrest Brazeal
- AWS Documentation and best practices
- Terraform AWS Provider documentation
- Open source community for tools and inspiration

## 📧 Contact

**Samuel Adusei Boateng**
- Email: samuel.boateng@email.com
- LinkedIn: [Your LinkedIn Profile]
- GitHub: [Your GitHub Profile]

---

**Built with ❤️ as part of the Cloud Resume Challenge**

# Cloud Resume Challenge

This project implements the Cloud Resume Challenge using AWS services.

## Architecture

- **Frontend**: Static website (HTML, CSS, JavaScript)
- **Hosting**: S3 + CloudFront
- **Infrastructure**: Terraform
- **CI/CD**: GitHub Actions

## Setup Instructions

1. **Create AWS IAM User**
   - Add S3 and CloudFront permissions
   - Generate access keys

2. **Create Terraform State Bucket**
   - Manually create S3 bucket for state
   - Update `infrastructure/terraform.tf` with bucket name

3. **Add GitHub Secrets**
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `S3_BUCKET_NAME` (after infrastructure deployment)
   - `CLOUDFRONT_DISTRIBUTION_ID` (after infrastructure deployment)

4. **Deploy**
   ```bash
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```

## Workflows

- **Infrastructure**: Deploys AWS resources via Terraform
- **Frontend**: Builds and deploys website to S3

## Next Steps

- [ ] Add visitor counter with Lambda and DynamoDB
- [ ] Add custom domain
- [ ] Add SSL certificate