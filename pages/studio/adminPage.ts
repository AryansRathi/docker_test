import type { Locator } from '@playwright/test';
import { TenantSettingsTab } from './adminPage/tenantSettingsTab';
import { UsersTab } from './adminPage/usersTab';
import { GroupsTab } from './adminPage/groupsTab';
import { RolesAndPermissionsTab } from './adminPage/rolesAndPermissionsTab';
import { CredentialsTab } from './adminPage/credentialsTab';
import { TaskManagementTab } from './adminPage/taskManagementTab';
import { AuthenticationTab } from './adminPage/authenticationTab';
import { Studio } from 'pages/studio';
import { AdminPageSidebar } from './adminPage/sidebar';
import { ApiKeysTab } from './adminPage/apiKeysTab';

export class AdminPage {
    readonly parent: Studio;
    readonly root: Locator;

    readonly sidebar: AdminPageSidebar;

    readonly tenantSettingsTab: TenantSettingsTab;
    readonly usersTab: UsersTab;
    readonly groupsTab: GroupsTab;
    readonly rolesAndPermissionsTab: RolesAndPermissionsTab;
    readonly credentialsTab: CredentialsTab;
    readonly apiKeysTab: ApiKeysTab;
    readonly taskManagementTab: TaskManagementTab;
    readonly authenticationTab: AuthenticationTab;

    constructor(parent: Studio) {
        this.parent = parent;
        this.root = parent.root.locator('main.v-main');

        this.sidebar = new AdminPageSidebar(this);

        this.tenantSettingsTab = new TenantSettingsTab(this);
        this.usersTab = new UsersTab(this);
        this.groupsTab = new GroupsTab(this);
        this.rolesAndPermissionsTab = new RolesAndPermissionsTab(this);
        this.credentialsTab = new CredentialsTab(this);
        this.apiKeysTab = new ApiKeysTab(this);
        this.taskManagementTab = new TaskManagementTab(this);
        this.authenticationTab = new AuthenticationTab(this);
    }

    public async open() {
        await this.parent.navRail.adminButton.click();
    }
}
