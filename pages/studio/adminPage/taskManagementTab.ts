import type { Locator } from '@playwright/test';
import { AdminPage } from '../adminPage';

export class TaskManagementTab {
    readonly parent: AdminPage;
    readonly root: Locator;

    readonly searchInput: Locator;

    constructor(parent: AdminPage) {
        this.parent = parent;
        this.root = parent.root;

        this.searchInput = this.root
            .getByTestId('IS-TaskManagementView-Search-IxInput-root')
            .getByRole('textbox');
    }

    public async open() {
        await this.parent.sidebar.taskManagementTabButton.click();
    }
}
