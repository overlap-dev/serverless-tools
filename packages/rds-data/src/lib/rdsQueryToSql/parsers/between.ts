import type { Parser } from './parser.type';

export const betweenParser: Parser = (column, value) => {
    return {
        sqlOperator: ['BETWEEN', 'AND'],
        column,
        value: value.replace(/ /g, '').split(','),
    };
};
