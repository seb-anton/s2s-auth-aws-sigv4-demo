import { Stack, StackProps } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';

export class S2sAuthAwsSigv4StackDemoB extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // IAM role for caller lambda
    const callerRole = new iam.Role(this, 'CallerLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ]
    });

    // Add API execution permission to caller role
    callerRole.addToPolicy(new iam.PolicyStatement({
      actions: ['execute-api:Invoke'],
      resources: ['arn:aws:execute-api:eu-west-1:597088027095:plpef0vbzb/*/*/cross-account']
    }));

    // Caller Lambda using sigv4 signed requests
    new NodejsFunction(this, 'CallerLambda', {
      functionName: 'Calling-Lambda-Account-B',
      entry: join(__dirname, '../src/testing-lambda/index.ts'),
      runtime: Runtime.NODEJS_18_X,
      environment: {
        API_URL: 'https://plpef0vbzb.execute-api.eu-west-1.amazonaws.com/prod/',
        API_PATH: 'cross-account',
        SIGN_REQUEST: 'true'
      },
      role: callerRole
    });
  }
}
