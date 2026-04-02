import type { Locator } from '@playwright/test';
import { AdminPage } from '../adminPage';
import { CreateGroupModal } from './groupsTab/createGroupModal';
import { AddRoleModal } from './shared/addRoleModal';
import { AddMemberModal } from './groupsTab/addMemberModal';
import { TestGroup } from 'test/factories/adminFactory';

export class GroupsTab {
    readonly parent: AdminPage;
    readonly root: Locator;

    readonly createGroupButton: Locator;
    readonly searchInput: Locator;

    readonly createGroupModal: CreateGroupModal;
    readonly addRoleModal: AddRoleModal;
    readonly addMemberModal: AddMemberModal;

    constructor(parent: AdminPage) {
        this.parent = parent;
        this.root = parent.root;

        this.createGroupButton = this.root.getByTestId('IS-GroupsView-Create-IxButton-root');
        this.searchInput = this.root
            .getByTestId('IS-GroupsView-Search-IxInput-root')
            .getByRole('textbox');

        this.createGroupModal = new CreateGroupModal(this);
        this.addRoleModal = new AddRoleModal(this.parent);
        this.addMemberModal = new AddMemberModal(this);
    }

    public async open() {
        await this.parent.sidebar.groupsTabButton.click();
    }

    public async createGroup(group: TestGroup) {
        await this.createGroupButton.click();
        await this.createGroupModal.nameInput.fill(group.name);
        await this.createGroupModal.descriptionInput.fill(group.description);

        if (group.roles.length > 0) {
            await this.createGroupModal.addRoleButton.click();
            for (const role of group.roles) {
                await this.addRoleModal.roleItem(role).click();
            }
            await this.addRoleModal.submitButton.click();
        }

        if (group.members.length > 0) {
            await this.createGroupModal.addMemberButton.click();
            for (const member of group.members) {
                await this.addMemberModal.memberItem(member).click();
            }
            await this.addMemberModal.submitButton.click();
        }

        await this.createGroupModal.submitButton.click();
    }
}
