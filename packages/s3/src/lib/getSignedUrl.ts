import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';
import { RequestPresigningArguments } from '@smithy/types';
import { getS3Client } from './s3Client';

export const getSignedUrl = (
    command: any,
    options?: RequestPresigningArguments,
) => {
    const s3Client = getS3Client();
    return awsGetSignedUrl(s3Client, command, options);
};
