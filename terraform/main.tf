# Terraform configuration for Cloud Resume Challenge
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.2"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
}

# S3 bucket for static website hosting
resource "aws_s3_bucket" "resume_website" {
  bucket = var.bucket_name

  tags = {
    Name        = "Resume Website"
    Environment = var.environment
    Project     = "Cloud Resume Challenge"
  }
}

# S3 bucket public access block
resource "aws_s3_bucket_public_access_block" "resume_website_pab" {
  bucket = aws_s3_bucket.resume_website.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# S3 bucket policy for public read access
resource "aws_s3_bucket_policy" "resume_website_policy" {
  bucket     = aws_s3_bucket.resume_website.id
  depends_on = [aws_s3_bucket_public_access_block.resume_website_pab]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.resume_website.arn}/*"
      }
    ]
  })
}

# S3 bucket website configuration
resource "aws_s3_bucket_website_configuration" "resume_website_config" {
  bucket = aws_s3_bucket.resume_website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

# DynamoDB table for visitor counter
resource "aws_dynamodb_table" "visitor_counter" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name        = "Visitor Counter"
    Environment = var.environment
    Project     = "Cloud Resume Challenge"
  }
}

# DynamoDB table item for visitor count
resource "aws_dynamodb_table_item" "visitor_count_item" {
  table_name = aws_dynamodb_table.visitor_counter.name
  hash_key   = aws_dynamodb_table.visitor_counter.hash_key

  item = <<ITEM
{
  "id": {"S": "visitor_count"},
  "count": {"N": "0"}
}
ITEM
}

# IAM role for Lambda function
resource "aws_iam_role" "lambda_execution_role" {
  name = "${var.lambda_function_name}-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "Lambda Execution Role"
    Environment = var.environment
    Project     = "Cloud Resume Challenge"
  }
}

# IAM policy for Lambda DynamoDB access
resource "aws_iam_policy" "lambda_dynamodb_policy" {
  name        = "${var.lambda_function_name}-dynamodb-policy"
  description = "IAM policy for Lambda to access DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem"
        ]
        Resource = aws_dynamodb_table.visitor_counter.arn
      }
    ]
  })
}

# Attach DynamoDB policy to Lambda role
resource "aws_iam_role_policy_attachment" "lambda_dynamodb_policy_attachment" {
  policy_arn = aws_iam_policy.lambda_dynamodb_policy.arn
  role       = aws_iam_role.lambda_execution_role.name
}

# Attach basic execution policy to Lambda role
resource "aws_iam_role_policy_attachment" "lambda_basic_execution_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_execution_role.name
}

# Archive Lambda function code
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/lambda_function.py"
  output_path = "${path.module}/lambda_function.zip"
}

# Lambda function
resource "aws_lambda_function" "visitor_counter" {
  filename      = data.archive_file.lambda_zip.output_path
  function_name = var.lambda_function_name
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.9"
  timeout       = 10

  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.visitor_counter.name
    }
  }

  tags = {
    Name        = "Visitor Counter Lambda"
    Environment = var.environment
    Project     = "Cloud Resume Challenge"
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution_attachment,
    aws_iam_role_policy_attachment.lambda_dynamodb_policy_attachment,
    aws_cloudwatch_log_group.lambda_logs
  ]
}

# CloudWatch Log Group for Lambda
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${var.lambda_function_name}"
  retention_in_days = 14

  tags = {
    Name        = "Lambda Logs"
    Environment = var.environment
    Project     = "Cloud Resume Challenge"
  }
}

# API Gateway REST API
resource "aws_api_gateway_rest_api" "visitor_counter_api" {
  name        = "visitor-counter-api"
  description = "API Gateway for visitor counter Lambda function"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Name        = "Visitor Counter API"
    Environment = var.environment
    Project     = "Cloud Resume Challenge"
  }
}

# API Gateway resource
resource "aws_api_gateway_resource" "visitor_counter_resource" {
  rest_api_id = aws_api_gateway_rest_api.visitor_counter_api.id
  parent_id   = aws_api_gateway_rest_api.visitor_counter_api.root_resource_id
  path_part   = "visitor-count"
}

# API Gateway method
resource "aws_api_gateway_method" "visitor_counter_method" {
  rest_api_id   = aws_api_gateway_rest_api.visitor_counter_api.id
  resource_id   = aws_api_gateway_resource.visitor_counter_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

# API Gateway method for CORS preflight
resource "aws_api_gateway_method" "visitor_counter_options" {
  rest_api_id   = aws_api_gateway_rest_api.visitor_counter_api.id
  resource_id   = aws_api_gateway_resource.visitor_counter_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

# API Gateway integration
resource "aws_api_gateway_integration" "visitor_counter_integration" {
  rest_api_id = aws_api_gateway_rest_api.visitor_counter_api.id
  resource_id = aws_api_gateway_resource.visitor_counter_resource.id
  http_method = aws_api_gateway_method.visitor_counter_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.visitor_counter.invoke_arn
}

# API Gateway integration for CORS
resource "aws_api_gateway_integration" "visitor_counter_options_integration" {
  rest_api_id = aws_api_gateway_rest_api.visitor_counter_api.id
  resource_id = aws_api_gateway_resource.visitor_counter_resource.id
  http_method = aws_api_gateway_method.visitor_counter_options.http_method

  type = "MOCK"
  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }
}

# Lambda permission for API Gateway
resource "aws_lambda_permission" "api_gateway_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.visitor_counter.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.visitor_counter_api.execution_arn}/*/*"
}

# API Gateway deployment
resource "aws_api_gateway_deployment" "visitor_counter_deployment" {
  depends_on = [
    aws_api_gateway_method.visitor_counter_method,
    aws_api_gateway_integration.visitor_counter_integration,
    aws_api_gateway_method.visitor_counter_options,
    aws_api_gateway_integration.visitor_counter_options_integration,
  ]

  rest_api_id = aws_api_gateway_rest_api.visitor_counter_api.id

  lifecycle {
    create_before_destroy = true
  }
}

# API Gateway stage
resource "aws_api_gateway_stage" "visitor_counter_stage" {
  deployment_id = aws_api_gateway_deployment.visitor_counter_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.visitor_counter_api.id
  stage_name    = var.api_stage_name
}

# CloudWatch Log Group for API Gateway
resource "aws_cloudwatch_log_group" "api_gateway_logs" {
  name              = "API-Gateway-Execution-Logs_${aws_api_gateway_rest_api.visitor_counter_api.id}/${var.api_stage_name}"
  retention_in_days = 14

  tags = {
    Name        = "API Gateway Logs"
    Environment = var.environment
    Project     = "Cloud Resume Challenge"
  }
}

# CloudWatch alarm for Lambda errors
resource "aws_cloudwatch_metric_alarm" "lambda_error_alarm" {
  alarm_name          = "${var.lambda_function_name}-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "300"
  statistic           = "Sum"
  threshold           = "5"
  alarm_description   = "This metric monitors lambda error rate"
  alarm_actions       = []

  dimensions = {
    FunctionName = aws_lambda_function.visitor_counter.function_name
  }

  tags = {
    Name        = "Lambda Error Alarm"
    Environment = var.environment
    Project     = "Cloud Resume Challenge"
  }
}

# CloudWatch alarm for API Gateway errors
resource "aws_cloudwatch_metric_alarm" "api_gateway_error_alarm" {
  alarm_name          = "api-gateway-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "4XXError"
  namespace           = "AWS/ApiGateway"
  period              = "300"
  statistic           = "Sum"
  threshold           = "5"
  alarm_description   = "This metric monitors API Gateway 4XX error rate"
  alarm_actions       = []

  dimensions = {
    ApiName = aws_api_gateway_rest_api.visitor_counter_api.name
    Stage   = var.api_stage_name
  }

  tags = {
    Name        = "API Gateway Error Alarm"
    Environment = var.environment
    Project     = "Cloud Resume Challenge"
  }
}