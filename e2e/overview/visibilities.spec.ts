import { expect, test } from 'test/fixtures/base';

test('has title', async ({ dataBuilder }) => {
    await expect(dataBuilder.overview.page).toHaveTitle('Intrexx Studio', {
        timeout: 20000
    });
});

test('has overview page', async ({ dataBuilder }) => {
    await expect(dataBuilder.overview.root).toBeVisible({
        timeout: 20000
    });
});

test('has data models tab', async ({ dataBuilder }) => {
    await expect(dataBuilder.overview.dataModelsTabButton).toBeVisible({
        timeout: 20000
    });
});

test('has data sources tab', async ({ dataBuilder }) => {
    await expect(dataBuilder.overview.dataSourcesTabButton).toBeVisible({
        timeout: 20000
    });
});
