import { FromSchema } from 'json-schema-to-ts';

export const eventEnvelopSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        version: { type: 'string' },
        'detail-type': { type: 'string' },
        source: { type: 'string' },
        account: { type: 'string' },
        time: { type: 'string' },
        region: { type: 'string' },
        resources: { type: 'array' },
    },
    required: [
        'id',
        'version',
        'detail-type',
        'source',
        'account',
        'time',
        'region',
        'resources',
    ],
} as const;

export type EventEnvelop = FromSchema<typeof eventEnvelopSchema>;
