import { ColumnMetadata, Field } from '@aws-sdk/client-rds-data';

export const itemFromRdsRecord = <TItem>(
    fields?: Field[],
    columnMetadata?: ColumnMetadata[],
): TItem => {
    if (!fields) {
        throw new Error('Could not unmarshall record, fields are missing');
    }
    if (!columnMetadata) {
        throw new Error(
            'Could not unmarshall record, column meta data is missing',
        );
    }

    return fields.reduce((acc, field, idx) => {
        const fieldName = columnMetadata[idx].name;
        const fieldType = Object.keys(field)[0];

        if (!fieldName || fieldType === 'isNull' || fieldType === '$unknown') {
            return acc;
        }

        return {
            ...acc,
            [fieldName]: (field as Record<string, any>)[fieldType],
        };
    }, {}) as TItem;
};
