# Cloud Resume Project - Development Makefile
# Simplifies common development and deployment tasks

.PHONY: help init plan apply deploy deploy-frontend clean validate test

# Default target
help:
	@echo "Cloud Resume Project - Available Commands:"
	@echo ""
	@echo "🚀 Deployment Commands:"
	@echo "  make init              - Initialize Terraform"
	@echo "  make plan              - Show Terraform execution plan"
	@echo "  make apply             - Deploy infrastructure with Terraform"
	@echo "  make deploy            - Full deployment (infrastructure + frontend)"
	@echo "  make deploy-frontend   - Deploy only frontend to S3"
	@echo ""
	@echo "🔧 Development Commands:"
	@echo "  make validate          - Validate Terraform configuration"
	@echo "  make test              - Run tests (when implemented)"
	@echo "  make clean             - Clean temporary files"
	@echo ""
	@echo "📊 Utility Commands:"
	@echo "  make outputs           - Show Terraform outputs"
	@echo "  make logs              - View Lambda function logs"
	@echo "  make check-aws         - Check AWS credentials"
	@echo ""

# Check if required tools are installed
check-tools:
	@echo "Checking required tools..."
	@command -v aws >/dev/null 2>&1 || { echo "❌ AWS CLI is required but not installed. Please install it first."; exit 1; }
	@command -v terraform >/dev/null 2>&1 || { echo "❌ Terraform is required but not installed. Please install it first."; exit 1; }
	@echo "✅ All required tools are installed"

# Check AWS credentials
check-aws:
	@echo "Checking AWS credentials..."
	@aws sts get-caller-identity > /dev/null 2>&1 || { echo "❌ AWS credentials not configured. Run 'aws configure' first."; exit 1; }
	@echo "✅ AWS credentials are configured"
	@aws sts get-caller-identity

# Initialize Terraform
init: check-tools check-aws
	@echo "🚀 Initializing Terraform..."
	cd terraform && terraform init

# Validate Terraform configuration
validate: check-tools
	@echo "🔍 Validating Terraform configuration..."
	cd terraform && terraform validate
	cd terraform && terraform fmt -check -recursive || { echo "❌ Terraform files need formatting. Run 'terraform fmt -recursive' to fix."; exit 1; }
	@echo "✅ Terraform configuration is valid"

# Show Terraform plan
plan: check-tools check-aws
	@echo "📋 Generating Terraform execution plan..."
	cd terraform && terraform plan

# Apply Terraform configuration
apply: check-tools check-aws validate
	@echo "🚀 Deploying infrastructure with Terraform..."
	cd terraform && terraform apply

# Deploy frontend to S3
deploy-frontend: check-tools check-aws
	@echo "📤 Deploying frontend to S3..."
	@if [ ! -f terraform/terraform.tfstate ]; then \
		echo "❌ Infrastructure not deployed yet. Run 'make apply' first."; \
		exit 1; \
	fi
	$(eval API_URL := $(shell cd terraform && terraform output -raw api_gateway_url 2>/dev/null))
	$(eval BUCKET_NAME := $(shell cd terraform && terraform output -raw s3_bucket_name 2>/dev/null))
	@if [ -z "$(API_URL)" ] || [ -z "$(BUCKET_NAME)" ]; then \
		echo "❌ Could not get Terraform outputs. Make sure infrastructure is deployed."; \
		exit 1; \
	fi
	@echo "🔗 Using API Gateway URL: $(API_URL)"
	@echo "🪣 Using S3 Bucket: $(BUCKET_NAME)"
	@cp frontend/script.js frontend/script.js.backup
	@sed 's|API_GATEWAY_URL_PLACEHOLDER|$(API_URL)|g' frontend/script.js.backup > frontend/script.js
	aws s3 sync frontend/ s3://$(BUCKET_NAME)/ \
		--exclude "*.backup" \
		--exclude "*.git*" \
		--delete
	@echo "✅ Frontend deployed successfully!"

# Full deployment
deploy: apply deploy-frontend
	@echo "🎉 Full deployment completed!"
	@echo ""
	@echo "📊 Deployment Summary:"
	@cd terraform && echo "🌐 Website URL: $$(terraform output -raw website_url)"
	@cd terraform && echo "🔗 API Gateway URL: $$(terraform output -raw api_gateway_url)"
	@cd terraform && echo "🪣 S3 Bucket: $$(terraform output -raw s3_bucket_name)"

# Show Terraform outputs
outputs:
	@echo "📊 Terraform Outputs:"
	@cd terraform && terraform output

# View Lambda function logs
logs:
	@echo "📜 Recent Lambda function logs:"
	$(eval FUNCTION_NAME := $(shell cd terraform && terraform output -raw lambda_function_name 2>/dev/null))
	@if [ -z "$(FUNCTION_NAME)" ]; then \
		echo "❌ Could not get Lambda function name. Make sure infrastructure is deployed."; \
		exit 1; \
	fi
	aws logs tail /aws/lambda/$(FUNCTION_NAME) --follow

# Run tests (placeholder for future implementation)
test:
	@echo "🧪 Running tests..."
	@echo "⚠️  Tests not implemented yet. This is a placeholder for future test implementation."

# Clean temporary files
clean:
	@echo "🧹 Cleaning temporary files..."
	find . -name "*.backup" -delete
	find . -name "*.tmp" -delete
	find . -name ".terraform.lock.hcl" -delete 2>/dev/null || true
	rm -rf terraform/.terraform 2>/dev/null || true
	rm -f terraform/terraform.tfplan 2>/dev/null || true
	rm -f terraform/lambda_function.zip 2>/dev/null || true
	@echo "✅ Cleanup completed"

# Destroy infrastructure (use with caution!)
destroy:
	@echo "⚠️  WARNING: This will destroy all infrastructure!"
	@echo "Are you sure you want to continue? (Type 'yes' to confirm)"
	@read -r CONFIRM; \
	if [ "$$CONFIRM" = "yes" ]; then \
		echo "🗑️  Destroying infrastructure..."; \
		cd terraform && terraform destroy; \
	else \
		echo "❌ Destruction cancelled"; \
	fi

# Development setup
dev-setup: check-tools
	@echo "🛠️  Setting up development environment..."
	@if [ ! -f terraform/terraform.tfvars ]; then \
		echo "📝 Creating terraform.tfvars from example..."; \
		cp terraform/terraform.tfvars.example terraform/terraform.tfvars; \
		echo "⚠️  Please edit terraform/terraform.tfvars with your configuration"; \
	fi
	@echo "✅ Development environment setup complete"
	@echo ""
	@echo "Next steps:"
	@echo "1. Edit terraform/terraform.tfvars with your configuration"
	@echo "2. Run 'make deploy' to deploy your cloud resume"

# Quick status check
status:
	@echo "📊 Cloud Resume Project Status:"
	@echo ""
	@echo "🔧 Tools Check:"
	@command -v aws >/dev/null 2>&1 && echo "  ✅ AWS CLI installed" || echo "  ❌ AWS CLI missing"
	@command -v terraform >/dev/null 2>&1 && echo "  ✅ Terraform installed" || echo "  ❌ Terraform missing"
	@echo ""
	@echo "☁️  AWS Status:"
	@aws sts get-caller-identity > /dev/null 2>&1 && echo "  ✅ AWS credentials configured" || echo "  ❌ AWS credentials not configured"
	@echo ""
	@echo "🏗️  Infrastructure Status:"
	@if [ -f terraform/terraform.tfstate ]; then \
		echo "  ✅ Terraform state exists"; \
		if [ -s terraform/terraform.tfstate ]; then \
			echo "  ✅ Infrastructure appears to be deployed"; \
		else \
			echo "  ⚠️  Terraform state is empty"; \
		fi \
	else \
		echo "  ❌ No Terraform state found"; \
	fi
