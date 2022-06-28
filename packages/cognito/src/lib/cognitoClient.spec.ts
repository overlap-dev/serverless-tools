import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { getCognitoIdentityProviderClient } from './cognitoClient';

describe('cognitoClient', () => {
    it('should get a CognitoIdentityProviderClient', () => {
        const client = getCognitoIdentityProviderClient();

        expect(client).toBeInstanceOf(CognitoIdentityProviderClient);
    });
});
