import type { Locator } from '@playwright/test';
import { FilesPage } from '../filesPage';

export class MyFilesTab {
    readonly parent: FilesPage;
    readonly root: Locator;

    constructor(parent: FilesPage) {
        this.parent = parent;
        this.root = parent.root;
    }

    public async open() {
        await this.parent.myFilesTabButton.click();
    }
}
