import type { Parser } from './parser.type';

export const inParser: Parser = (column, value) => {
    return {
        sqlOperator: 'IN',
        column,
        value: value.replace(/ /g, '').split(','),
    };
};
