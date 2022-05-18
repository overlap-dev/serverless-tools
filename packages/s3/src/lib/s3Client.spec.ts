import { S3Client } from '@aws-sdk/client-s3';
import { getS3Client } from './s3Client';

describe('s3Client', () => {
    it('should get a S3Client', () => {
        const client = getS3Client();

        expect(client).toBeInstanceOf(S3Client);
    });
});
