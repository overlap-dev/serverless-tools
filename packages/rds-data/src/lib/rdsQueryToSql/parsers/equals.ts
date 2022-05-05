import type { Parser } from './parser.type';

export const equalsParser: Parser = (column, value) => {
    return {
        sqlOperator: '=',
        column,
        value,
    };
};
