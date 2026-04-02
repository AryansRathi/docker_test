import { expect, test } from 'test/fixtures/base';

test('can create rest data model', async ({ dataBuilder, factories }) => {
    const testDataModel = factories.dataModel.createRestDataModel();

    await dataBuilder.overview.dataModelsTab.createRestDataModel(testDataModel);
    await dataBuilder.workbench.exit();

    await dataBuilder.overview.dataModelsTab.search(testDataModel.name);

    await expect(
        dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.technicalName).typeChip
    ).toContainText('REST');
    await expect(
        dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.technicalName).root
    ).toBeVisible();
});
