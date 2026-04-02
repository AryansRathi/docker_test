import type { Locator } from '@playwright/test';
import { RolesAndPermissionsTab } from '../rolesAndPermissionsTab';

export class CreateRoleModal {
    readonly parent: RolesAndPermissionsTab;
    readonly root: Locator;

    readonly nameInput: Locator;
    readonly descriptionInput: Locator;

    readonly permissionsTabBar: Locator;
    readonly tenantPermissionsTabButton: Locator;
    readonly appBuilderPermissionsTabButton: Locator;
    readonly processBuilderPermissionsTabButton: Locator;
    readonly dataBuilderPermissionsTabButton: Locator;

    readonly cancelButton: Locator;
    readonly submitButton: Locator;

    constructor(parent: RolesAndPermissionsTab) {
        this.parent = parent;
        this.root = parent.parent.parent.page.locator('div.v-overlay__content', {
            hasText: 'Create Role'
        });

        this.nameInput = this.root
            .getByTestId('IS-RoleModal-Name-IxInput-root')
            .getByRole('textbox');
        this.descriptionInput = this.root
            .getByTestId('IS-RoleModal-Description-IxTextArea-root')
            .getByRole('textbox');

        this.permissionsTabBar = this.root.getByTestId(
            'IS-RoleModal-Permissions-TabBar-IxTabBar-root'
        );
        this.tenantPermissionsTabButton = this.permissionsTabBar.getByText('Tenant');
        this.appBuilderPermissionsTabButton = this.permissionsTabBar.getByText('App Builder');
        this.processBuilderPermissionsTabButton =
            this.permissionsTabBar.getByText('Process Builder');
        this.dataBuilderPermissionsTabButton = this.permissionsTabBar.getByText('Data Builder');

        this.cancelButton = this.root.getByTestId('IS-RoleModal-IxModal-cancel-IxButton-root');
        this.submitButton = this.root.getByTestId('IS-RoleModal-IxModal-submit-IxButton-root');
    }
}
