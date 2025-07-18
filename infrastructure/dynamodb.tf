# DynamoDB table for visitor counter
resource "aws_dynamodb_table" "visitor_counter" {
  name           = "visitor-counter"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  # TTL for automatic cleanup of old visit logs
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  # Point-in-time recovery
  point_in_time_recovery {
    enabled = true
  }

  tags = merge(local.common_tags, {
    Name = "visitor-counter"
  })
}

# Initialize visitor counter
resource "aws_dynamodb_table_item" "visitor_counter_init" {
  table_name = aws_dynamodb_table.visitor_counter.name
  hash_key   = aws_dynamodb_table.visitor_counter.hash_key

  item = jsonencode({
    id = {
      S = "visitor_count"
    }
    count = {
      N = "0"
    }
    total_visits = {
      N = "0"
    }
    created_at = {
      S = timestamp()
    }
    last_updated = {
      S = timestamp()
    }
  })

  lifecycle {
    ignore_changes = [item]
  }
}
