import {
    ExecuteStatementCommand,
    SqlParameter,
} from '@aws-sdk/client-rds-data';
import { getRdsDataClient } from './rdsDataClient';
import { RdsDBConnectionParams } from './types/rdsDBConnectionParams';

type ExecuteStatement = (input: {
    dbCon: RdsDBConnectionParams;
    sql: string;
    parameters?: SqlParameter[];
    includeResultMetadata?: boolean;
}) => Promise<any>;

export const executeRdsStatement: ExecuteStatement = async ({
    dbCon,
    sql,
    parameters,
    includeResultMetadata = true,
}) => {
    const rdsDataClient = getRdsDataClient();

    console.log(`RDS :: Execute Statement :: ${sql}`);
    return rdsDataClient.send(
        new ExecuteStatementCommand({
            ...dbCon,
            includeResultMetadata,
            parameters,
            sql,
        }),
    );
};
