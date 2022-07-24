export type ValidEvent<T> = {
    version: string;
    id: string;
    'detail-type': string;
    source: string;
    account: string;
    time: string;
    region: string;
    detail: T;
};

export type ValidateEvent<T> = (
    event: Record<string, unknown>,
) => ValidEvent<T>;
