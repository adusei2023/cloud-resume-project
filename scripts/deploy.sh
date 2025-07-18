#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if required environment variables are set
if [ -z "$S3_BUCKET_NAME" ]; then
    echo "❌ S3_BUCKET_NAME environment variable is not set"
    exit 1
fi

if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "❌ CLOUDFRONT_DISTRIBUTION_ID environment variable is not set"
    exit 1
fi

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to S3
echo "☁️ Deploying to S3..."
aws s3 sync ./dist s3://$S3_BUCKET_NAME --delete --exact-timestamps

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"

echo "✅ Deployment completed successfully!"
echo "🌐 Your site will be available at the CloudFront URL in a few minutes."
