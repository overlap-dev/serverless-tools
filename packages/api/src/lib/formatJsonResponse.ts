export const formatJSONResponse = (
    statusCode: number,
    response: any | any[],
    headers?: Record<string, unknown>,
) => {
    return {
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        statusCode: statusCode,
        body: JSON.stringify(response),
    };
};
