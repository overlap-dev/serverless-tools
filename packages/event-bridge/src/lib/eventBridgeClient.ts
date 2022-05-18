import { EventBridgeClient } from '@aws-sdk/client-eventbridge';

const { REGION } = process.env;

const eventBridgeClient = new EventBridgeClient({ region: REGION });

export const getEventBridgeClient = () => {
    return eventBridgeClient;
};
