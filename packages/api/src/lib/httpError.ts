export class HttpError extends Error {
    public statusCode: number;
    public details?: Record<string, unknown>;
    public expose?: boolean;

    constructor(
        message: string,
        statusCode: number,
        details?: any,
        expose?: boolean,
    ) {
        super(message);

        this.name = 'HttpError';
        this.statusCode = statusCode;
        this.expose = expose;

        if (details) {
            this.details = details;
        }
    }
}
