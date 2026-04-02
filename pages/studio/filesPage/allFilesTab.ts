import type { Locator } from '@playwright/test';
import { FilesPage } from '../filesPage';

export class AllFilesTab {
    readonly parent: FilesPage;
    readonly root: Locator;

    readonly searchInput: Locator;

    constructor(parent: FilesPage) {
        this.parent = parent;
        this.root = parent.root;

        this.searchInput = this.root
            .getByTestId('IS-AllFiles-Search-IxInput-root')
            .getByRole('textbox');
    }

    public async open() {
        await this.parent.allFilesTabButton.click();
    }
}
