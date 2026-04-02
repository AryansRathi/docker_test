import { factories } from 'test/factories/factories';
import { expect, test } from 'test/fixtures/base';

test.describe('Internal data sources CRUD operations', () => {
    test('can insert data', async ({ dataBuilder }) => {
        const testDataModel = factories.dataModel.createErDataModel();
        const personsEntity = factories.dataModel.createDataModelEntity({
            name: 'persons',
            technicalName: 'persons',
            description: 'Persons entity',
            attributes: [
                factories.dataModel.createDataEntityAttribute('varchar', {
                    name: 'name',
                    technicalName: 'name'
                }),
                factories.dataModel.createDataEntityAttribute('varchar', {
                    name: 'email',
                    technicalName: 'email'
                }),
                factories.dataModel.createDataEntityAttribute('varchar', {
                    name: 'phone',
                    technicalName: 'phone'
                })
            ]
        });

        await dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
        await dataBuilder.workbench.explorer.dataExplorerTab.createEntity(personsEntity);

        await dataBuilder.workbench.canvas.syncToDatabaseButton.click();
        await expect(dataBuilder.workbench.canvas.databaseSyncStatusChip).toContainText(
            'Fully synced'
        );

        const insertData = {
            name: factories.primitives.createName(),
            email: factories.primitives.createEmail(),
            phone: factories.primitives
                .createInteger({ min: 1000000000, max: 9999999999 })
                .toString()
        };

        await dataBuilder.workbench.inspector.commandsTab.open();
        await dataBuilder.workbench.inspector.commandsTab.createCommand({
            commandType: 'INSERT',
            name: 'Insert persons',
            technicalName: 'insert-persons',
            dataEntityName: 'persons',
            attributeNames: ['name', 'email', 'phone']
        });

        await dataBuilder.workbench.inspector.commandsTab.executeCommandWithPreviewModal(
            'insert-persons',
            insertData
        );

        await dataBuilder.workbench.inspector.queriesTab.open();
        await dataBuilder.workbench.inspector.queriesTab.createQuery({
            name: 'Select persons',
            technicalName: 'select-persons',
            dataEntityName: 'persons',
            attributeNames: ['name', 'email', 'phone']
        });

        await dataBuilder.workbench.inspector.queriesTab.queryCard('select-persons').click();
        await dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
        await dataBuilder.workbench.inspector.previewModal.executeButton.click();

        const relevantResultsTableRow =
            dataBuilder.workbench.inspector.previewModal.resultsTableRow(insertData.email);
        await expect(relevantResultsTableRow).toBeVisible();
        await expect(relevantResultsTableRow).toContainText(insertData.name);
        await expect(relevantResultsTableRow).toContainText(insertData.email);
        await expect(relevantResultsTableRow).toContainText(insertData.phone);
    });
});
