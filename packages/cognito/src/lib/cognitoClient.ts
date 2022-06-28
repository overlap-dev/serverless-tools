import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

const { REGION } = process.env;

const cognitoIdentityProviderClient = new CognitoIdentityProviderClient({
    region: REGION,
});

export const getCognitoIdentityProviderClient = () => {
    return cognitoIdentityProviderClient;
};
