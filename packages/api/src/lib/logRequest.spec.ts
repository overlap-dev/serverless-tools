import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { logRequest } from './logRequest';

describe('logRequest', () => {
    it('should log formatted message with console.log', () => {
        console.log = jest.fn();

        const event: APIGatewayProxyEventV2 = {
            version: '2.0',
            routeKey: 'GET /list',
            rawPath: '/list',
            rawQueryString: 'foo=bar&baz=boom',
            cookies: [],
            headers: {
                Host: 'localhost:4000',
                Accept: 'application/json',
            },
            queryStringParameters: { foo: 'bar', baz: 'boom' },
            requestContext: {
                accountId: 'offlineContext_accountId',
                apiId: 'offlineContext_apiId',
                domainName: 'offlineContext_domainName',
                domainPrefix: 'offlineContext_domainPrefix',
                http: {
                    method: 'GET',
                    path: '/list',
                    protocol: 'HTTP/1.1',
                    sourceIp: '127.0.0.1',
                    userAgent: 'insomnia/2021.7.2',
                },
                requestId: 'offlineContext_resourceId',
                routeKey: 'GET /list',
                stage: '$default',
                time: '21/Feb/2022:11:00:59 +0100',
                timeEpoch: 1645437659760,
            },
            isBase64Encoded: false,
            stageVariables: undefined,
        };

        logRequest(event);

        expect(console.log).toHaveBeenCalledWith(
            `REQUEST: ${event.rawPath}${
                event.rawQueryString
                    ? '?' + decodeURIComponent(event.rawQueryString)
                    : ''
            }`,
        );
    });
});
