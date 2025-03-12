# Service to Service Authentication and Authorization using AWS SigV4 

Service-to-service authentication and authorization are critical aspects of modern distributed systems, ensuring that different services within an architecture can securely communicate with each other.

##### Challenges:

There are multiple ways of implementing service-to-service auth each coming with their own challenges regarding security, performance, and reliability, including:
- How to store and distribute credentials in a secure way and also rotate them.
- Managing issuance, expiration and renewal of tokens. Also validating them and check for tampering.
- In case of mTLS having a complex certificate management.
- Single point of failure/performance bottleneck in case of a central IAM service.

##### About AWS SigV4:

AWS Signature Version 4 (SigV4) is basically AWSs implementation of hash-based messaging code(HMAC) over HTTP.
It is widely used for AWSs APIs and therefore the AWS SDKs and also the AWS CLI use this method for signing their requests.

In this session I want to show how we could make use of the AWS SigV4 implementation for our own services using API Gateway resource policies and signing our service-to-service requests using AWS SigV4.

##### For demonstration I will go through these steps:
- Deploying a service with an API Gateway in front
- Configuring the API Gateway resource policy for authentication/authorization
- Setting up request signing in the caller service


