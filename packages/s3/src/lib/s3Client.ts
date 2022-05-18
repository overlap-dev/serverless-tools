import { S3Client } from '@aws-sdk/client-s3';

const { REGION } = process.env;

const s3Client = new S3Client({ region: REGION });

export const getS3Client = () => {
    return s3Client;
};
