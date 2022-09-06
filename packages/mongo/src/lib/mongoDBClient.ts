import { MongoClient, MongoClientOptions } from 'mongodb';

const sharedMongoClients: Record<string, MongoClient> = {};

const defaultMongoClientOptions = {
    authSource: '$external',
    authMechanism: 'MONGODB-AWS',
    writeConcern: {
        w: 'majority',
    },
};

/**
 * Sets up a Mongo connection and return the MongoClient instance.
 *
 * Default Options:
 * - authSource: $external
 * - authMechanism: MONGODB-AWS
 * - writeConcern: majority
 *
 */
export const getMongoClient = async (
    url: string,
    options?: MongoClientOptions,
): Promise<MongoClient> => {
    sharedMongoClients[url] = await MongoClient.connect(
        url,
        Object.assign(defaultMongoClientOptions, options),
    );

    return sharedMongoClients[url];
};
