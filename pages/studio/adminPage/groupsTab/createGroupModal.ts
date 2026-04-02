import type { Locator } from '@playwright/test';
import { GroupsTab } from '../groupsTab';

export class CreateGroupModal {
    readonly parent: GroupsTab;
    readonly root: Locator;

    readonly nameInput: Locator;
    readonly descriptionInput: Locator;
    readonly addRoleButton: Locator;
    readonly addMemberButton: Locator;

    readonly cancelButton: Locator;
    readonly submitButton: Locator;

    constructor(parent: GroupsTab) {
        this.parent = parent;
        this.root = parent.parent.parent.page.locator('div.v-overlay__content', {
            hasText: 'Create Group'
        });

        this.nameInput = this.root
            .getByTestId('IS-GroupModal-Name-IxInput-root')
            .getByRole('textbox');
        this.descriptionInput = this.root
            .getByTestId('IS-GroupModal-Description-IxTextArea-root')
            .getByRole('textbox');
        this.addRoleButton = this.root.getByTestId('IS-GroupModal-AddRole-IxButton-root');
        this.addMemberButton = this.root.getByTestId('IS-GroupModal-AddMember-IxButton-root');

        this.cancelButton = this.root.getByTestId('IS-GroupModal-IxModal-cancel-IxButton-root');
        this.submitButton = this.root.getByTestId('IS-GroupModal-IxModal-submit-IxButton-root');
    }
}
