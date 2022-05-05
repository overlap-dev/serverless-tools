export type ParserResult = {
    sqlOperator: string | string[];
    column: string;
    value: string | string[];
};

export type Parser = (column: string, value: string) => ParserResult;
