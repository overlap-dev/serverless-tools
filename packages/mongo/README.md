# Serverless Tools - Mongo

Tools and utilities for working with MongoDB.

## MongoClient

To use the MongoClient you can get a shared instance of the MongoClient by calling `getMongoClient`.
This way the MongoClient is kept out of the handler and can be reused on Lambda invocations.

### Authentication

The MongoClient options set by default use AWS IAM authentication.

Therefore the MongoClient will use the following environment variables to authenticate with the Lambda execution role.

-   `AWS_ACCESS_KEY_ID`
-   `AWS_SECRET_ACCESS_KEY`
-   `AWS_SESSION_TOKEN`

You need to take care to create a MongoDB User for the AWS IAM role that is assigned to the Lambda function as its execution role.

See https://www.mongodb.com/docs/atlas/security/passwordless-authentication/ for more details.

### Example Code

```typescript
import { getMongoClient } from '@overlap/serverless-tools-mongo';

const { MONGO_URI, MONGO_DB_NAME } = process.env;

const mongoClient = await getMongoClient(MONGO_URI);
const collection = mongoClient.db(MONGO_DB_NAME);
```

> If your handler takes a callback as its last argument, set the `callbackWaitsForEmptyEventLoop` property on the AWS Lambda Context object to `false`.
>
> This allows a Lambda function to return its result to the caller without requiring that the MongoDB database connection be closed. Setting this property is not applicable for
> async handlers
> .

## Deploy Collection

Use the `deployCollection` function to set up collections automatically on deployments.

A collection can be created or updated with different collection options. This way for example schema validations can be set.
