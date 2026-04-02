import type { Locator } from '@playwright/test';
import { AdminPage } from '../adminPage';
import { CreateRoleModal } from './rolesAndPermissionsTab/createRoleModal';

export class RolesAndPermissionsTab {
    readonly parent: AdminPage;
    readonly root: Locator;

    readonly createRoleButton: Locator;
    readonly searchInput: Locator;

    readonly rolesTable: Locator;
    readonly roleRow: (roleName: string) => Locator;
    readonly roleMenuButton: (roleName: string) => Locator;
    readonly roleMenuRoot: Locator;
    readonly roleMenuEditItem: Locator;
    readonly roleMenuDeleteItem: Locator;

    readonly confirmDeleteRoleButton: Locator;

    readonly createRoleModal: CreateRoleModal;

    constructor(parent: AdminPage) {
        this.parent = parent;
        this.root = parent.root;

        this.createRoleButton = this.root.getByTestId('IS-RolesView-Create-IxButton-root');
        this.searchInput = this.root
            .getByTestId('IS-RolesView-Search-IxInput-root')
            .getByRole('textbox');

        this.rolesTable = this.root.getByTestId('IS-RolesView-DataTable-IxDataTable-root');
        this.roleRow = (roleName: string) =>
            this.rolesTable.locator('tr').filter({
                has: this.parent.parent.page.locator('td', { hasText: roleName })
            });
        this.roleMenuButton = (roleName: string) =>
            this.roleRow(roleName).getByTestId('IS-RolesView-Actions-Button-IxIconButton-root');
        this.roleMenuRoot = this.parent.parent.page.getByTestId('IS-RolesView-Actions-IxMenu-root');
        this.roleMenuEditItem = this.roleMenuRoot.getByTestId(
            'IS-RolesView-Actions-Edit-IxMenuListItem-root'
        );
        this.roleMenuDeleteItem = this.roleMenuRoot.getByTestId(
            'IS-RolesView-Actions-Delete-IxMenuListItem-root'
        );

        this.confirmDeleteRoleButton = this.parent.parent.page.getByTestId(
            'IS-RolesView-DeleteConfirm-IxModal-submit-IxButton-root'
        );

        this.createRoleModal = new CreateRoleModal(this);
    }

    public async open() {
        await this.parent.sidebar.rolesAndPermissionsTabButton.click();
    }

    public async deleteRole(roleName: string) {
        await this.roleMenuButton(roleName).click();
        await this.roleMenuDeleteItem.click();
        await this.confirmDeleteRoleButton.click();
    }
}
