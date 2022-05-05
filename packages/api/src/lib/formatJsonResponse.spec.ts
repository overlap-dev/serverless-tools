import { formatJSONResponse } from './formatJsonResponse';

const defaultHeaders = {
    'Content-Type': 'application/json',
};

describe('formatJSONResponse', () => {
    it('should format response with additional headers', () => {
        const statusCode = 200;
        const payload = { foo: 'bar' };
        const headers = {
            'x-test': 'header-testing',
        };

        const response = formatJSONResponse(200, payload, headers);

        expect(response).toHaveProperty('headers');
        expect(response.headers).toEqual({
            ...headers,
            ...defaultHeaders,
        });

        expect(response).toHaveProperty('statusCode');
        expect(response.statusCode).toBe(statusCode);

        expect(response).toHaveProperty('body');
        expect(response.body).toEqual(JSON.stringify(payload));
    });

    it('should format response without additional headers', () => {
        const statusCode = 200;
        const payload = { foo: 'bar' };

        const response = formatJSONResponse(200, payload);

        expect(response).toHaveProperty('headers');
        expect(response.headers).toEqual({
            ...defaultHeaders,
        });

        expect(response).toHaveProperty('statusCode');
        expect(response.statusCode).toBe(statusCode);

        expect(response).toHaveProperty('body');
        expect(response.body).toEqual(JSON.stringify(payload));
    });
});
