# Outputs for Terraform configuration

output "website_url" {
  description = "URL of the static website"
  value       = "http://${aws_s3_bucket_website_configuration.resume_website_config.website_endpoint}"
}

output "api_gateway_url" {
  description = "URL of the API Gateway"
  value       = "https://${aws_api_gateway_rest_api.visitor_counter_api.id}.execute-api.${var.aws_region}.amazonaws.com/${var.api_stage_name}/visitor-count"
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.resume_website.bucket
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB table"
  value       = aws_dynamodb_table.visitor_counter.name
}

output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = aws_lambda_function.visitor_counter.function_name
}

output "api_gateway_id" {
  description = "ID of the API Gateway"
  value       = aws_api_gateway_rest_api.visitor_counter_api.id
}

output "cloudwatch_log_groups" {
  description = "CloudWatch log groups created"
  value = {
    lambda_logs      = aws_cloudwatch_log_group.lambda_logs.name
    api_gateway_logs = aws_cloudwatch_log_group.api_gateway_logs.name
  }
}
