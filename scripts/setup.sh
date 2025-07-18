#!/bin/bash

echo "Setting up Cloud Resume Project..."

# Create necessary directories
mkdir -p dist
mkdir -p scripts

echo "✅ Project structure created"
echo "📝 Next steps:"
echo "1. Update terraform.tf with your actual S3 bucket name"
echo "2. Add AWS credentials to GitHub Secrets"
echo "3. Push to GitHub to trigger workflows"
echo "4. After infrastructure is created, update S3_BUCKET_NAME and CLOUDFRONT_DISTRIBUTION_ID secrets"
