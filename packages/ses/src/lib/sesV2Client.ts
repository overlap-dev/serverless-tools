import { SESv2Client } from '@aws-sdk/client-sesv2';

const { REGION } = process.env;

const sesV2Client = new SESv2Client({ region: REGION });

export const getSESv2Client = () => {
    return sesV2Client;
};
