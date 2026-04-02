import type { Locator } from '@playwright/test';
import { AdminPage } from '../adminPage';
import { CreateUserModal } from './usersTab/createUserModal';
import { AddGroupModal } from './usersTab/addGroupModal';
import { AddRoleModal } from './shared/addRoleModal';
import { TestUser } from 'test/factories/adminFactory';

export class UsersTab {
    readonly parent: AdminPage;
    readonly root: Locator;

    readonly createUserButton: Locator;
    readonly searchInput: Locator;

    readonly createUserModal: CreateUserModal;
    readonly addGroupModal: AddGroupModal;
    readonly addRoleModal: AddRoleModal;

    constructor(parent: AdminPage) {
        this.parent = parent;
        this.root = parent.root;

        this.createUserButton = this.root.getByTestId('IS-UsersView-Create-IxButton-root');
        this.searchInput = this.root
            .getByTestId('IS-UsersView-Search-IxInput-root')
            .getByRole('textbox');

        this.createUserModal = new CreateUserModal(this);
        this.addGroupModal = new AddGroupModal(this);
        this.addRoleModal = new AddRoleModal(parent);
    }

    public async open() {
        await this.parent.sidebar.usersTabButton.click();
    }

    public async createUser(user: TestUser) {
        await this.createUserButton.click();
        await this.createUserModal.usernameInput.fill(user.username);
        await this.createUserModal.firstNameInput.fill(user.firstName);
        await this.createUserModal.lastNameInput.fill(user.lastName);
        await this.createUserModal.emailInput.fill(user.email);
        await this.createUserModal.passwordInput.fill(user.password);
        await this.createUserModal.repeatPasswordInput.fill(user.password);

        if (user.groups.length > 0) {
            await this.createUserModal.addGroupButton.click();
            for (const group of user.groups) {
                await this.addGroupModal.groupItem(group).click();
            }
            await this.addGroupModal.submitButton.click();
        }

        if (user.roles.length > 0) {
            await this.createUserModal.addRoleButton.click();
            for (const role of user.roles) {
                await this.addRoleModal.roleItem(role).click();
            }
            await this.addRoleModal.submitButton.click();
        }

        await this.createUserModal.submitButton.click();
    }
}
