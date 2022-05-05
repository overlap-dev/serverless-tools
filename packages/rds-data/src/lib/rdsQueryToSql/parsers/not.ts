import type { Parser } from './parser.type';

export const notParser: Parser = (column, value) => {
    return {
        sqlOperator: 'IS NOT',
        column,
        value,
    };
};
