import type { Locator } from '@playwright/test';
import { UsersTab } from '../usersTab';

export class CreateUserModal {
    readonly parent: UsersTab;
    readonly root: Locator;

    readonly usernameInput: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly searchGroupsInput: Locator;
    readonly addGroupButton: Locator;
    readonly searchRolesInput: Locator;
    readonly addRoleButton: Locator;
    readonly passwordInput: Locator;
    readonly repeatPasswordInput: Locator;

    readonly cancelButton: Locator;
    readonly submitButton: Locator;

    constructor(parent: UsersTab) {
        this.parent = parent;
        this.root = parent.parent.parent.page.locator('div.v-overlay__content', {
            hasText: 'Create User'
        });

        this.usernameInput = this.root
            .getByTestId('UserModal-Username--IxInput-root')
            .getByRole('textbox');
        this.firstNameInput = this.root
            .getByTestId('UserModal-Firstname--IxInput-root')
            .getByRole('textbox');
        this.lastNameInput = this.root
            .getByTestId('UserModal-Lastname--IxInput-root')
            .getByRole('textbox');
        this.emailInput = this.root
            .getByTestId('UserModal-Email--IxInput-root')
            .getByRole('textbox');
        this.searchGroupsInput = this.root
            .getByTestId('UserModal-GroupSearch--IxInput-root')
            .getByRole('textbox');
        this.addGroupButton = this.root.getByTestId('UserModal-AddGroup--IxButton-root');
        this.searchRolesInput = this.root
            .getByTestId('UserModal-RoleSearch--IxInput-root')
            .getByRole('textbox');
        this.addRoleButton = this.root.getByTestId('UserModal-AddRole--IxButton-root');
        this.passwordInput = this.root
            .getByTestId('UserModal-Password--IxInput-root')
            .getByRole('textbox');
        this.repeatPasswordInput = this.root
            .getByTestId('UserModal-PasswordRepeat--IxInput-root')
            .getByRole('textbox');

        this.cancelButton = this.root.getByTestId('IS-UserModal-IxModal-cancel-IxButton-root');
        this.submitButton = this.root.getByTestId('IS-UserModal-IxModal-submit-IxButton-root');
    }
}
