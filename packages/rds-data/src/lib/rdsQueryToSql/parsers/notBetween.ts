import type { Parser } from './parser.type';

export const notBetweenParser: Parser = (column, value) => {
    return {
        sqlOperator: ['NOT BETWEEN', 'AND'],
        column,
        value: value.replace(/ /g, '').split(','),
    };
};
