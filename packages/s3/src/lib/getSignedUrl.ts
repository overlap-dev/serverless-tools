import { ServiceInputTypes } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Command } from '@aws-sdk/smithy-client';
import { MetadataBearer, RequestPresigningArguments } from '@aws-sdk/types';
import { getS3Client } from './s3Client';

export const getSignedUrl = <
    InputTypesUnion extends object,
    InputType extends InputTypesUnion,
    OutputType extends MetadataBearer = MetadataBearer,
>(
    command: Command<
        InputType,
        OutputType,
        any,
        ServiceInputTypes,
        MetadataBearer
    >,
    options?: RequestPresigningArguments,
) => {
    const s3Client = getS3Client();
    return awsGetSignedUrl(s3Client, command, options);
};
