import { expect, test } from 'test/fixtures/base';

test.describe('ER: Entities CRUD operations', () => {
    test('can create entities with attributes', async ({ dataBuilder, factories }) => {
        const testDataModel = factories.dataModel.createErDataModel();
        await dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
        await dataBuilder.workbench.exit();
        await dataBuilder.overview.dataModelsTab.search(testDataModel.name);
        await dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.technicalName).open();

        const entity1 = factories.dataModel.createDataModelEntity({
            attributes: [
                factories.dataModel.createDataEntityAttribute('char'),
                factories.dataModel.createDataEntityAttribute('varchar'),
                factories.dataModel.createDataEntityAttribute('text'),
                factories.dataModel.createDataEntityAttribute('int16', {}),
                factories.dataModel.createDataEntityAttribute('int32'),
                factories.dataModel.createDataEntityAttribute('int64'),
                factories.dataModel.createDataEntityAttribute('decimal'),
                factories.dataModel.createDataEntityAttribute('real')
            ]
        });

        const entity2 = factories.dataModel.createDataModelEntity({
            attributes: [
                factories.dataModel.createDataEntityAttribute('double'),
                factories.dataModel.createDataEntityAttribute('date'),
                factories.dataModel.createDataEntityAttribute('time'),
                factories.dataModel.createDataEntityAttribute('timestamp'),
                factories.dataModel.createDataEntityAttribute('boolean', {}),
                factories.dataModel.createDataEntityAttribute('binary'),
                factories.dataModel.createDataEntityAttribute('uniqueidentifier'),
                factories.dataModel.createDataEntityAttribute('file')
            ]
        });

        await dataBuilder.workbench.explorer.dataExplorerTab.createEntity(entity1);
        await dataBuilder.workbench.explorer.dataExplorerTab.createEntity(entity2);
        await dataBuilder.workbench.canvas.toolbar.saveModelButton.click();

        for (const entity of [entity1, entity2]) {
            if (
                !(await dataBuilder.workbench.explorer.dataExplorerTab.dataEntityTreeItemIsSelected(
                    entity.name
                ))
            ) {
                await dataBuilder.workbench.explorer.dataExplorerTab
                    .dataEntityTreeItemLabel(entity.name)
                    .click();
            }
            expect(
                await dataBuilder.workbench.inspector.propertiesTab.attributePanels.count()
            ).toBe(entity.attributes.length + 1); // +1 for the ID
        }
    });

    test('can update entity attribute name and type', async ({ dataBuilder, factories }) => {
        const testDataModel = factories.dataModel.createErDataModel();

        await dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
        await dataBuilder.workbench.exit();
        await dataBuilder.overview.dataModelsTab.search(testDataModel.name);
        await dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.technicalName).open();

        const entity = factories.dataModel.createDataModelEntity({
            attributes: [factories.dataModel.createDataEntityAttribute('int32')]
        });
        await dataBuilder.workbench.explorer.dataExplorerTab.createEntity(entity);
        await dataBuilder.workbench.canvas.toolbar.saveModelButton.click();

        if (
            !(await dataBuilder.workbench.explorer.dataExplorerTab.dataEntityTreeItemIsSelected(
                entity.name
            ))
        ) {
            await dataBuilder.workbench.explorer.dataExplorerTab
                .dataEntityTreeItemLabel(entity.name)
                .click();
        }

        await dataBuilder.workbench.inspector.propertiesTab
            .attributePanel(entity.attributes[0].technicalName)
            .nameInput.fill('new name');
        await dataBuilder.workbench.inspector.propertiesTab
            .attributePanel(entity.attributes[0].technicalName)
            .panelExpansionArrowButton.click();
        await dataBuilder.workbench.inspector.propertiesTab
            .attributePanel(entity.attributes[0].technicalName)
            .selectDataType('time');

        await dataBuilder.workbench.canvas.syncToDatabaseButton.click();
        await expect(
            dataBuilder.workbench.notification('ER Model synced to database')
        ).toBeVisible();

        if (
            !(await dataBuilder.workbench.explorer.dataExplorerTab.dataEntityTreeItemIsSelected(
                entity.name
            ))
        ) {
            await dataBuilder.workbench.explorer.dataExplorerTab
                .dataEntityTreeItemLabel(entity.name)
                .click();
        }
        expect(
            await dataBuilder.workbench.inspector.propertiesTab
                .attributePanel(entity.attributes[0].technicalName)
                .nameInput.inputValue()
        ).toBe('new name');
    });

    test('can delete entity', async ({ dataBuilder, factories }) => {
        const testDataModel = factories.dataModel.createErDataModel();
        const entity1 = factories.dataModel.createDataModelEntity({
            attributes: [
                factories.dataModel.createDataEntityAttribute('int32'),
                factories.dataModel.createDataEntityAttribute('varchar')
            ]
        });

        await dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
        await dataBuilder.workbench.explorer.dataExplorerTab.createEntity(entity1);
        await dataBuilder.workbench.canvas.toolbar.autoLayoutButton.click();

        await dataBuilder.workbench.canvas.toolbar.saveModelButton.click();

        await dataBuilder.workbench.explorer.dataExplorerTab.deleteEntity(entity1.name);

        await expect(
            dataBuilder.workbench.explorer.dataExplorerTab.dataEntityTreeItem(entity1.name)
        ).not.toBeVisible();
    });
});
