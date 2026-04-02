import type { Locator } from '@playwright/test';
import { MyFilesTab } from './filesPage/myFilesTab';
import { AllFilesTab } from './filesPage/allFilesTab';
import { Studio } from 'pages/studio';

export class FilesPage {
    readonly parent: Studio;
    readonly root: Locator;

    readonly sidebar: Locator;
    readonly allFilesTabButton: Locator;
    readonly myFilesTabButton: Locator;

    readonly allFilesTab: AllFilesTab;
    readonly myFilesTab: MyFilesTab;

    constructor(parent: Studio) {
        this.parent = parent;
        this.root = parent.root.locator('main.v-main');

        this.sidebar = this.root.getByTestId('IS-FileStorage-NavigationRail-List-IxList-root');
        this.allFilesTabButton = this.sidebar.getByTestId(
            'IS-FileStorage-NavigationRail-all-IxListItem-root'
        );
        this.myFilesTabButton = this.sidebar.getByTestId(
            'IS-FileStorage-NavigationRail-my-IxListItem-root'
        );

        this.allFilesTab = new AllFilesTab(this);
        this.myFilesTab = new MyFilesTab(this);
    }

    public async open() {
        await this.parent.navRail.filesButton.click();
    }
}
