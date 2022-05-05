import { SqlParameter } from '@aws-sdk/client-rds-data';
import { operators } from './operators';
import { ParserResult } from './parsers';

export type ConvertFilterQueryToSqlInput = {
    query: Record<string, string>;
    columnMap: Record<string, string>;
    tableMap?: Record<string, string>;
};

export type ConvertFilterQueryToSqlResult = {
    sql: string;
    params: SqlParameter[];
};

export const convertQueryToSql = ({
    query,
    columnMap,
    tableMap,
}: ConvertFilterQueryToSqlInput): ConvertFilterQueryToSqlResult => {
    const filters = parseQueryString(query, Object.keys(columnMap));

    return filtersToSql(filters, columnMap, tableMap);
};

const parseQueryString = (
    query: Record<string, string>,
    allowedColumns: string[],
) => {
    return Object.entries(query)
        .map(([key, value]) => {
            const [column, operator] = key.split('__');

            return allowedColumns.includes(column) && operators[operator]
                ? operators[operator].parser(column, value)
                : null;
        })
        .filter((result): result is ParserResult => !!result);
};

const filtersToSql = (
    filters: ParserResult[],
    columnMap: Record<string, string>,
    tableMap?: Record<string, string>,
): ConvertFilterQueryToSqlResult => {
    const params: SqlParameter[] = [];

    const sql = filters.reduce((acc, filter, index) => {
        const table = tableMap?.[filter.column];
        const column = columnMap[filter.column];
        const { value, sqlOperator: operator } = filter;

        let condition = '';

        if (Array.isArray(operator)) {
            console.warn('TODO: Implement array operator matches.');
            return acc;
        }

        if (Array.isArray(value)) {
            const placeHolders = value.map((val, idx) => {
                const valName = `${column}_${idx}`;
                params.push({
                    name: valName,
                    value: { stringValue: val },
                });
                return `:${valName}`;
            });

            condition = '(' + placeHolders.join(',') + ')';
        } else {
            params.push({
                name: column,
                value: { stringValue: value },
            });

            condition = `:${column}`;
        }

        const selector = table
            ? '`' + table + '`.`' + column + '`'
            : '`' + column + '`';

        const sqlClause = selector + ' ' + operator + ' ' + condition;

        return acc + (index > 0 ? ' AND ' : ' ') + sqlClause;
    }, '');

    return { sql, params };
};
