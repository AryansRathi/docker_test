import { expect, test } from 'test/fixtures/base';

test('has create data model button', async ({ dataBuilder }) => {
    await expect(dataBuilder.overview.dataModelsTab.createDataModelButton).toBeVisible();

    await expect(dataBuilder.overview.dataModelsTab.createDataModelButton).toContainText(
        'Create Data Model'
    );
});

test('has import buttons', async ({ dataBuilder }) => {
    await expect(dataBuilder.overview.dataModelsTab.importSplitButton).toBeVisible();

    await dataBuilder.overview.dataModelsTab.importSplitButton.click();
    await expect(dataBuilder.overview.dataModelsTab.importFromExportMenuItem).toBeVisible();
    await expect(dataBuilder.overview.dataModelsTab.importFromDatabaseMenuItem).toBeVisible();
});

test.describe('View modes on overview page', () => {
    test('grid view displays data models', async ({ dataBuilder, factories }) => {
        const testDataModel = factories.dataModel.createErDataModel();

        await dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
        await dataBuilder.workbench.exit();

        await dataBuilder.overview.dataModelsTab.gridViewButton.click();

        await dataBuilder.overview.dataModelsTab.search(testDataModel.name);

        await expect(
            dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.technicalName).root
        ).toBeVisible();
    });
});
