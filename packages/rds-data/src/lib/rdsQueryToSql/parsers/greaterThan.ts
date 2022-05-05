import type { Parser } from './parser.type';

export const greaterThanParser: Parser = (column, value) => {
    return {
        sqlOperator: '>',
        column,
        value,
    };
};
