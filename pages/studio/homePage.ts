import type { Locator } from '@playwright/test';
import { Studio } from 'pages/studio';

export class HomePage {
    readonly parent: Studio;
    readonly root: Locator;

    readonly title: Locator;
    readonly createAppQuickActionButton: Locator;
    readonly createProcessQuickActionButton: Locator;
    readonly createDataModelQuickActionButton: Locator;

    constructor(parent: Studio) {
        this.parent = parent;
        this.root = parent.root.locator('main.v-main');

        this.title = this.root.locator('h1.title');
        this.createAppQuickActionButton = this.root.getByTestId(
            'IS-Home-List-QuickActions-Card-ix:apps_outline'
        );
        this.createProcessQuickActionButton = this.root.getByTestId(
            'IS-Home-List-QuickActions-Card-ix:processes_outline'
        );
        this.createDataModelQuickActionButton = this.root.getByTestId(
            'IS-Home-List-QuickActions-Card-ix:data_outline'
        );
    }

    public async open() {
        await this.parent.navRail.homeButton.click();
    }
}
