import type { Parser } from './parser.type';

export const lessThanParser: Parser = (column, value) => {
    return {
        sqlOperator: '<',
        column,
        value,
    };
};
