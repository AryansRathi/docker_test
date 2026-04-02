import { expect, test } from 'test/fixtures/base';

test.describe('Queries on external data source', () => {
    test('create and execute query on external data source', async ({
        dataBuilder,
        factories,
        externalPostgresDataSource,
        externalPostgres
    }) => {
        const testTableName = factories.primitives.createWord();
        const testRecord1 = {
            name: factories.primitives.createName(),
            email: factories.primitives.createEmail()
        };
        const testRecord2 = {
            name: factories.primitives.createName(),
            email: factories.primitives.createEmail()
        };

        await externalPostgres.createTable(testTableName, [
            { name: 'id', type: 'SERIAL PRIMARY KEY' },
            { name: 'name', type: 'VARCHAR(255) NOT NULL' },
            { name: 'email', type: 'VARCHAR(255) UNIQUE' }
        ]);
        await externalPostgres.insertRows(testTableName, [testRecord1, testRecord2]);

        await dataBuilder.overview.dataModelsTabButton.click();

        const testDataModel = factories.dataModel.createErDataModel();
        await dataBuilder.overview.dataModelsTab.importFromDatabase({
            dataModel: testDataModel,
            dataSource: externalPostgresDataSource,
            tableNames: [testTableName]
        });

        await dataBuilder.workbench.inspector.queriesTab.open();
        await dataBuilder.workbench.inspector.queriesTab.createQuery({
            name: 'Test query',
            technicalName: 'test-query',
            dataEntityName: testTableName,
            attributeNames: ['id', 'name', 'email']
        });

        await dataBuilder.workbench.inspector.queriesTab.queryCard('test-query').click();
        await dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
        await dataBuilder.workbench.inspector.previewModal.executeButton.click();
        await dataBuilder.workbench.inspector.previewModal.setItemsPerPage('All');

        await expect(
            dataBuilder.workbench.inspector.previewModal.resultsTableRow(testRecord1.email)
        ).toBeVisible();
        await expect(
            dataBuilder.workbench.inspector.previewModal.resultsTableRow(testRecord2.email)
        ).toBeVisible();
    });
});
