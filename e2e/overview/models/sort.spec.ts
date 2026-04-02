import { type TestErDataModel } from 'test/factories/dataModelFactory';
import { test, expect, type Locator } from 'test/fixtures/base';
import type { DataBuilder } from 'test/pages/dataBuilder';

test.describe.serial('Data Model Sorting Tests', () => {
    const testDataModels: TestErDataModel[] = [];

    test('setup: create data models', async ({ dataBuilder, factories }) => {
        for (let i = 0; i < 4; i++) {
            const testDataModel = factories.dataModel.createErDataModel();
            testDataModels.push(testDataModel);
            await dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
            await dataBuilder.workbench.exit();
        }
    });

    const getNonFavoriteCards = async (dataBuilder: DataBuilder): Promise<Locator[]> => {
        const cards = await dataBuilder.overview.dataModelsTab.root.locator('.v-card').all();
        const result: Locator[] = [];
        for (const card of cards) {
            const isFavorite = (
                await card.locator('i[icon="star"]').getAttribute('class')
            )?.includes('material-symbols-filled');
            if (!isFavorite) result.push(card);
        }
        return result;
    };

    const getCardValues = async (
        dataBuilder: DataBuilder,
        locatorFn: (card: Locator) => Locator
    ): Promise<string[]> => {
        const cards = await getNonFavoriteCards(dataBuilder);
        return Promise.all(
            cards.map(async (c) => (await locatorFn(c).textContent())?.trim() ?? '')
        );
    };

    const getNames = (dataBuilder: DataBuilder) =>
        getCardValues(dataBuilder, (c) => c.locator('[data-testid$="IxOverviewCard-Title"]'));

    const getUpdatedDates = async (dataBuilder: DataBuilder): Promise<Date[]> =>
        (
            await getCardValues(dataBuilder, (c) =>
                c.locator('[data-testid$="IxOverviewCard-LastUpdated"]')
            )
        ).map((d) => new Date(d));

    const getCreatedDates = async (dataBuilder: DataBuilder): Promise<Date[]> =>
        (
            await getCardValues(dataBuilder, (c) =>
                c.locator('[data-testid$="IxOverviewCard-Created"]')
            )
        ).map((d) => new Date(d));

    test('sort A-Z', async ({ dataBuilder }) => {
        await dataBuilder.overview.dataModelsTab.sortByNameAscending();
        const names = await getNames(dataBuilder);
        expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    });

    test('sort Z-A', async ({ dataBuilder }) => {
        await dataBuilder.overview.dataModelsTab.sortByNameDescending();
        const names = await getNames(dataBuilder);
        expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
    });

    test('sort by Created (Newest)', async ({ dataBuilder }) => {
        await dataBuilder.overview.dataModelsTab.sortByCreatedNewest();
        const dates = await getCreatedDates(dataBuilder);
        expect(dates).toEqual([...dates].sort((a, b) => b.getTime() - a.getTime()));
    });

    test('sort by Created (Oldest)', async ({ dataBuilder }) => {
        await dataBuilder.overview.dataModelsTab.sortByCreatedOldest();
        const dates = await getCreatedDates(dataBuilder);
        expect(dates).toEqual([...dates].sort((a, b) => a.getTime() - b.getTime()));
    });

    test('sort by Last Updated (Newest)', async ({ dataBuilder }) => {
        await dataBuilder.overview.dataModelsTab.sortByUpdatedNewest();
        const dates = await getUpdatedDates(dataBuilder);
        expect(dates).toEqual([...dates].sort((a, b) => b.getTime() - a.getTime()));
    });

    test('sort by Last Updated (Oldest)', async ({ dataBuilder }) => {
        await dataBuilder.overview.dataModelsTab.sortByUpdatedOldest();
        const dates = await getUpdatedDates(dataBuilder);
        expect(dates).toEqual([...dates].sort((a, b) => a.getTime() - b.getTime()));
    });
});
