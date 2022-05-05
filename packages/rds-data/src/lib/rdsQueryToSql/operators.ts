import {
    betweenParser,
    equalsParser,
    greaterThanEqualsParser,
    greaterThanParser,
    inParser,
    lessThanEqualsParser,
    lessThanParser,
    likeParser,
    notBetweenParser,
    notEqualsParser,
    notInParser,
    notLikeParser,
    notParser,
    Parser,
} from './parsers';

type OperatorDefinition = {
    parser: Parser;
};

/**
 * Map of operators to be used in a query and their SQL equivalent.
 *
 * eq: Find column equal with value
 *
 * not: Not same with given value
 *
 * ne: Negation, the opposite of equal
 *
 * lt: Lower than
 *
 * gt: Greater than
 *
 * lte: Lower than and equal
 *
 * gte: Greater than and equal
 *
 * like: Like with case sensitive
 *
 * notLike: Opposite of like with case sensitive
 *
 * in: Find value which listed on given list
 *
 * notIn: Find value which not listed in given list
 *
 * between: Find value which between 2 given values
 *
 * notBetween: Find value which is not between 2 given values
 */
export const operators: Record<string, OperatorDefinition> = {
    eq: {
        parser: equalsParser,
    },
    ne: {
        parser: notEqualsParser,
    },
    not: {
        parser: notParser,
    },
    lt: {
        parser: lessThanParser,
    },
    lte: {
        parser: lessThanEqualsParser,
    },
    gt: {
        parser: greaterThanParser,
    },
    gte: {
        parser: greaterThanEqualsParser,
    },
    like: {
        parser: likeParser,
    },
    notLike: {
        parser: notLikeParser,
    },
    in: {
        parser: inParser,
    },
    notIn: {
        parser: notInParser,
    },
    between: {
        parser: betweenParser,
    },
    notBetween: {
        parser: notBetweenParser,
    },
};
