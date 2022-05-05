import {
    BatchExecuteStatementCommand,
    BeginTransactionCommand,
    CommitTransactionCommand,
    ExecuteStatementCommand,
    SqlParameter,
} from '@aws-sdk/client-rds-data';
import { getRdsDataClient } from './rdsDataClient';
import { RdsDBConnectionParams } from './types/rdsDBConnectionParams';

type TransactionStatementInput = {
    type: 'single' | 'batch';
    sql: string;
    parameters?: SqlParameter[];
    parameterSets?: SqlParameter[][];
    includeResultMetadata?: boolean;
};

type Input = {
    dbCon: RdsDBConnectionParams;
    statements: TransactionStatementInput[];
};

type ExecuteTransaction = (input: Input) => Promise<any>;

export const executeRdsTransaction: ExecuteTransaction = async ({
    dbCon,
    statements,
}) => {
    const rdsDataClient = getRdsDataClient();

    // Begin the transaction
    const beginTransactionCommand = new BeginTransactionCommand(dbCon);
    const transaction = await rdsDataClient.send(beginTransactionCommand);
    const transactionId = transaction.transactionId;

    if (!transactionId) {
        throw new Error('Could not begin transaction');
    }

    console.log(`RDS :: Execute Transaction :: Begin :: ${transactionId}`);

    // Add all statements for the transaction
    for (const statement of statements) {
        console.log(
            `RDS :: Execute Transaction :: Add Statement :: ${statement.type} :: ${statement.sql}`,
        );

        const command =
            statement.type === 'batch'
                ? new BatchExecuteStatementCommand({
                      ...dbCon,
                      parameterSets: statement.parameterSets,
                      sql: statement.sql,
                  })
                : new ExecuteStatementCommand({
                      ...dbCon,
                      parameters: statement.parameters,
                      sql: statement.sql,
                      includeResultMetadata:
                          statement.includeResultMetadata ?? true,
                  });

        await rdsDataClient.send(command);
    }

    // Commit the transaction result
    console.log(`RDS :: Execute Transaction :: Commit :: ${transactionId}`);

    const commitTransactionCommand = new CommitTransactionCommand({
        ...dbCon,
        transactionId,
    });
    return rdsDataClient.send(commitTransactionCommand);
};
