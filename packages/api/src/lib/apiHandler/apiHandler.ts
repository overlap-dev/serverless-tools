import { MiddyfiedHandler } from '@middy/core';
import { APIGatewayProxyEventV2, Context, Handler } from 'aws-lambda';
import { formatJSONResponse } from '../formatJsonResponse';
import { logRequest } from '../logRequest';
import { middyfy } from '../middleware';
import { preflightCors } from './preflightCors';

export type RouteController =
    | Handler
    | MiddyfiedHandler<any, any, Error, Context>;

export type ApiHandlerOptions = {
    routeControllers?: Record<string, RouteController>;
    addPreflightCors?: boolean;
    isFunctionUrl?: boolean;
};

const defaultOptions: ApiHandlerOptions = {
    routeControllers: {},
    addPreflightCors: true,
    isFunctionUrl: false,
};

export const getApiHandler = (options?: ApiHandlerOptions) => {
    const opts = Object.assign({}, defaultOptions, options);

    const routeControllers: Record<string, RouteController> = {
        ...(opts.addPreflightCors
            ? { 'OPTIONS /{proxy+}': preflightCors }
            : {}),
        ...opts.routeControllers,
    };

    const apiHandler: Handler<APIGatewayProxyEventV2> = async (
        event,
        context,
        callback,
    ) => {
        logRequest(event);

        let routeKey = event.routeKey;
        if (opts.isFunctionUrl) {
            routeKey = `${event.requestContext.http.method.toUpperCase()} ${
                event.requestContext.http.path
            }`;
        }

        // Find the right controller for a route
        const controller = routeControllers[routeKey];

        // Return controller result or return 404 if no controller was found.
        return controller
            ? controller(event, context, callback)
            : middyfy({
                  handler: async () =>
                      formatJSONResponse(404, { message: 'Not Found' }),
              })(event, context);
    };

    return apiHandler;
};
