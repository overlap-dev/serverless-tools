export type FormatJSONResponseOutput = {
    headers: {
        [key: string]: string;
        'Content-Type': 'application/json';
    };
    statusCode: number;
    body: string;
};

export type FormatJSONResponse = <TResponse>(
    statusCode: number,
    response: TResponse,
    headers?: Record<string, string>,
) => FormatJSONResponseOutput;

export const formatJSONResponse: FormatJSONResponse = (
    statusCode,
    response,
    headers,
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
