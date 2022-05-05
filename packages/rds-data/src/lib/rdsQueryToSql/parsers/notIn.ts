import type { Parser } from './parser.type';

export const notInParser: Parser = (column, value) => {
    return {
        sqlOperator: 'NOT IN',
        column,
        value: value.replace(/ /g, '').split(','),
    };
};
