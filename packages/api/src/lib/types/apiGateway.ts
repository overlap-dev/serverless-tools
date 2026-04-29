import {
    APIGatewayProxyEventV2,
    APIGatewayProxyStructuredResultV2,
    Context,
} from 'aws-lambda';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';

export type ValidatedHttpApiProxyEvent<
    TBody extends JSONSchema,
    TQuery extends JSONSchema,
> = Omit<APIGatewayProxyEventV2, 'body' | 'queryStringParameters'> & {
    body: FromSchema<TBody>;
    queryStringParameters: FromSchema<TQuery>;
};

// 2-arg async signature only — never the legacy callback form, which
// AWS Lambda's Node.js 24 runtime rejects (Runtime.CallbackHandlerDeprecated).
export type HttpApiEventHandler<
    TBody extends JSONSchema,
    TQuery extends JSONSchema,
> = (
    event: ValidatedHttpApiProxyEvent<TBody, TQuery>,
    context: Context,
) => Promise<APIGatewayProxyStructuredResultV2>;
