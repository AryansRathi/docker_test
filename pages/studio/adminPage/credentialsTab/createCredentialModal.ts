import type { Locator } from '@playwright/test';
import { CredentialsTab } from '../credentialsTab';

export class CreateCredentialModal {
    readonly parent: CredentialsTab;
    readonly root: Locator;

    readonly credentialTypeSelect: Locator;
    readonly credentialTypeUsernamePasswordOption: Locator;
    readonly credentialTypeApiKeyOption: Locator;
    readonly credentialTypeClientIDClientSecretOption: Locator;
    readonly credentialTypeTokenOption: Locator;

    readonly nameInput: Locator;
    readonly pathInput: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly apiKeyInput: Locator;
    readonly clientIDInput: Locator;
    readonly clientSecretInput: Locator;
    readonly tokenInput: Locator;

    readonly saveButton: Locator;
    readonly cancelButton: Locator;

    constructor(parent: CredentialsTab) {
        this.parent = parent;
        this.root = parent.parent.parent.page.locator('div.v-overlay__content', {
            hasText: 'Create VaultEntry'
        });

        this.credentialTypeSelect = this.root
            .getByTestId('IS-CredentialsCreation-CredentialType-IxSelect-root')
            .getByRole('combobox')
            .first();
        this.credentialTypeUsernamePasswordOption = this.parent.parent.parent.page.getByTestId(
            'IS-CredentialsCreation-CredentialType-IxSelect-item-USERNAME_PASSWORD'
        );
        this.credentialTypeApiKeyOption = this.parent.parent.parent.page.getByTestId(
            'IS-CredentialsCreation-CredentialType-IxSelect-item-API_KEY'
        );
        this.credentialTypeClientIDClientSecretOption = this.parent.parent.parent.page.getByTestId(
            'IS-CredentialsCreation-CredentialType-IxSelect-item-CLIENT_ID_CLIENT_SECRET'
        );
        this.credentialTypeTokenOption = this.parent.parent.parent.page.getByTestId(
            'IS-CredentialsCreation-CredentialType-IxSelect-item-TOKEN'
        );

        this.nameInput = this.root
            .getByTestId('IS-CredentialsCreation-Title-IxInput-root')
            .getByRole('textbox');
        this.pathInput = this.root
            .getByTestId('IS-CredentialsCreation-Path-IxInput-root')
            .getByRole('textbox');
        this.usernameInput = this.root
            .getByTestId('IS-UsernamePasswordValue-Username-IxInput-root')
            .getByRole('textbox');
        this.passwordInput = this.root
            .getByTestId('IS-UsernamePasswordValue-Password-IxInput-root')
            .getByRole('textbox');
        this.apiKeyInput = this.root
            .getByTestId('IS-APIKeyValue-IxInput-root')
            .getByRole('textbox');
        this.clientIDInput = this.root
            .getByTestId('IS-ClientIdClientSecretValue-ClientID-IxInput-root')
            .getByRole('textbox');
        this.clientSecretInput = this.root
            .getByTestId('IS-ClientIdClientSecretValue-ClientSecret-IxInput-root')
            .getByRole('textbox');
        this.tokenInput = this.root.getByTestId('IS-TokenValue-IxInput-root').getByRole('textbox');

        this.saveButton = this.root.getByTestId('IS-CredentialsCreation-Save-IxButton-root');
        this.cancelButton = this.root.getByTestId('IS-CredentialsCreation-Cancel-IxButton-root');
    }
}
