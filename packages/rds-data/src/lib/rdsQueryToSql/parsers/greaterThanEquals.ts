import type { Parser } from './parser.type';

export const greaterThanEqualsParser: Parser = (column, value) => {
    return {
        sqlOperator: '>=',
        column,
        value,
    };
};
