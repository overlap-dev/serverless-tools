import type { Parser } from './parser.type';

export const likeParser: Parser = (column, value) => {
    return {
        sqlOperator: 'LIKE',
        column,
        value,
    };
};
