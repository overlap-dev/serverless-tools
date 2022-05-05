import { HttpError } from '@overlap/serverless-tools-api';

/**
 * Takes an error and if it comes from RDS it will transform.
 * If the error does not come from RDS it will simply return the original error.
 *
 * @param error
 */
export const handleRdsError = (
    error: any,
    message = 'RDS operation failed',
) => {
    if (!error.$metadata) {
        return error;
    }

    let exposeError = false;
    let statusCode = error.$metadata.httpStatusCode ?? 500;
    let errorCode = statusCode === 400 ? 'VALIDATION_ERROR' : 'SERVER_ERROR';

    if (error.message.includes('Communications link failure')) {
        errorCode = 'RDS_ASLEEP';
        statusCode = 408;
        exposeError = true;
    }

    if (error.message.includes('Duplicate entry')) {
        errorCode = 'STATUS_ALREADY_EXISTS';
        exposeError = true;
    }

    if (error.message.includes('a foreign key constraint fails')) {
        errorCode = 'FOREIGN_KEY_CONSTRAINT';
        exposeError = true;
    }

    return new HttpError(
        message,
        statusCode,
        {
            errorCode: errorCode,
            info: error.message,
        },
        exposeError,
    );
};
