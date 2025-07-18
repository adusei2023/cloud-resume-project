import json
import boto3
import os
from botocore.exceptions import ClientError
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('DYNAMODB_TABLE', 'resume-visitor-counter')
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    """
    AWS Lambda function to handle visitor count for resume website.
    
    This function:
    1. Retrieves the current visitor count from DynamoDB
    2. Increments the count by 1
    3. Updates the count in DynamoDB
    4. Returns the updated count with CORS headers
    """
    
    try:
        # Log the incoming event for debugging
        logger.info(f"Received event: {json.dumps(event)}")
        
        # Handle preflight CORS requests
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'GET,OPTIONS'
                },
                'body': json.dumps({'message': 'CORS preflight'})
            }
        
        # Get current visitor count from DynamoDB
        try:
            response = table.get_item(
                Key={'id': 'visitor_count'}
            )
            
            # If item exists, get current count, otherwise start at 0
            if 'Item' in response:
                current_count = int(response['Item']['count'])
            else:
                current_count = 0
                logger.info("No existing visitor count found, starting from 0")
            
        except ClientError as e:
            logger.error(f"Error getting item from DynamoDB: {e}")
            current_count = 0
        
        # Increment the count
        new_count = current_count + 1
        
        # Update the count in DynamoDB
        try:
            table.put_item(
                Item={
                    'id': 'visitor_count',
                    'count': new_count
                }
            )
            logger.info(f"Updated visitor count to: {new_count}")
            
        except ClientError as e:
            logger.error(f"Error updating item in DynamoDB: {e}")
            return {
                'statusCode': 500,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'error': 'Failed to update visitor count',
                    'count': current_count
                })
            }
        
        # Return successful response with CORS headers
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            'body': json.dumps({
                'count': new_count,
                'message': 'Visitor count updated successfully'
            })
        }
        
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }
