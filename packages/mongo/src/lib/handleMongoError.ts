import { HttpError } from '@overlap/serverless-tools-api';
import { MongoServerError } from 'mongodb';

export const handleMongoError = (error: MongoServerError) => {
    const badInputMessage = 'MongoDB Bad Input';

    if (error.code && error.code === 121) {
        throw new HttpError(badInputMessage, 400, {
            note: error.message,
            details: error.errInfo?.['details'],
        });
    } else if (error.code && error.code === 2)
        throw new HttpError(badInputMessage, 400, {
            note: error.message,
        });
    else {
        throw new HttpError('Internal Server Error', 500);
    }
};
