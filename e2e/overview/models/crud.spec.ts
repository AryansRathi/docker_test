import { expect, test } from 'test/fixtures/base';
import { type TestErDataModel } from 'test/factories/dataModelFactory';

test.describe('CRUD Operations', () => {
    test('can create data model', async ({ dataBuilder, factories }) => {
        const testDataModel: TestErDataModel = factories.dataModel.createErDataModel();

        await dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
        await dataBuilder.workbench.exit();

        await dataBuilder.overview.dataModelsTab.search(testDataModel.name);
        
        console.warn(await dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.name));
        await dataBuilder.page.pause();
        await expect(
            dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.name).root
        ).toBeVisible();
    });

    test('can delete data model', async ({ dataBuilder, factories }) => {
        const testDataModel: TestErDataModel = factories.dataModel.createErDataModel();

        await dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
        await dataBuilder.workbench.exit();

        await dataBuilder.overview.dataModelsTab.search(testDataModel.name);

        await dataBuilder.overview.dataModelsTab
            .dataModelCard(testDataModel.technicalName)
            .menuButton.click();
        await dataBuilder.overview.dataModelsTab
            .dataModelCard(testDataModel.technicalName)
            .menuItem('Delete')
            .click();
        await dataBuilder.overview.dataModelsTab
            .dataModelCard(testDataModel.technicalName)
            .confirmDeleteButton.click();

        await expect(
            dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.technicalName).root
        ).not.toBeVisible();

        if (await dataBuilder.overview.dataModelsTab.searchInput.isVisible()) {
            await dataBuilder.overview.dataModelsTab.clearSearchButton.click();
            await dataBuilder.overview.dataModelsTab.search(testDataModel.name);

            await expect(
                dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.technicalName).root
            ).not.toBeVisible();
        }
    });

    test('can rename a data model', async ({ dataBuilder, factories }) => {
        const testDataModel: TestErDataModel = factories.dataModel.createErDataModel();
        const newModelName = `${testDataModel.name.replace('Model', '').trim()} renamed`;

        await dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
        await dataBuilder.workbench.exit();

        await dataBuilder.overview.dataModelsTab.search(testDataModel.name);

        await dataBuilder.overview.dataModelsTab
            .dataModelCard(testDataModel.technicalName)
            .menuButton.click();
        await dataBuilder.overview.dataModelsTab
            .dataModelCard(testDataModel.technicalName)
            .menuItem('Rename')
            .click();
        await dataBuilder.overview.dataModelsTab.renameDataModelModal.renameModel(newModelName);

        await dataBuilder.overview.dataModelsTab.clearSearchButton.click();
        await dataBuilder.overview.dataModelsTab.search(newModelName);

        await expect(
            dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.technicalName).root
        ).toBeVisible();
        await expect(
            dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.technicalName).name
        ).toHaveText(newModelName);
    });

    test('updated date changes after edit', async ({ dataBuilder, factories }) => {
        const testDataModel = factories.dataModel.createErDataModel();

        await dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
        await dataBuilder.workbench.exit();

        await dataBuilder.overview.dataModelsTab.search(testDataModel.name);
        const dateBefore = new Date(
            await dataBuilder.overview.dataModelsTab
                .dataModelCard(testDataModel.technicalName)
                .lastUpdated.innerText()
        );

        await dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.technicalName).open();
        await dataBuilder.workbench.explorer.dataExplorerTab.createEntity(
            factories.dataModel.createDataModelEntity()
        );
        await dataBuilder.workbench.canvas.toolbar.saveModelButton.click();
        await dataBuilder.workbench.exit();

        await dataBuilder.overview.dataModelsTab.search(testDataModel.name);
        const dateAfter = new Date(
            await dataBuilder.overview.dataModelsTab
                .dataModelCard(testDataModel.technicalName)
                .lastUpdated.innerText()
        );

        expect(dateAfter.getTime()).toBeGreaterThan(dateBefore.getTime());
    });
});
