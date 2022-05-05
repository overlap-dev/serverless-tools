import middy from '@middy/core';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import cors from '@middy/http-cors';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import httpSecurityHeaders from '@middy/http-security-headers';
import validator from '@middy/validator';
import type { Handler } from 'aws-lambda';
import httpErrorHandler from './httpErrorHandlerMiddleware';

type InputSchemaProps = {
    bodySchema?: Record<string, any>;
    querySchema?: Record<string, any>;
};

type MiddyfyProps = {
    handler: Handler;
    bodySchema?: Record<string, any>;
    querySchema?: Record<string, any>;
    outputSchema?: Record<string, any>;
};

export const ajvOptions = {
    strict: true,
    strictTypes: true,
    strictTuples: true,
    coerceTypes: false,

    // ! Do not change this !
    // This takes care to remove all additional properties
    // which are not defined in a given schema.
    // The underlying code in the handlers do rely on this setting.
    removeAdditional: true,
};

export const corsOptions = {
    origin: '*',
    headers: '*',
    methods: 'OPTIONS,POST,GET,PUT,PATCH,DELETE',
};

export const getInputSchema = ({
    bodySchema,
    querySchema,
}: InputSchemaProps) => {
    // As the validator receives the whole event object.
    // We need to validate body and queries.
    let required: string[] = [];
    let properties = {};

    if (bodySchema) {
        required = [...required, 'body'];
        properties = {
            ...properties,
            body: { ...bodySchema, additionalProperties: false },
        };
    }

    if (querySchema) {
        properties = {
            ...properties,
            queryStringParameters: {
                ...querySchema,
                additionalProperties: false,
            },
        };

        if (querySchema?.['required']?.length) {
            required = [...required, 'queryStringParameters'];
        }
    }

    return {
        type: 'object',
        required,
        properties,
    };
};

export const middyfy = ({
    handler,
    bodySchema,
    querySchema,
    outputSchema,
}: MiddyfyProps) => {
    const inputSchema = getInputSchema({ bodySchema, querySchema });

    if (bodySchema || querySchema || outputSchema) {
        return middy(handler)
            .use(doNotWaitForEmptyEventLoop())
            .use(middyJsonBodyParser())
            .use(validator({ inputSchema, outputSchema, ajvOptions }))
            .use(httpSecurityHeaders())
            .use(cors(corsOptions))
            .use(httpErrorHandler());
    }

    return middy(handler)
        .use(doNotWaitForEmptyEventLoop())
        .use(middyJsonBodyParser())
        .use(httpSecurityHeaders())
        .use(cors(corsOptions))
        .use(httpErrorHandler());
};
