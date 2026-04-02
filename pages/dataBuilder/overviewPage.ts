import { Locator, Page } from '@playwright/test';
import { DataModelsTab } from './overviewPage/dataModelsTab';
import { DataSourcesTab } from './overviewPage/dataSourcesTab';
import { Studio } from '../studio';

export class OverviewPage {
    readonly page: Page;
    readonly root: Locator;

    readonly dataModelsTab: DataModelsTab;
    readonly dataModelsTabButton: Locator;
    readonly dataSourcesTab: DataSourcesTab;
    readonly dataSourcesTabButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.locator('main .overviewContent');

        this.dataModelsTab = new DataModelsTab(this);
        this.dataModelsTabButton = page.getByTestId('DB-Overview-DatamodelsTab-IxTabButton-root');
        this.dataSourcesTab = new DataSourcesTab(this);
        this.dataSourcesTabButton = page.getByTestId('DB-Overview-DatasourcesTab-IxTabButton-root');
    }

    // TODO: Remove retry parameter once the underlying issue is fixed
    // https://intrexx.atlassian.net/browse/IX25-5144
    // TODO: Replace the content of this method with a simple goto()
    // once the playwright/firefox issue is fixed:
    // https://github.com/microsoft/playwright/issues/20749
    public async open({ retry = true }: { retry?: boolean } = { retry: true }) {
        const studio = new Studio(this.page);
        await studio.navRail.dataButton.click();
        if (retry && !(await this.root.isVisible())) {
            await studio.page.reload();
            await studio.navRail.dataButton.waitFor({ state: 'visible' });
            await studio.navRail.dataButton.click();
            await this.root.waitFor({ state: 'visible' });
        }
    }
}
