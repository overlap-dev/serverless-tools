import middy from '@middy/core';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import cors from '@middy/http-cors';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import httpSecurityHeaders from '@middy/http-security-headers';
import validator from '@middy/validator';
import Ajv, { Options as AjvOptions } from 'ajv';
import type { Handler } from 'aws-lambda';
import httpErrorHandler from './httpErrorHandlerMiddleware';

type GetInputSchemaProps = {
    bodySchema?: Record<string, any>;
    querySchema?: Record<string, any>;
};

type GetCompiledSchemaProps = {
    inputSchema?: Record<string, any>;
    outputSchema?: Record<string, any>;
    ajvOptions?: AjvOptions;
};

type MiddyfyProps = {
    handler: Handler;
    bodySchema?: Record<string, any>;
    querySchema?: Record<string, any>;
    outputSchema?: Record<string, any>;
    ajvOptions?: AjvOptions;
};

const ajvDefaultOptions: AjvOptions = {
    strict: true,
    strictTypes: true,
    strictTuples: true,
    coerceTypes: false,
    allErrors: true,
    useDefaults: 'empty',
    messages: false,

    // ! Do not change this !
    // This takes care to remove all additional properties
    // which are not defined in a given schema.
    // The underlying code in the handlers do rely on this setting.
    removeAdditional: true,
};

const corsOptions = {
    origin: '*',
    headers: '*',
    methods: 'OPTIONS,POST,GET,PUT,PATCH,DELETE',
};

const getInputSchema = ({ bodySchema, querySchema }: GetInputSchemaProps) => {
    // As the validator receives the whole event object.
    // We need to validate body and queries.
    let required: string[] = [];
    let properties = {};

    if (bodySchema) {
        required = [...required, 'body'];
        properties = {
            ...properties,
            body: {
                ...bodySchema,
                additionalProperties:
                    bodySchema['additionalProperties'] ?? false,
            },
        };
    }

    if (querySchema) {
        properties = {
            ...properties,
            queryStringParameters: {
                ...querySchema,
                additionalProperties:
                    querySchema['additionalProperties'] ?? false,
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

const getCompiledSchemas = ({
    inputSchema,
    outputSchema,
    ajvOptions,
}: GetCompiledSchemaProps) => {
    let inputValidate = null;
    let outputValidate = null;

    const options = Object.assign({}, ajvDefaultOptions, ajvOptions);
    const ajv = new Ajv(options);

    ajv.addKeyword({
        keyword: 'notEmpty',
        errors: false,
        validate: function (schema: boolean, data: any) {
            if (schema === false) {
                return true;
            } else if (typeof data === 'string') {
                return data.trim() !== '';
            } else if (Array.isArray(data)) {
                return data.length > 0;
            } else if (typeof data === 'object') {
                return Object.keys(data).length > 0;
            } else {
                return true;
            }
        },
    });

    if (inputSchema) {
        inputValidate = ajv.compile(inputSchema);
    }
    if (outputSchema) {
        outputValidate = ajv.compile(outputSchema);
    }

    return {
        inputValidate,
        outputValidate,
    };
};

export const middyfy = ({
    handler,
    bodySchema,
    querySchema,
    outputSchema,
    ajvOptions,
}: MiddyfyProps) => {
    let inputSchema;
    if (bodySchema || querySchema) {
        inputSchema = getInputSchema({ bodySchema, querySchema });
    }

    const { inputValidate, outputValidate } = getCompiledSchemas({
        inputSchema,
        outputSchema,
        ajvOptions,
    });

    if (inputValidate || outputValidate) {
        return middy(handler)
            .use(doNotWaitForEmptyEventLoop())
            .use(middyJsonBodyParser())
            .use(
                validator({
                    inputSchema: inputValidate,
                    outputSchema: outputValidate,
                }),
            )
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
