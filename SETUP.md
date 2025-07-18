# Cloud Resume Project - Quick Setup Guide

This guide will help you deploy your cloud resume project step by step.

## 🚀 Quick Start

### 1. Prerequisites Setup

Before deploying, ensure you have:

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Install Terraform
wget https://releases.hashicorp.com/terraform/1.5.0/terraform_1.5.0_linux_amd64.zip
unzip terraform_1.5.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Verify installations
aws --version
terraform --version
```

### 2. AWS Configuration

```bash
# Configure AWS credentials
aws configure
# Enter your:
# - AWS Access Key ID
# - AWS Secret Access Key  
# - Default region (us-east-1)
# - Default output format (json)
```

### 3. Repository Setup

1. **Fork or clone this repository**
2. **Update bucket name** in `terraform/variables.tf`:
   ```terraform
   variable "bucket_name" {
     default = "your-unique-bucket-name-here"  # Change this!
   }
   ```

3. **Set up GitHub Secrets** (for CI/CD):
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `AWS_ACCESS_KEY_ID`: Your AWS access key
     - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key

### 4. Manual Deployment (First Time)

```bash
# Navigate to terraform directory
cd terraform/

# Initialize Terraform
terraform init

# Review what will be created
terraform plan

# Deploy infrastructure
terraform apply

# Note the outputs - you'll need the API Gateway URL
```

### 5. Deploy Frontend

```bash
# Get the API Gateway URL from terraform output
API_URL=$(terraform output -raw api_gateway_url)

# Update the JavaScript file with your API URL
cd ../frontend/
sed -i "s|API_GATEWAY_URL_PLACEHOLDER|$API_URL|g" script.js

# Get S3 bucket name
BUCKET_NAME=$(cd ../terraform && terraform output -raw s3_bucket_name)

# Upload files to S3
aws s3 sync . s3://$BUCKET_NAME/ --exclude "*.git*"

# Get website URL
cd ../terraform/
terraform output website_url
```

## 🔧 Development Workflow

### Local Testing

```bash
# Test the Lambda function locally
cd backend/
python lambda_function.py

# Validate Terraform configuration
cd ../terraform/
terraform validate
terraform fmt
```

### Making Changes

1. **Frontend changes**: Edit files in `frontend/` directory
2. **Backend changes**: Edit `backend/lambda_function.py`
3. **Infrastructure changes**: Edit Terraform files in `terraform/`

### Deployment Options

**Option 1: Automatic (GitHub Actions)**
- Push to main branch
- GitHub Actions will automatically deploy changes

**Option 2: Manual**
```bash
# For infrastructure changes
cd terraform/
terraform plan
terraform apply

# For frontend changes  
cd frontend/
aws s3 sync . s3://your-bucket-name/
```

## 🛠️ Troubleshooting

### Common Issues

1. **Bucket name already exists**
   - Change the bucket name in `terraform/variables.tf`
   - Bucket names must be globally unique

2. **Permission denied errors**
   - Check your AWS credentials: `aws sts get-caller-identity`
   - Ensure your AWS user has the required permissions

3. **Terraform state issues**
   - If you get state lock errors: `terraform force-unlock [LOCK_ID]`

4. **API Gateway CORS errors**
   - The Lambda function includes CORS headers
   - Check browser console for error details

5. **Visitor counter not working**
   - Check CloudWatch logs for Lambda function
   - Verify DynamoDB table was created
   - Ensure API Gateway is properly configured

### Useful Commands

```bash
# Check AWS credentials
aws sts get-caller-identity

# View Terraform state
terraform show

# View Terraform outputs
terraform output

# Check S3 bucket contents
aws s3 ls s3://your-bucket-name/

# View Lambda logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/"

# Test API endpoint
curl -X GET "your-api-gateway-url"
```

## 📊 Monitoring

### CloudWatch Dashboards

Access AWS CloudWatch to monitor:
- Lambda function invocations
- API Gateway requests
- Error rates and response times

### Cost Monitoring

This project uses AWS Free Tier eligible services:
- S3: First 5GB free
- Lambda: First 1M requests free
- DynamoDB: 25GB free
- API Gateway: First 1M requests free

## 🔐 Security Best Practices

1. **IAM Roles**: Lambda uses least-privilege IAM roles
2. **CORS**: Properly configured for web access
3. **Secrets**: Never commit AWS credentials to git
4. **State Files**: Consider using S3 backend for Terraform state

## 📝 Customization

### Update Resume Content

Edit `frontend/index.html` to customize:
- Personal information
- Work experience  
- Skills and certifications
- Contact details

### Styling Changes

Edit `frontend/style.css` to modify:
- Colors and themes
- Layout and spacing
- Responsive design

### Add New Features

- Contact form with SES integration
- Blog section with DynamoDB backend
- Analytics with CloudWatch custom metrics

## 🎯 Next Steps

1. **Custom Domain**: Add Route 53 and CloudFront
2. **HTTPS**: Add SSL certificate with ACM
3. **CDN**: Set up CloudFront distribution
4. **Monitoring**: Add more detailed CloudWatch alarms
5. **Testing**: Add unit tests for Lambda function

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review AWS CloudWatch logs
3. Verify all prerequisites are installed
4. Ensure AWS credentials are properly configured

Happy deploying! 🚀
