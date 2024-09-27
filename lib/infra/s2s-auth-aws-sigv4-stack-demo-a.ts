import { Stack, StackProps } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { AuthorizationType, EndpointType, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';

export class S2sAuthAwsSigv4StackDemoA extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // IAM role for caller lambda
    const callerRoleA = new iam.Role(this, 'CallerRoleA', {
      roleName: 'Caller-Role-Account-A',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ]
    });

    // API Gateway resource policy
    const apiResourcePolicy = new iam.PolicyDocument();

    apiResourcePolicy.addStatements(
      // Add statement to permit the caller lambda in the same account for the allowed endpoint
      new iam.PolicyStatement({
        actions: ['execute-api:Invoke'],
        principals: [callerRoleA],
        // Resource format of permissions for executing API in API Gateway:
        // arn:aws:execute-api:region:account-id:api-id/stage-name/HTTP-VERB/resource-path-specifier
        resources: ['execute-api:/*/*/same-account']
      }),
      // Add statement to permit cross account access from account B
      new iam.PolicyStatement({
        actions: ['execute-api:Invoke'],
        principals: [new iam.AccountPrincipal('430118855257')],
        // Resource format of permissions for executing API in API Gateway:
        // arn:aws:execute-api:region:account-id:api-id/stage-name/HTTP-VERB/resource-path-specifier
        resources: ['execute-api:/*/*/cross-account']
      })
    );

    // API Gateway Rest API
    const api = new RestApi(this, 'SigV4Api', {
      restApiName: 'AWS SigV4 API',
      endpointConfiguration: {
        types: [
          EndpointType.REGIONAL
        ]
      },
      policy: apiResourcePolicy
    });

    // Called function backing API Gateway
    const apiLambdaFunction = new NodejsFunction(this, 'HelloLambda', {
      functionName: 'Called-Lambda',
      runtime: Runtime.NODEJS_18_X,
      entry: join(__dirname, '../src/api-lambda/index.ts')
    });

    // Method with IAM Authorization enabled
    const endpoint = api.root.addResource('{proxy+}');
    endpoint.addMethod(
      'ANY',
      new LambdaIntegration(apiLambdaFunction),
      {
        authorizationType: AuthorizationType.IAM
      }
    );

    // Caller Lambda using sigv4 signed requests
    new NodejsFunction(this, 'CallerLambda', {
      functionName: 'Calling-Lambda-Account-A',
      entry: join(__dirname, '../src/testing-lambda/index.ts'),
      runtime: Runtime.NODEJS_18_X,
      environment: {
        API_URL: api.url,
        API_PATH: 'same-account',
        SIGN_REQUEST: 'true'
      },
      role: callerRoleA
    });
  }
}
