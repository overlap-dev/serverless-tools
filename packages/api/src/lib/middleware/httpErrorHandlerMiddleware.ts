import { jsonSafeParse, normalizeHttpResponse } from '@middy/util';

const defaults = {
    logger: console.error,
    fallbackMessage: 'Internal Server Error',
};

const httpErrorHandlerMiddleware = (opts = {}) => {
    const options = { ...defaults, ...opts };

    const httpErrorHandlerMiddlewareOnError = async (request: any) => {
        if (typeof options.logger === 'function') {
            options.logger(request.error);
        }

        // Set default expose value, only passes in when there is an override
        if (request.error?.statusCode && request.error?.expose === undefined) {
            request.error.expose = request.error.statusCode < 500;
        }

        // Non-http error OR expose set to false
        if (
            options.fallbackMessage &&
            (!request.error?.statusCode || !request.error?.expose)
        ) {
            request.error = {
                statusCode: 500,
                message: options.fallbackMessage,
                expose: true,
            };
        }

        if (request.error?.expose) {
            const details = {
                ...(request.error?.cause ? { ...request.error.cause } : {}),
                ...(request.error?.details ? { ...request.error.details } : {}),
            };

            const body = {
                message: request.error.message,
                ...(Object.keys(details).length ? { details: details } : {}),
            };

            request.response = normalizeHttpResponse(request);
            request.response.statusCode = request.error?.statusCode;
            request.response.body = JSON.stringify(body);
            request.response.headers['Content-Type'] =
                typeof jsonSafeParse(request.response.body) === 'string'
                    ? 'text/plain'
                    : 'application/json';

            return request.response;
        }
    };

    return {
        onError: httpErrorHandlerMiddlewareOnError,
    };
};

export default httpErrorHandlerMiddleware;
