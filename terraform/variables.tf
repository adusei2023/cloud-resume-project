# Variables for Terraform configuration

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "bucket_name" {
  description = "Name of the S3 bucket for static website hosting"
  type        = string
  default     = "samuel-cloud-resume-website"

  validation {
    condition     = length(var.bucket_name) > 3 && length(var.bucket_name) < 64
    error_message = "Bucket name must be between 3 and 63 characters."
  }
}

variable "dynamodb_table_name" {
  description = "Name of the DynamoDB table for visitor counter"
  type        = string
  default     = "resume-visitor-counter"
}

variable "lambda_function_name" {
  description = "Name of the Lambda function"
  type        = string
  default     = "resume-visitor-counter"
}

variable "api_stage_name" {
  description = "API Gateway stage name"
  type        = string
  default     = "prod"
}

variable "domain_name" {
  description = "Custom domain name for the website (optional)"
  type        = string
  default     = ""
}
