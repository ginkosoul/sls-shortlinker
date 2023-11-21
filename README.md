# Serverless - AWS Node.js Typescript

This app allows you to create shortened links efficiently. The project utilizes DynamoDB as a database to store user and link information. Additionally, an AWS EventBridge scheduler is employed to send notifications to an SQS (Simple Queue Service). Users receive notifications through SES (Simple Email Service) upon task completion

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime. Configure aws credentials [documentaion](https://www.serverless.com/framework/docs/providers/aws/cli-reference/config-credentials)

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas
- `slsconfig` - serverless configuration
- `types` - types for TypeScript

```
.
├── src
│   ├── functions                       # Lambda configuration and source code folder
│   │   ├── authVerify
│   │   │   ├── handler.ts              # `authVerify` lambda source code
│   │   │   └── index.ts                # `authVerify` lambda Serverless configuration
│   │   ├── deactivateLink
│   │   │   ├── handler.ts              # `deactivateLink` lambda source code
│   │   │   └── index.ts                # `deactivateLink` lambda Serverless configuration
│   │   ├── getLink
│   │   │   ├── handler.ts              # `getLink` lambda source code
│   │   │   └── index.ts                # `getLink` lambda Serverless configuration
│   │   ├── listLinks
│   │   │   ├── handler.ts              # `listLinks` lambda source code
│   │   │   └── index.ts                # `listLinks` lambda Serverless configuration
│   │   ├── receiver
│   │   │   ├── handler.ts              # `receiver` lambda source code
│   │   │   └── index.ts                # `receiver` lambda Serverless configuration
│   │   ├── setLink
│   │   │   ├── handler.ts              # `setLink` lambda source code
│   │   │   └── index.ts                # `setLink` lambda Serverless configuration
│   │   ├── signIn
│   │   │   ├── handler.ts              # `signIn` lambda source code
│   │   │   └── index.ts                # `signIn` lambda Serverless configuration
│   │   ├── signUp
│   │   │   ├── handler.ts              # `signUp` lambda source code
│   │   │   └── index.ts                # `signUp` lambda Serverless configuration
│   │   │
│   │   └── index.ts                    # Import/export of all lambda configurations
│   │
│   ├── libs                            # Lambda configuration and source code folder
│   │   ├── wrappers
│   │   │   └── apiErrorHandler.ts      # `authVerify` lambda source code
│   │   └── wrappers
│   │       ├── apiGateway.ts           # API Gateway specific helpers
│   │       ├── dynamo.ts               # DynamoDB helper functions
│   │       ├── formatHelpers.ts        # Functions that formats data
│   │       ├── generatePolicy.ts       # AWS policy document helper
│   │       ├── handlerResolver.ts      # Path resolver hlper
│   │       ├── httpError.ts            # Custom Error
│   │       ├── jwtHelpers.ts           # JWT create and verify helpers
│   │       ├── notification.ts         # SES and SQS helpers
│   │       ├── scheduler.ts            # EventBridge Scheduler helpers
│   │       ├── validations.ts          # Request body validation helpers
│   │       └── index.ts
│   │
│   └── sls                             # Serverless configuration
│       ├── dynamo.ts                   # DynamoDB table configuration
│       ├── schedule.ts                 # Sheduler Group and SchedukerRole configuration
│       ├── sqs.ts                      # SQSQueue configuration
│       └── index.ts                    # Import/export of all Resorces configurations
│
├── package.json
├── serverless.ts                       # Serverless service file
├── tsconfig.json                       # Typescript compiler configuration
└── tsconfig.paths.json                 # Typescript paths
```
