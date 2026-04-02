import { Locator, Page } from '@playwright/test';
import { HomePage } from './studio/homePage';
import { TasksPage } from './studio/tasksPage';
import { FilesPage } from './studio/filesPage';
import { AdminPage } from './studio/adminPage';
import { UserMenu } from './studio/userMenu';
import { LoginPage } from './studio/loginPage';
import { NavRail } from './studio/navRail';

export class Studio {
    readonly page: Page;
    readonly root: Locator;

    readonly navRail: NavRail;

    readonly homePage: HomePage;
    readonly tasksPage: TasksPage;
    readonly filesPage: FilesPage;
    readonly adminPage: AdminPage;
    readonly userMenu: UserMenu;
    readonly loginPage: LoginPage;

    readonly portalButton: Locator;
    readonly userMenuButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.locator('div#app');

        this.navRail = new NavRail(this);

        this.homePage = new HomePage(this);
        this.tasksPage = new TasksPage(this);
        this.filesPage = new FilesPage(this);
        this.adminPage = new AdminPage(this);
        this.userMenu = new UserMenu(this);
        this.loginPage = new LoginPage(page);

        this.portalButton = this.root.getByTestId('IS-StudioLayout-Portal-IxIconButton-root');
        this.userMenuButton = this.root.getByTestId('IS-StudioProfile-Profile-Avatar');
    }

    public async open() {
        await this.page.goto('/');
    }
}
