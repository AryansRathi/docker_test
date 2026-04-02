import type { Locator } from '@playwright/test';
import { GroupsTab } from '../groupsTab';

export class AddMemberModal {
    readonly parent: GroupsTab;
    readonly root: Locator;

    readonly searchInput: Locator;
    readonly memberItem: (username: string) => Locator;

    readonly cancelButton: Locator;
    readonly submitButton: Locator;

    constructor(parent: GroupsTab) {
        this.parent = parent;
        this.root = parent.parent.parent.page.locator('div.v-overlay__content', {
            hasText: 'Add Member'
        });

        this.searchInput = this.root
            .getByTestId('IS-AddMemberDialog-SearchMembers-IxInput-root')
            .getByRole('textbox');
        this.memberItem = (username: string) =>
            this.root.locator('div.member-item', { hasText: username });

        this.cancelButton = this.root.getByTestId(
            'IS-AddMemberDialog-IxModal-cancel-IxButton-root'
        );
        this.submitButton = this.root.getByTestId(
            'IS-AddMemberDialog-IxModal-submit-IxButton-root'
        );
    }
}
