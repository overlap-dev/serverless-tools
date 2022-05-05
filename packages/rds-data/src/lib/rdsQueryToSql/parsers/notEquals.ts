import type { Parser } from './parser.type';

export const notEqualsParser: Parser = (column, value) => {
    return {
        sqlOperator: '!=',
        column,
        value,
    };
};
