import { ClientOptions } from '@algolia/client-common';
import { algoliasearch, SearchClient } from 'algoliasearch';

const sharedAlgoliaClients: Record<string, SearchClient> = {};

const defaultClientOptions = {};

export const getAlgoliaSearchClient = (
    appId: string,
    apiKey: string,
    options?: ClientOptions,
): SearchClient => {
    const cacheKey = `${appId}_${apiKey}`;

    if (!sharedAlgoliaClients[cacheKey]) {
        sharedAlgoliaClients[cacheKey] = algoliasearch(
            appId,
            apiKey,
            Object.assign(defaultClientOptions, options),
        );
    }

    return sharedAlgoliaClients[cacheKey];
};
