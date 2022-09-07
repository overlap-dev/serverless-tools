import {
    APIGatewayProxyEventV2,
    APIGatewayProxyStructuredResultV2,
    Handler,
} from 'aws-lambda';
import { FromSchema, JSONSchema7 } from 'json-schema-to-ts';

export type ValidatedHttpApiProxyEvent<
    TBody extends JSONSchema7,
    TQuery extends JSONSchema7,
> = Omit<APIGatewayProxyEventV2, 'body' | 'queryStringParameters'> & {
    body: FromSchema<TBody>;
    queryStringParameters: FromSchema<TQuery>;
};

export type HttpApiEventHandler<
    TBody extends JSONSchema7,
    TQuery extends JSONSchema7,
> = Handler<
    ValidatedHttpApiProxyEvent<TBody, TQuery>,
    APIGatewayProxyStructuredResultV2
>;
