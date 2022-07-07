import { APIGatewayProxyEventV2 } from 'aws-lambda';

export const logRequest = (event: any) => {
    if (event.rawPath) {
        logHttpApiEvent(event);
    }

    if (event.requestContext?.authorizer?.lambda) {
        logLambdaAuthContext(event);
    }
};

const logHttpApiEvent = (event: APIGatewayProxyEventV2) => {
    try {
        console.log(
            `REQUEST: ${event.rawPath}${
                event.rawQueryString
                    ? '?' + decodeURIComponent(event.rawQueryString)
                    : ''
            }`,
        );
    } catch (error) {
        console.log('REQUEST: log failed');
    }
};

const logLambdaAuthContext = (event: any) => {
    try {
        const authContext = event.requestContext?.authorizer?.lambda;
        const loggableAuthContext = {
            sub: authContext.sub,
            org: authContext.org,
            groups: authContext.groups,
            policy: authContext.policy
                ? JSON.parse(
                      Buffer.from(authContext.policy, 'base64').toString(
                          'ascii',
                      ),
                  )
                : null,
        };

        console.log(`REQUEST AUTH: ${JSON.stringify(loggableAuthContext)}`);
    } catch (error) {
        console.log('REQUEST AUTH: log failed');
    }
};
