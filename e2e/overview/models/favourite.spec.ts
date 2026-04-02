import { expect, test } from 'test/fixtures/base';
import { type TestErDataModel } from 'test/factories/dataModelFactory';

test.describe('Favorite data models', () => {
    test('are on top of the overview page list', async ({ dataBuilder, factories }) => {
        const firstDataModel: TestErDataModel = factories.dataModel.createErDataModel();
        const secondDataModel: TestErDataModel = factories.dataModel.createErDataModel();

        await dataBuilder.overview.dataModelsTab.createErDataModel(firstDataModel);
        await dataBuilder.workbench.exit();

        await dataBuilder.overview.dataModelsTab.createErDataModel(secondDataModel);
        await dataBuilder.workbench.exit();

        const modelToFavorite = firstDataModel;

        // Favorite the model
        await dataBuilder.overview.dataModelsTab.search(modelToFavorite.name);
        expect(
            await dataBuilder.overview.dataModelsTab
                .dataModelCard(modelToFavorite.technicalName)
                .isFavorite()
        ).toBe(false);
        await dataBuilder.overview.dataModelsTab
            .dataModelCard(modelToFavorite.technicalName)
            .favoriteButton.click();
        await dataBuilder.overview.dataModelsTab.clearSearchButton.click();

        let seenNonFavoriteModel = false;
        for (const card of await dataBuilder.overview.dataModelsTab.getDataModelCards()) {
            if (await card.isFavorite()) {
                expect(seenNonFavoriteModel, `Favorited Model appeared after a non-favorited`).toBe(
                    false
                );
            } else {
                seenNonFavoriteModel = true;
            }

            if (card.technicalName === modelToFavorite.technicalName) {
                expect(await card.isFavorite()).toBe(true);
            }

            if (card.technicalName === secondDataModel.technicalName) {
                expect(await card.isFavorite()).toBe(false);
            }
        }
    });
});
