import {
    DeleteRequest,
    PutRequest,
    WriteRequest,
} from '@aws-sdk/client-dynamodb';
import {
    BatchWriteCommand,
    BatchWriteCommandOutput,
    DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';
import { getDynamoDBDocClient } from './dynamoDBClient';

type BatchWriteInput = {
    TableName: string;
    Requests: (Omit<WriteRequest, 'PutRequest' | 'DeleteRequest'> & {
        PutRequest?:
            | (Omit<PutRequest, 'Item'> & {
                  Item:
                      | {
                            [key: string]: any;
                        }
                      | undefined;
              })
            | undefined;
        DeleteRequest?:
            | (Omit<DeleteRequest, 'Key'> & {
                  Key:
                      | {
                            [key: string]: any;
                        }
                      | undefined;
              })
            | undefined;
    })[];
    ReturnConsumedCapacity?: 'INDEXES' | 'TOTAL' | 'NONE';
    ReturnItemCollectionMetrics?: 'SIZE' | 'NONE';
    Client?: DynamoDBDocumentClient;
};

type BatchWrite = (
    input: BatchWriteInput,
) => Promise<BatchWriteCommandOutput[]>;

/**
 * Executes a BatchWriteCommand operation with the DynamoDB Document Client.
 * Automatically takes care of batch sizes and chunks the requests into
 * multiple BatchWriteCommand operations if needed.
 *
 * The default client sets removeUndefinedValues option to true.
 *
 */
export const batchWrite: BatchWrite = async ({
    TableName,
    Requests,
    ReturnConsumedCapacity,
    ReturnItemCollectionMetrics,
    Client,
}) => {
    const dynamoDbDocClient =
        Client ??
        getDynamoDBDocClient({
            marshallOptions: {
                removeUndefinedValues: true,
            },
        });

    const chunkSize = 25;
    const requestChunks = [];

    for (let i = 0; i < Requests.length; i += chunkSize) {
        const chunk = Requests.slice(i, i + chunkSize);
        requestChunks.push(chunk);
    }

    return Promise.all(
        requestChunks.map((chunk) => {
            return dynamoDbDocClient.send(
                new BatchWriteCommand({
                    RequestItems: {
                        [TableName]: chunk,
                    },
                    ReturnConsumedCapacity,
                    ReturnItemCollectionMetrics,
                }),
            );
        }),
    );
};
