import type { Locator } from '@playwright/test';
import { AdminPage } from '../adminPage';
import { CreateCredentialModal } from './credentialsTab/createCredentialModal';
import { TestTokenCredential } from 'test/factories/adminFactory';
import { TestUsernamePasswordCredential } from 'test/factories/adminFactory';

export class CredentialsTab {
    readonly parent: AdminPage;
    readonly root: Locator;

    readonly createCredentialButton: Locator;
    readonly searchInput: Locator;

    readonly credentialsTable: Locator;
    readonly credentialRow: (credentialName: string) => Locator;
    readonly credentialMenuButton: (credentialName: string) => Locator;
    readonly credentialMenuRoot: Locator;
    readonly credentialMenuEditItem: Locator;
    readonly credentialMenuDeleteItem: Locator;
    readonly credentialMenuActivateItem: Locator;
    readonly credentialMenuDeactivateItem: Locator;
    readonly credentialMenuPermissionsItem: Locator;

    readonly createCredentialModal: CreateCredentialModal;

    constructor(parent: AdminPage) {
        this.parent = parent;
        this.root = parent.root;

        this.createCredentialButton = this.root.getByTestId(
            'IS-CredentialsView-AddCredential-IxButton-root'
        );
        this.searchInput = this.root
            .getByTestId('IS-CredentialsView-Search-IxInput-root')
            .getByRole('textbox');

        this.credentialsTable = this.root.getByTestId(
            'IS-CredentialsView-DataTable-IxDataTable-root'
        );
        this.credentialRow = (credentialName: string) =>
            this.credentialsTable.locator('tr').filter({
                has: this.parent.parent.page.locator('td', { hasText: credentialName })
            });
        this.credentialMenuButton = (credentialName: string) =>
            this.credentialRow(credentialName).getByTestId(
                'IS-CredentialsView-Actions-Button-IxIconButton-root'
            );
        this.credentialMenuRoot = this.parent.parent.page.getByTestId(
            'IS-CredentialsView-Actions-IxMenu-root'
        );
        this.credentialMenuEditItem = this.credentialMenuRoot.getByTestId(
            'IS-CredentialsView-Actions-Edit-IxMenuListItem-root'
        );
        this.credentialMenuDeleteItem = this.credentialMenuRoot.getByTestId(
            'IS-CredentialsView-Actions-Delete-IxMenuListItem-root'
        );
        this.credentialMenuActivateItem = this.credentialMenuRoot.getByTestId(
            'IS-CredentialsView-Actions-Activate-IxMenuListItem-root'
        );
        this.credentialMenuDeactivateItem = this.credentialMenuRoot.getByTestId(
            'IS-CredentialsView-Actions-Deactivate-IxMenuListItem-root'
        );
        this.credentialMenuPermissionsItem = this.credentialMenuRoot.getByTestId(
            'IS-CredentialsView-Actions-Permissions-IxMenuListItem-root'
        );

        this.createCredentialModal = new CreateCredentialModal(this);
    }

    public async open() {
        await this.parent.sidebar.credentialsTabButton.click();
    }

    public async deactivateCredential(credentialName: string) {
        await this.credentialMenuButton(credentialName).click();
        await this.credentialMenuDeactivateItem.click();
    }

    public async activateCredential(credentialName: string) {
        await this.credentialMenuButton(credentialName).click();
        await this.credentialMenuActivateItem.click();
    }

    public async createUsernamePasswordCredential(credential: TestUsernamePasswordCredential) {
        await this.createCredentialButton.click();
        await this.createCredentialModal.credentialTypeSelect.click();
        await this.createCredentialModal.credentialTypeUsernamePasswordOption.click();
        await this.createCredentialModal.nameInput.fill(credential.name);
        await this.createCredentialModal.pathInput.fill(credential.path);
        await this.createCredentialModal.usernameInput.fill(credential.username);
        await this.createCredentialModal.passwordInput.fill(credential.password);
        await this.createCredentialModal.saveButton.click();
    }

    public async createTokenCredential(credential: TestTokenCredential) {
        await this.createCredentialButton.click();
        await this.createCredentialModal.credentialTypeSelect.click();
        await this.createCredentialModal.credentialTypeTokenOption.click();
        await this.createCredentialModal.nameInput.fill(credential.name);
        await this.createCredentialModal.pathInput.fill(credential.path);
        await this.createCredentialModal.tokenInput.fill(credential.token);
        await this.createCredentialModal.saveButton.click();
    }

    public async deleteCredential(credentialName: string) {
        await this.credentialMenuButton(credentialName).click();
        await this.credentialMenuDeleteItem.click();
    }

    public async renameCredential(credentialName: string, newName: string) {
        await this.credentialMenuButton(credentialName).click();
        await this.credentialMenuEditItem.click();
        await this.createCredentialModal.nameInput.fill(newName);
        await this.createCredentialModal.saveButton.click();
    }
}
