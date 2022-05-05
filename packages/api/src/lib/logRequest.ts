import { APIGatewayProxyEventV2 } from 'aws-lambda';

export const logRequest = (event: any) => {
    if (event.rawPath) {
        logHttpApiEvent(event);
    }
};

const logHttpApiEvent = (event: APIGatewayProxyEventV2) => {
    console.log(
        `REQUEST: ${event.rawPath}${
            event.rawQueryString
                ? '?' + decodeURIComponent(event.rawQueryString)
                : ''
        }`,
    );
};
