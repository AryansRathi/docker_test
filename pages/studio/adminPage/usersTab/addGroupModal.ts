import type { Locator } from '@playwright/test';
import { UsersTab } from '../usersTab';

export class AddGroupModal {
    readonly parent: UsersTab;
    readonly root: Locator;

    readonly searchInput: Locator;
    readonly groupItem: (name: string) => Locator;

    readonly cancelButton: Locator;
    readonly submitButton: Locator;

    constructor(parent: UsersTab) {
        this.parent = parent;
        this.root = parent.parent.parent.page.locator('div.v-overlay__content', {
            hasText: 'Add Group'
        });

        this.searchInput = this.root
            .getByTestId('IS-AddGroupDialog-SearchGroups-IxInput-root')
            .getByRole('textbox');
        this.groupItem = (name: string) => this.root.locator('div.group-item', { hasText: name });

        this.cancelButton = this.root.getByTestId('IS-AddGroupDialog-IxModal-cancel-IxButton-root');
        this.submitButton = this.root.getByTestId('IS-AddGroupDialog-IxModal-submit-IxButton-root');
    }
}
