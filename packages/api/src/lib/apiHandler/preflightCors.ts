import { middyfy } from '../middleware';

const handler = async () => {
    return {
        statusCode: 200,
    };
};

export const preflightCors = middyfy({ handler });
