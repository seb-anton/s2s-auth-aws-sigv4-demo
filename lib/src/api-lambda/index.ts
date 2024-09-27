import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: `Hello, AWS Community Day DACH 2024! You've hit ${event.path}`
  };
}
