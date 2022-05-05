import {
    APIGatewayProxyEventV2,
    APIGatewayProxyStructuredResultV2,
    Handler,
} from 'aws-lambda';
import { FromSchema } from 'json-schema-to-ts';

export type ValidatedHttpApiProxyEvent<TBody, TQuery> = Omit<
    APIGatewayProxyEventV2,
    'body' | 'queryStringParameters'
> & {
    body: FromSchema<TBody>;
    queryStringParameters: FromSchema<TQuery>;
};

export type HttpApiEventHandler<TBody, TQuery> = Handler<
    ValidatedHttpApiProxyEvent<TBody, TQuery>,
    APIGatewayProxyStructuredResultV2
>;
