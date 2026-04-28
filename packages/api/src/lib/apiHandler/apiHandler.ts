import { MiddyfiedHandler } from '@middy/core';
import {
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2,
    Context,
} from 'aws-lambda';
import { formatJSONResponse } from '../formatJsonResponse';
import { logRequest } from '../logRequest';
import { middyfy } from '../middleware';
import { preflightCors } from './preflightCors';

/**
 * The result a `RouteController` may return.
 *
 * Mirrors what API Gateway / Lambda Function URL accept: either a structured
 * proxy result (status code, headers, body, ...) or a plain string body.
 */
export type RouteControllerResult = APIGatewayProxyResultV2;

/**
 * A function-style route controller.
 *
 * Notes:
 * - The signature is intentionally restricted to **2 parameters**. AWS Lambda's
 *   Node.js 24 runtime rejects handlers whose `.length === 3` and which are
 *   not declared `async` (`Runtime.CallbackHandlerDeprecated`). Disallowing
 *   the 3rd `callback` parameter at the type level prevents that footgun.
 * - `event` is typed as `any` on purpose: route controllers are commonly
 *   produced by `HttpApiEventHandler<TBody, TQuery>`, which narrows `event`
 *   to a `ValidatedHttpApiProxyEvent`. Because function parameters are
 *   contravariant, a narrower-event handler can't be assigned to a wider-event
 *   parameter type — so we accept `any` here and let each controller declare
 *   its own precise event shape.
 */
export type RouteControllerFn = (
    event: any,
    context: Context,
) => Promise<RouteControllerResult> | RouteControllerResult;
/**
 * Anything that can be registered as a route controller in
 * {@link ApiHandlerOptions.routeControllers}: either a plain async function or
 * a middy-wrapped handler.
 */
export type RouteController =
    | RouteControllerFn
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

    const apiHandler = async (
        event: APIGatewayProxyEventV2,
        context: Context,
    ): Promise<RouteControllerResult> => {
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
            ? controller(event, context)
            : middyfy({
                  handler: async () =>
                      formatJSONResponse(404, { message: 'Not Found' }),
              })(event, context);
    };

    return apiHandler;
};
