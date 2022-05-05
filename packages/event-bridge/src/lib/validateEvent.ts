import { HttpError } from '@overlap/serverless-tools-api';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { JSONSchema } from 'json-schema-to-ts';
import { eventEnvelopSchema } from './types';
import { ValidEvent } from './types/eventBridge';

export const validateEvent = <T>(
    event: Record<string, unknown>,
    schema: JSONSchema,
): ValidEvent<T> => {
    const fullSchema = {
        ...eventEnvelopSchema,
        properties: {
            ...eventEnvelopSchema.properties,
            detail: schema,
        },
        required: [...eventEnvelopSchema.required, 'detail'],
    };

    const ajv = new Ajv();
    addFormats(ajv);

    const validate = ajv.compile(fullSchema);
    const valid = validate(event);

    if (!valid) {
        throw new HttpError(
            'Event validation failed',
            400,
            validate.errors ?? {},
        );
    }

    return event as ValidEvent<T>;
};
