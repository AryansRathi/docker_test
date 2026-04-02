import { expect, test } from 'test/fixtures/base';

test.describe('Search on overview page', () => {
    test('has no search results with search for bad UUID', async ({ dataBuilder, factories }) => {
        const testDataModel = factories.dataModel.createErDataModel();

        await dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
        await dataBuilder.workbench.exit();

        await dataBuilder.overview.dataModelsTab.search('00000000-0000-0000-0000-000000000000');

        expect(await dataBuilder.overview.dataModelsTab.getDataModelCards()).toHaveLength(0);
    });
});
