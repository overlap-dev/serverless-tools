import { RDSDataClient } from '@aws-sdk/client-rds-data';

const { REGION } = process.env;

const rdsDataClient = new RDSDataClient({ region: REGION });

export const getRdsDataClient = () => {
    return rdsDataClient;
};
