import { HttpError } from '@overlap/serverless-tools-api';
import { MongoServerError } from 'mongodb';

export const handleMongoError = (error: MongoServerError) => {
    const badInputMessage = 'Bad Input: Database validation failed';

    if (error.code && error.code === 121) {
        throw new HttpError(badInputMessage, 400, {
            note: error.message,
            details: error.errInfo?.['details'],
        });
    } else if (error.code && error.code === 2) {
        throw new HttpError(badInputMessage, 400, {
            note: error.message,
        });
    } else if (error.code && error.code === 11000) {
        throw new HttpError(badInputMessage, 400, {
            note: 'Duplicate key error',
            details: {
                keyValue: error['keyValue'],
            },
        });
    } else {
        throw new HttpError('Internal Server Error', 500);
    }
};
