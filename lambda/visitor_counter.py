import json
import boto3
import logging
from datetime import datetime
from decimal import Decimal
from botocore.exceptions import ClientError

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table_name = 'visitor-counter'
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    """
    AWS Lambda function to handle visitor count tracking
    
    Args:
        event: API Gateway event object
        context: Lambda context object
        
    Returns:
        dict: Response object with status code and body
    """
    
    try:
        # Log the incoming event
        logger.info(f"Received event: {json.dumps(event)}")
        
        # Handle CORS preflight request
        if event.get('httpMethod') == 'OPTIONS':
            return create_response(200, {'message': 'CORS preflight successful'})
        
        # Parse request body
        body = {}
        if event.get('body'):
            try:
                body = json.loads(event['body'])
            except json.JSONDecodeError:
                logger.error("Invalid JSON in request body")
                return create_response(400, {'error': 'Invalid JSON in request body'})
        
        # Get HTTP method
        http_method = event.get('httpMethod', 'GET')
        
        # Handle different HTTP methods
        if http_method == 'GET':
            # Get current visitor count
            count = get_visitor_count()
            return create_response(200, {'count': count})
            
        elif http_method == 'POST':
            # Increment visitor count
            action = body.get('action', 'increment')
            
            if action == 'increment':
                count = increment_visitor_count()
                return create_response(200, {'count': count, 'action': 'incremented'})
            else:
                return create_response(400, {'error': 'Invalid action'})
                
        else:
            return create_response(405, {'error': 'Method not allowed'})
            
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return create_response(500, {'error': 'Internal server error'})

def get_visitor_count():
    """
    Retrieve current visitor count from DynamoDB
    
    Returns:
        int: Current visitor count
    """
    try:
        response = table.get_item(
            Key={'id': 'visitor_count'}
        )
        
        if 'Item' in response:
            count = int(response['Item']['count'])
            logger.info(f"Retrieved visitor count: {count}")
            return count
        else:
            # Initialize count if it doesn't exist
            logger.info("Visitor count not found, initializing to 0")
            initialize_visitor_count()
            return 0
            
    except ClientError as e:
        logger.error(f"DynamoDB error getting count: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error getting count: {e}")
        raise

def increment_visitor_count():
    """
    Increment visitor count in DynamoDB using atomic operation
    
    Returns:
        int: New visitor count after increment
    """
    try:
        response = table.update_item(
            Key={'id': 'visitor_count'},
            UpdateExpression='ADD #count :increment, #total_visits :increment SET #last_updated = :timestamp',
            ExpressionAttributeNames={
                '#count': 'count',
                '#total_visits': 'total_visits',
                '#last_updated': 'last_updated'
            },
            ExpressionAttributeValues={
                ':increment': 1,
                ':timestamp': datetime.utcnow().isoformat()
            },
            ReturnValues='UPDATED_NEW'
        )
        
        new_count = int(response['Attributes']['count'])
        logger.info(f"Incremented visitor count to: {new_count}")
        
        # Log visit details for analytics
        log_visit_details()
        
        return new_count
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == 'ValidationException':
            # Item doesn't exist, create it
            logger.info("Creating new visitor count entry")
            initialize_visitor_count()
            return increment_visitor_count()
        else:
            logger.error(f"DynamoDB error incrementing count: {e}")
            raise
    except Exception as e:
        logger.error(f"Unexpected error incrementing count: {e}")
        raise

def initialize_visitor_count():
    """
    Initialize visitor count in DynamoDB
    """
    try:
        table.put_item(
            Item={
                'id': 'visitor_count',
                'count': 0,
                'total_visits': 0,
                'created_at': datetime.utcnow().isoformat(),
                'last_updated': datetime.utcnow().isoformat()
            }
        )
        logger.info("Initialized visitor count")
        
    except ClientError as e:
        logger.error(f"DynamoDB error initializing count: {e}")
        raise

def log_visit_details():
    """
    Log detailed visit information for analytics
    """
    try:
        # Create a separate entry for detailed analytics
        visit_id = f"visit_{datetime.utcnow().strftime('%Y%m%d_%H%M%S_%f')}"
        
        table.put_item(
            Item={
                'id': visit_id,
                'type': 'visit_log',
                'timestamp': datetime.utcnow().isoformat(),
                'date': datetime.utcnow().strftime('%Y-%m-%d'),
                'hour': datetime.utcnow().hour,
                'ttl': int((datetime.utcnow().timestamp() + (30 * 24 * 60 * 60)))  # 30 days TTL
            }
        )
        
    except Exception as e:
        # Don't fail the main operation if logging fails
        logger.warning(f"Failed to log visit details: {e}")

def create_response(status_code, body, additional_headers=None):
    """
    Create standardized API response with CORS headers
    
    Args:
        status_code (int): HTTP status code
        body (dict): Response body
        additional_headers (dict): Additional headers to include
        
    Returns:
        dict: Formatted API Gateway response
    """
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Max-Age': '86400'
    }
    
    if additional_headers:
        headers.update(additional_headers)
    
    # Convert Decimal types to int for JSON serialization
    if isinstance(body, dict):
        body = json.loads(json.dumps(body, default=decimal_default))
    
    response = {
        'statusCode': status_code,
        'headers': headers,
        'body': json.dumps(body)
    }
    
    logger.info(f"Returning response: {response}")
    return response

def decimal_default(obj):
    """
    JSON serializer for Decimal objects
    """
    if isinstance(obj, Decimal):
        return int(obj)
    raise TypeError(f"Object of type {type(obj)} is not JSON serializable")

# Health check function for monitoring
def health_check():
    """
    Simple health check for the Lambda function
    
    Returns:
        dict: Health status
    """
    try:
        # Test DynamoDB connection
        table.describe_table()
        return {
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'service': 'visitor-counter-lambda'
        }
    except Exception as e:
        return {
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat(),
            'service': 'visitor-counter-lambda'
        }
