import { SESClient } from '@aws-sdk/client-ses';

const { REGION } = process.env;

const sesClient = new SESClient({ region: REGION });

export const getSESClient = () => {
    return sesClient;
};
