#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { S2sAuthAwsSigv4StackDemoA } from '../lib/infra/s2s-auth-aws-sigv4-stack-demo-a';
import { S2sAuthAwsSigv4StackDemoB } from '../lib/infra/s2s-auth-aws-sigv4-stack-demo-b';

const app = new cdk.App();
// Account A with the called Lambda behind the API Gateway and the caller Lambda for the same account scenario
new S2sAuthAwsSigv4StackDemoA(app, 'S2SAuthAwsSigv4StackDemoA', {
  env: { account: '111111111111', region: 'eu-west-1' }             // replace with your own values
});
// Account B with the caller Lambda for the cross-account-scenario
new S2sAuthAwsSigv4StackDemoB(app, 'S2SAuthAwsSigv4StackDemoB', {
  env: { account: '222222222222', region: 'eu-west-1' }             // replace with your own values
});