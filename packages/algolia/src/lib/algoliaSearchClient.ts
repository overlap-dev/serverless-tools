import algoliasearch, {
    AlgoliaSearchOptions,
    SearchClient,
} from 'algoliasearch';

const sharedAlgoliaClients: Record<string, SearchClient> = {};

const defaultClientOptions = {};

export const getAlgoliaSearchClient = (
    appId: string,
    apiKey: string,
    options?: AlgoliaSearchOptions,
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
