import { TestErDataModel } from 'test/factories/dataModelFactory';
import { expect, test } from 'test/fixtures/base';

test.describe('External mssql data source CRUD operations', () => {
    let testTableName: string;
    let testRecord: { name: string; email: string };
    let testDataModel: TestErDataModel;

    test.beforeEach(
        'setup: external database, data model and query',
        async ({ dataBuilder, factories, externalMssqlDataSource, externalMssql }) => {
            testTableName = factories.primitives.createWord();
            testRecord = {
                name: factories.primitives.createName(),
                email: factories.primitives.createEmail()
            };

            await externalMssql.createTable(testTableName, [
                { name: 'id', type: 'INT IDENTITY(1,1) PRIMARY KEY' },
                { name: 'name', type: 'NVARCHAR(255) NOT NULL' },
                { name: 'email', type: 'NVARCHAR(255) NOT NULL' }
            ]);
            await externalMssql.insertRows(testTableName, [testRecord]);

            testDataModel = factories.dataModel.createErDataModel();
            await dataBuilder.overview.dataModelsTab.importFromDatabase({
                dataModel: testDataModel,
                dataSource: externalMssqlDataSource,
                tableNames: [testTableName]
            });

            await dataBuilder.workbench.inspector.queriesTab.open();
            await dataBuilder.workbench.inspector.queriesTab.createQuery({
                name: 'My select query',
                technicalName: 'my-select-query',
                dataEntityName: testTableName,
                attributeNames: ['id', 'name', 'email']
            });
        }
    );

    test('can insert data', async ({ dataBuilder, factories }) => {
        const newRecord = {
            name: factories.primitives.createName(),
            email: factories.primitives.createEmail()
        };

        await dataBuilder.workbench.inspector.commandsTab.open();
        await dataBuilder.workbench.inspector.commandsTab.createCommand({
            commandType: 'INSERT',
            name: 'My insert command',
            technicalName: 'my-insert-command',
            dataEntityName: testTableName,
            attributeNames: ['name', 'email']
        });

        await dataBuilder.workbench.inspector.commandsTab.executeCommandWithPreviewModal(
            'my-insert-command',
            newRecord
        );

        await dataBuilder.workbench.inspector.queriesTab.open();
        await dataBuilder.workbench.inspector.queriesTab.queryCard('my-select-query').click();
        await dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
        await dataBuilder.workbench.inspector.previewModal.executeButton.click();

        const relevantResultsTableRow =
            dataBuilder.workbench.inspector.previewModal.resultsTableRow(newRecord.email);
        await expect(relevantResultsTableRow).toContainText(newRecord.name);
        await expect(relevantResultsTableRow).toContainText(newRecord.email);
    });

    test('can update data', async ({ dataBuilder, factories }) => {
        const updatedRecord = {
            name: factories.primitives.createName(),
            email: factories.primitives.createEmail()
        };

        await dataBuilder.workbench.inspector.commandsTab.open();
        await dataBuilder.workbench.inspector.commandsTab.createCommand({
            commandType: 'UPDATE',
            name: 'My update command',
            technicalName: 'my-update-command',
            dataEntityName: testTableName,
            attributeNames: ['name', 'email'],
            conditions: [
                {
                    entityName: testTableName,
                    attributeName: 'email',
                    operator: 'Equal',
                    value: testRecord.email,
                    technicalName: 'initial-email-condition'
                }
            ]
        });

        await dataBuilder.workbench.inspector.commandsTab.executeCommandWithPreviewModal(
            'my-update-command',
            updatedRecord
        );

        await dataBuilder.workbench.inspector.queriesTab.open();
        await dataBuilder.workbench.inspector.queriesTab.queryCard('my-select-query').click();
        await dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
        await dataBuilder.workbench.inspector.previewModal.executeButton.click();
        await dataBuilder.workbench.inspector.previewModal.setItemsPerPage('All');

        const relevantResultsTableRow =
            dataBuilder.workbench.inspector.previewModal.resultsTableRow(updatedRecord.email);
        await expect(relevantResultsTableRow).toContainText(updatedRecord.name);
        await expect(relevantResultsTableRow).toContainText(updatedRecord.email);
        await expect(dataBuilder.workbench.inspector.previewModal.resultsTable).not.toContainText(
            testRecord.name
        );
        await expect(dataBuilder.workbench.inspector.previewModal.resultsTable).not.toContainText(
            testRecord.email
        );
    });

    test('can delete data', async ({ dataBuilder }) => {
        await dataBuilder.workbench.inspector.commandsTab.open();
        await dataBuilder.workbench.inspector.commandsTab.createCommand({
            commandType: 'DELETE',
            name: 'My delete command',
            technicalName: 'my-delete-command',
            dataEntityName: testTableName,
            conditions: [
                {
                    entityName: testTableName,
                    attributeName: 'email',
                    operator: 'Equal',
                    value: testRecord.email,
                    technicalName: 'initial-email-condition'
                }
            ]
        });

        await dataBuilder.workbench.inspector.commandsTab.executeCommandWithPreviewModal(
            'my-delete-command'
        );

        await dataBuilder.workbench.inspector.queriesTab.open();
        await dataBuilder.workbench.inspector.queriesTab.queryCard('my-select-query').click();
        await dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
        await dataBuilder.workbench.inspector.previewModal.executeButton.click();

        await expect(
            dataBuilder.workbench.inspector.previewModal.resultsTableRow(testRecord.email)
        ).not.toBeVisible();
        await expect(dataBuilder.workbench.inspector.previewModal.resultsTable).not.toBeVisible();
    });
});
