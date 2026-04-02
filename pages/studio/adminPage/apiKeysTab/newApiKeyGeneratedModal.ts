import type { Locator } from '@playwright/test';
import { ApiKeysTab } from '../apiKeysTab';

export class NewApiKeyGeneratedModal {
    readonly parent: ApiKeysTab;
    readonly root: Locator;

    readonly apiKeyTextField: Locator;

    readonly okayButton: Locator;
    readonly cancelButton: Locator;

    constructor(parent: ApiKeysTab) {
        this.parent = parent;
        this.root = parent.parent.parent.page.locator('div.v-overlay__content', {
            hasText: 'New API Key Generated'
        });

        this.apiKeyTextField = this.root.locator('input#IS-ApiKeysView-NewKey');

        this.okayButton = this.root.getByTestId('IS-CredentialsCreation-Save-IxButton-root');
        this.cancelButton = this.root.getByTestId('IS-CredentialsCreation-Cancel-IxButton-root');
    }

    public async getApiKey() {
        return await this.apiKeyTextField.inputValue();
    }
}
