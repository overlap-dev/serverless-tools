import { FromSchema } from 'json-schema-to-ts';

export type ValidEvent<T> = {
    version: string;
    id: string;
    'detail-type': string;
    source: string;
    account: string;
    time: string;
    region: string;
    detail: FromSchema<T>;
};

export type ValidateEvent<T> = (
    event: Record<string, unknown>,
) => ValidEvent<T>;
