import { HttpError } from './httpError';

describe('HttpError', () => {
    it('should create http error with details', () => {
        const message = 'Test Error';
        const statusCode = 500;
        const details = { foo: 'bar' };

        const httpError = new HttpError(message, statusCode, details);

        expect(httpError).toHaveProperty('name');
        expect(httpError.name).toBe('HttpError');

        expect(httpError).toHaveProperty('message');
        expect(httpError.message).toBe(message);

        expect(httpError).toHaveProperty('statusCode');
        expect(httpError.statusCode).toBe(statusCode);

        expect(httpError).toHaveProperty('details');
        expect(httpError.details).toEqual(details);
    });

    it('should create http error without details', () => {
        const message = 'Test Error';
        const statusCode = 500;

        const httpError = new HttpError(message, statusCode);

        expect(httpError).toHaveProperty('name');
        expect(httpError.name).toBe('HttpError');

        expect(httpError).toHaveProperty('message');
        expect(httpError.message).toBe(message);

        expect(httpError).toHaveProperty('statusCode');
        expect(httpError.statusCode).toBe(statusCode);

        expect(httpError).not.toHaveProperty('details');
    });
});
