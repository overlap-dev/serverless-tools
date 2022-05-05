import { PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { getDynamoDBClient } from './eventBridgeClient';

type PublishEventProps<T> = {
    eventBus: string;
    source: string;
    eventName: string;
    payload: T | any;
};

export const publishEvent = async <T>({
    eventBus,
    source,
    eventName,
    payload,
}: PublishEventProps<T>) => {
    const client = getDynamoDBClient();

    return client.send(
        new PutEventsCommand({
            Entries: [
                {
                    EventBusName: eventBus,
                    Source: source,
                    DetailType: eventName,
                    Detail: JSON.stringify(payload),
                },
            ],
        }),
    );
};
