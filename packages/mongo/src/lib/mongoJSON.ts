import { HttpError } from '@overlap/serverless-tools-api';
import { ObjectId } from 'mongodb';

const mongoJSONStringify = (object: Record<string, unknown>) => {
    return JSON.stringify(object);
};

const mongoJSONParse = (
    text: string,
    operatorBlackList: string[] = ['$where'],
) => {
    for (const operator of operatorBlackList) {
        if (text.includes(operator)) {
            throw new HttpError(`Operator '${operator}' is not allowed`, 400);
        }
    }

    const reviver = (key: string, value: unknown) => {
        if (typeof value !== 'string') {
            return value;
        }

        if (value.startsWith('objectId::')) {
            return new ObjectId(value.replace('objectId::', ''));
        } else if (value.startsWith('date::')) {
            return new Date(value.replace('date::', ''));
        } else if (value.startsWith('int::')) {
            return parseInt(value.replace('int::', ''));
        } else if (value.startsWith('double::')) {
            return parseFloat(value.replace('double::', ''));
        } else {
            return value;
        }
    };

    try {
        return JSON.parse(text, reviver);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.name === 'SyntaxError') {
            throw new HttpError('MongoJSON parse error', 400, {
                note: error.message,
            });
        } else {
            throw new HttpError('MongoJSON parse error', 400);
        }
    }
};

export const MongoJSON = {
    parse: mongoJSONParse,
    stringify: mongoJSONStringify,
};
