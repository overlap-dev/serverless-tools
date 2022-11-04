import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { getDynamoDBClient, getDynamoDBDocClient } from './dynamoDBClient';

describe('dynamoDBClient', () => {
    it('should get a DynamoDBClient', () => {
        const client = getDynamoDBClient();

        expect(client).toBeInstanceOf(DynamoDBClient);
    });

    it('should get a DynamoDBDocClient with translateConfig', () => {
        const translateConfig = {
            marshallOptions: {
                convertEmptyValues: true,
                removeUndefinedValues: true,
                convertClassInstanceToMap: true,
            },
            unmarshallOptions: {
                wrapNumbers: true,
            },
        };
        const docClient = getDynamoDBDocClient(translateConfig);

        expect(docClient).toBeInstanceOf(DynamoDBDocumentClient);
        expect(docClient.config.translateConfig).toEqual(translateConfig);
    });

    it('should get a DynamoDBDocClient with default translateConfig', () => {
        const docClient = getDynamoDBDocClient();

        expect(docClient).toBeInstanceOf(DynamoDBDocumentClient);
        expect(docClient.config.translateConfig).toEqual({
            marshallOptions: {
                convertEmptyValues: false,
                removeUndefinedValues: true,
                convertClassInstanceToMap: false,
            },
            unmarshallOptions: {
                wrapNumbers: false,
            },
        });
    });
});
