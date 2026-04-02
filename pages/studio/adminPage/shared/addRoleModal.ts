import type { Locator } from '@playwright/test';
import type { AdminPage } from '../../adminPage';

export class AddRoleModal {
    readonly parent: AdminPage;
    readonly root: Locator;

    readonly searchInput: Locator;
    readonly roleItem: (name: string) => Locator;

    readonly cancelButton: Locator;
    readonly submitButton: Locator;

    constructor(parent: AdminPage) {
        this.parent = parent;
        this.root = parent.parent.page.locator('div.v-overlay__content', { hasText: 'Add Role' });

        this.searchInput = this.root
            .getByTestId('IS-AddRoleDialog-SearchRoles-IxInput-root')
            .getByRole('textbox');

        this.roleItem = (name: string) => this.root.locator('div.role-item', { hasText: name });

        this.cancelButton = this.root.getByTestId('IS-AddRoleDialog-IxModal-cancel-IxButton-root');
        this.submitButton = this.root.getByTestId('IS-AddRoleDialog-IxModal-submit-IxButton-root');
    }
}
