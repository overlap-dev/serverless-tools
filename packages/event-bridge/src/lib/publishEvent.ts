import { PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { getEventBridgeClient } from './eventBridgeClient';

type PublishEventProps<T> = {
    eventBus: string;
    source: string;
    eventName: string;
    payload: T;
};

export const publishEvent = async <T>({
    eventBus,
    source,
    eventName,
    payload,
}: PublishEventProps<T>) => {
    const client = getEventBridgeClient();

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
