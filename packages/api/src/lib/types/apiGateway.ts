import {
    APIGatewayProxyEventV2,
    APIGatewayProxyStructuredResultV2,
    Handler,
} from 'aws-lambda';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';

export type ValidatedHttpApiProxyEvent<
    TBody extends JSONSchema,
    TQuery extends JSONSchema,
> = Omit<APIGatewayProxyEventV2, 'body' | 'queryStringParameters'> & {
    body: FromSchema<TBody>;
    queryStringParameters: FromSchema<TQuery>;
};

export type HttpApiEventHandler<
    TBody extends JSONSchema,
    TQuery extends JSONSchema,
> = Handler<
    ValidatedHttpApiProxyEvent<TBody, TQuery>,
    APIGatewayProxyStructuredResultV2
>;
