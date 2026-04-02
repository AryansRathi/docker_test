import { expect, test } from 'test/fixtures/base';

test('has create data source button', async ({ dataBuilder }) => {
    await dataBuilder.overview.dataSourcesTabButton.click();

    await expect(dataBuilder.overview.dataSourcesTab.createDataSourceButton).toBeVisible();
    await expect(dataBuilder.overview.dataSourcesTab.createDataSourceButton).toHaveText(
        /Create Data Source/
    );
});
