import type { Parser } from './parser.type';

export const lessThanEqualsParser: Parser = (column, value) => {
    return {
        sqlOperator: '<=',
        column,
        value,
    };
};
