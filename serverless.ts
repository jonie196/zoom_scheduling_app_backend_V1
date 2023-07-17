import type { AWS } from '@serverless/typescript';
import dynamoDbTables from './resources/dynamodbTables';
import { getAllContacts } from '@functions/contacts/index';
import { getAllConversations, createConversation } from '@functions/conversations/index';

const serverlessConfiguration: AWS = {
  service: 'zoom-scheduling-app-backend',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb-local'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-3',
    stage: 'dev',
    profile: "personal", // change to your aws profile
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      CONTACTS_TABLE: '${self:service}-contacts-table-${sls:stage}',
      CONVERSATIONS_TABLE: '${self:service}-conversations-table-${sls:stage}',
    },
    // iam: {
    //   role: {
    //     statements: [{
    //       Effect: "Allow",
    //       Action: [
    //         "dynamodb:DescribeTable",
    //         "dynamodb:Query",
    //         "dynamodb:Scan",
    //         "dynamodb:GetItem",
    //         "dynamodb:PutItem",
    //         "dynamodb:UpdateItem",
    //         "dynamodb:DeleteItem",
    //       ],
    //       Resource: "arn:aws:dynamodb:eu-west-3:*:table/ContactsTable",
    //     }],
    //   },
    // },
    iam: {
      role: {
        managedPolicies: [
          // "arn:aws:iam::463468586193:policy/basic-InvokeFunction",
          // "arn:aws:iam::463468586193:policy/LambdaDynamoDB",
          "arn:aws:iam::aws:policy/AdministratorAccess"

        ]
      }
    },
  },
  // import the function via paths
  functions: { getAllContacts, getAllConversations, createConversation },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      },
      stages: "dev"
    }
  },
  resources: {
    Resources: dynamoDbTables,
  }
};
module.exports = serverlessConfiguration;