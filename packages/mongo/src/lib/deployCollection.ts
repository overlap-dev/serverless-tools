import { CreateCollectionOptions, Db } from 'mongodb';
import { getMongoClient } from './mongoDBClient';

export type CollectionDefinition = {
    name: string;
    options?: CreateCollectionOptions;
};

export type DeployCollectionInput = {
    mongoUri: string;
    dbName: string;
    collectionDefinition: CollectionDefinition;
};

/**
 * Creates a new collection with the given options.
 * Or updates an existing collection with the given options (collMod).
 */
export const deployCollection = async (input: DeployCollectionInput) => {
    const { mongoUri, dbName, collectionDefinition } = input;
    const { name } = collectionDefinition;

    console.log(`Deploy collection "${name}" on Database "${dbName}" ...`);

    const mongoClient = await getMongoClient(mongoUri);
    const db = mongoClient.db(dbName);

    if (await collectionExists(db, collectionDefinition)) {
        console.log(`Collection "${name}" already exists.`);
        return updateCollection(db, collectionDefinition);
    } else {
        console.log(`Collection "${name}" does not exist.`);
        return createCollection(db, collectionDefinition);
    }
};

const collectionExists = async (db: Db, { name }: CollectionDefinition) => {
    const collections = await db
        .listCollections({ name: name }, { nameOnly: true })
        .toArray();

    return collections.findIndex((item) => item.name === name) > -1;
};

const createCollection = async (
    db: Db,
    { name, options }: CollectionDefinition,
) => {
    console.log(`Creating ...`);
    return db.createCollection(name, options);
};

const updateCollection = async (
    db: Db,
    { name, options }: CollectionDefinition,
) => {
    console.log(`Updating ...`);
    return db.command({ collMod: name, ...options });
};
