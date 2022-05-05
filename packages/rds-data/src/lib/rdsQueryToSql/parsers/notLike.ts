import type { Parser } from './parser.type';

export const notLikeParser: Parser = (column, value) => {
    return {
        sqlOperator: 'NOT LIKE',
        column,
        value,
    };
};
