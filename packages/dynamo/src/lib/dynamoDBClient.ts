import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, TranslateConfig } from '@aws-sdk/lib-dynamodb';

const { REGION } = process.env;

const dynamoDbClient = new DynamoDBClient({ region: REGION });

const defaultTranslateConfig = {
    marshallOptions: {
        // Whether to automatically convert empty strings, blobs, and sets to `null`.
        convertEmptyValues: false,
        // Whether to remove undefined values while marshalling.
        removeUndefinedValues: false,
        // Whether to convert typeof object to map attribute.
        convertClassInstanceToMap: false,
    },
    unmarshallOptions: {
        // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
        wrapNumbers: false,
    },
};

export const getDynamoDBClient = () => {
    return dynamoDbClient;
};

export const getDynamoDBDocClient = (
    translateConfig: TranslateConfig = defaultTranslateConfig,
) => {
    return DynamoDBDocumentClient.from(dynamoDbClient, translateConfig);
};
