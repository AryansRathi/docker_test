import type { Locator } from '@playwright/test';
import { AdminPage } from '../adminPage';

export class AuthenticationTab {
    readonly parent: AdminPage;
    readonly root: Locator;

    readonly synchronizeNowButton: Locator;
    readonly tenantIdInput: Locator;
    readonly synchronizeOnlyMembersOfInput: Locator;
    readonly syncPeriodicallyEveryCheckbox: Locator;
    readonly syncIntervalInput: Locator;
    readonly enableAuthenticationCheckbox: Locator;
    readonly providerAliasInput: Locator;
    readonly providerDisplayNameInput: Locator;
    readonly resetButton: Locator;
    readonly applyButton: Locator;

    constructor(parent: AdminPage) {
        this.parent = parent;
        this.root = parent.root;

        this.synchronizeNowButton = this.root.getByTestId('IS-Synchronisation-Sync-IxButton-root');
        this.tenantIdInput = this.root
            .getByTestId('IS-Synchronisation-TenantId-IxInput-root')
            .getByRole('textbox');
        this.synchronizeOnlyMembersOfInput = this.root
            .getByTestId('IS-Synchronisation-SyncOnlyMembersOf-IxInput-root')
            .getByRole('textbox');
        this.syncPeriodicallyEveryCheckbox = this.root
            .getByTestId('IS-Synchronisation-SyncPeriodically-IxToggle-root')
            .getByRole('checkbox');
        this.syncIntervalInput = this.root
            .getByTestId('IS-Synchronisation-SyncInterval-IxInput-root')
            .getByRole('textbox');
        this.enableAuthenticationCheckbox = this.root
            .getByTestId('IS-Synchronisation-EnableAuthentication-IxToggle-root')
            .getByRole('checkbox');
        this.providerAliasInput = this.root
            .getByTestId('IS-Synchronisation-ProviderAlias-IxInput-root')
            .getByRole('textbox');
        this.providerDisplayNameInput = this.root
            .getByTestId('IS-Synchronisation-ProviderDisplayName-IxInput-root')
            .getByRole('textbox');
        this.resetButton = this.root.getByTestId('IS-Synchronisation-Reset-IxButton-root');
        this.applyButton = this.root.getByTestId('IS-Synchronisation-Apply-IxButton-root');
    }

    public async open() {
        await this.parent.sidebar.authenticationTabButton.click();
    }
}
