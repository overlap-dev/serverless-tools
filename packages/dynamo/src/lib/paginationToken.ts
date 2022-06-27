type DefaultDynamoItem = Record<string, any> & {
    PK: string;
    SK: string;
};

type ItemsWithPaginationToken<T> = {
    items: T[];
    paginationToken?: string;
};

/**
 * To figure out if we have more items after this request based on the limit
 * requested by the client, we will fetch one more item.
 * If the result set has limit + 1 items we can respond the client that there is more.
 * Also we need to pop the last element to fit the clients provided limit and
 * adjust the LastEvaluatedKey.
 *
 * @param items - array of items returned form dynamo
 * @param limit - limit requested by the client
 * @returns
 */
export const getItemsWithPaginationToken = (
    items: Record<string, any>[],
    limit: number,
): ItemsWithPaginationToken<Record<string, any>> => {
    let paginationToken: string | undefined = undefined;

    if (items.length === limit + 1) {
        items.pop();

        const lastIndex = items.length - 1;
        const lastEvaluatedKey = {
            PK: (items[lastIndex] as DefaultDynamoItem).PK,
            SK: (items[lastIndex] as DefaultDynamoItem).SK,
        };

        paginationToken = Buffer.from(
            JSON.stringify(lastEvaluatedKey),
        ).toString('base64');
    }

    return { items, paginationToken };
};

export const parsePaginationToken = (
    token?: string,
): Record<string, string> | undefined => {
    return token
        ? JSON.parse(Buffer.from(token, 'base64').toString('ascii'))
        : undefined;
};
