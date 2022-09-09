import { CreateCollectionOptions, Db, IndexDescription } from 'mongodb';
import { getMongoClient } from './mongoDBClient';

export type CollectionDefinition = {
    name: string;
    options?: CreateCollectionOptions;
    indexes?: IndexDescription[];
};

export type DeployCollectionInput = {
    mongoUri: string;
    dbName: string;
    collectionDefinition: CollectionDefinition;
    allowUpdateIndexes: boolean;
};

/**
 * Creates a new collection with the given options.
 * Or updates an existing collection with the given options (collMod).
 *
 * Also creates or drops indexes to have all indexes given in the input set on the collection.
 */
export const deployCollection = async (input: DeployCollectionInput) => {
    const { mongoUri, dbName, collectionDefinition, allowUpdateIndexes } =
        input;
    const { name } = collectionDefinition;

    console.log(`Deploy collection "${name}" on Database "${dbName}" ...`);

    const mongoClient = await getMongoClient(mongoUri);
    const db = mongoClient.db(dbName);

    if (await collectionExists(db, collectionDefinition)) {
        console.log(`Collection "${name}" already exists.`);
        await updateCollection(db, allowUpdateIndexes, collectionDefinition);
    } else {
        console.log(`Collection "${name}" does not exist.`);
        await createCollection(db, collectionDefinition);
    }

    return 'OK';
};

const collectionExists = async (db: Db, { name }: CollectionDefinition) => {
    const collections = await db
        .listCollections({ name: name }, { nameOnly: true })
        .toArray();

    return collections.findIndex((item) => item.name === name) > -1;
};

const createCollection = async (
    db: Db,
    { name, options, indexes }: CollectionDefinition,
) => {
    console.log('Creating collection ...');
    await db.createCollection(name, options);
    console.log('Collection Done!');

    if (indexes?.length) {
        console.log(`Creating ${indexes.length} indexes ...`);
        await db.collection(name).createIndexes(indexes);
        console.log('Indexes Done!');
    }
};

const updateCollection = async (
    db: Db,
    allowUpdateIndexes: boolean,
    { name, options, indexes }: CollectionDefinition,
) => {
    console.log(`Updating collection ...`);
    await db.command({ collMod: name, ...options });
    console.log('Collection Done!');

    if (allowUpdateIndexes) {
        const indexesWithNames = (indexes ?? []).map((index) => {
            if (index.name) {
                return index;
            }

            return {
                ...index,
                name: Object.entries(index.key)
                    .reduce((acc: string[], [k, v]) => {
                        return [...acc, `${k}_${v}`];
                    }, [])
                    .join('_'),
            };
        });

        const existingIndexes = await (
            await db.collection(name).listIndexes().toArray()
        )
            .map((obj) => obj.name)
            .filter((i) => i !== '_id_');

        const indexesToAdd = indexesWithNames.filter((index) => {
            return !existingIndexes.includes(index.name);
        });

        const indexesToDelete = existingIndexes.filter((existingIndex) => {
            return (
                indexesWithNames.findIndex((i) => i.name === existingIndex) ===
                -1
            );
        });

        if (indexesToAdd.length) {
            console.log(`Creating ${indexesToAdd.length} indexes ...`);
            await db.collection(name).createIndexes(indexesToAdd);
            console.log('Creating Indexes Done!');
        }

        if (indexesToDelete.length) {
            console.log(`Dropping ${indexesToDelete.length} indexes ...`);
            await Promise.all(
                indexesToDelete?.map((index) => {
                    console.log(`Dropping ${index}`);
                    return db.collection(name).dropIndex(index);
                }),
            );
            console.log('Dropping Indexes Done!');
        }
    }
};
