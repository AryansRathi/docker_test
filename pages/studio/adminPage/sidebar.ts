import type { Locator } from '@playwright/test';
import { AdminPage } from '../adminPage';

export class AdminPageSidebar {
    readonly parent: AdminPage;
    readonly root: Locator;

    readonly tenantSettingsTabButton: Locator;
    readonly usersTabButton: Locator;
    readonly groupsTabButton: Locator;
    readonly rolesAndPermissionsTabButton: Locator;
    readonly credentialsTabButton: Locator;
    readonly apiKeysTabButton: Locator;
    readonly taskManagementTabButton: Locator;
    readonly authenticationTabButton: Locator;
    readonly colorsTabButton: Locator;

    constructor(parent: AdminPage) {
        this.parent = parent;
        this.root = parent.root.getByTestId('IS-Admin-NavigationRail-IxNavigationRail-root');

        this.tenantSettingsTabButton = this.root.getByTestId(
            'IS-Admin-NavigationRail-tenantmgmt-IxListItem-root'
        );
        this.usersTabButton = this.root.getByTestId(
            'IS-Admin-NavigationRail-IdentityMgmt-undefined-IxListItem-root'
        );
        this.groupsTabButton = this.root.getByTestId(
            'IS-Admin-NavigationRail-IdentityMgmt-groupmgmt-IxListItem-root'
        );
        this.rolesAndPermissionsTabButton = this.root.getByTestId(
            'IS-Admin-NavigationRail-IdentityMgmt-rolemgmt-IxListItem-root'
        );
        this.credentialsTabButton = this.root.getByTestId(
            'IS-Admin-NavigationRail-IdentityMgmt-credentialsmgmt-IxListItem-root'
        );
        this.apiKeysTabButton = this.root.getByTestId(
            'IS-Admin-NavigationRail-IdentityMgmt-apikeymgmnt-IxListItem-root'
        );
        this.taskManagementTabButton = this.root.getByTestId(
            'IS-Admin-NavigationRail-IdentityMgmt-taskmgmt-IxListItem-root'
        );
        this.authenticationTabButton = this.root.getByTestId(
            'IS-Admin-NavigationRail-IdentityMgmt-settings-IxListItem-root'
        );
        this.colorsTabButton = this.root.getByTestId(
            'IS-Admin-NavigationRail-ThemingBranding-colors-IxListItem-root'
        );
    }
}
