import { expect, test } from 'test/fixtures/base';

test('canvas card of new entity in er data model displays a primary key', async ({
    dataBuilder,
    factories
}) => {
    const testDataModel = factories.dataModel.createErDataModel();
    const entity1 = factories.dataModel.createDataModelEntity({
        attributes: []
    });

    await dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
    await dataBuilder.workbench.explorer.dataExplorerTab.createEntity(entity1);
    await dataBuilder.workbench.canvas.toolbar.saveModelButton.click();

    await expect(
        dataBuilder.workbench.canvas.entityCard(entity1.technicalName).keyIcon
    ).toBeVisible();
});

test('can create foreign key relationship', async ({ dataBuilder, factories }) => {
    const testDataModel = factories.dataModel.createErDataModel();
    const entity1 = factories.dataModel.createDataModelEntity({
        attributes: [factories.dataModel.createDataEntityAttribute('int16')]
    });
    const entity2 = factories.dataModel.createDataModelEntity({
        attributes: [factories.dataModel.createDataEntityAttribute('int16')]
    });

    await dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
    await dataBuilder.workbench.explorer.dataExplorerTab.createEntity(entity1);
    await dataBuilder.workbench.explorer.dataExplorerTab.createEntity(entity2);

    if (
        !(await dataBuilder.workbench.explorer.dataExplorerTab.dataEntityTreeItemIsSelected(
            entity1.name
        ))
    ) {
        await dataBuilder.workbench.explorer.dataExplorerTab
            .dataEntityTreeItemLabel(entity1.name)
            .click();
    }

    const entity1IdAttributePanel =
        dataBuilder.workbench.inspector.propertiesTab.attributePanel('id');
    await entity1IdAttributePanel.panelExpansionArrowButton.click();
    await entity1IdAttributePanel.primaryKeyCheckbox.uncheck();

    const entity1OtherAttributePanel = dataBuilder.workbench.inspector.propertiesTab.attributePanel(
        entity1.attributes[0].technicalName
    );
    await entity1OtherAttributePanel.panelExpansionArrowButton.click();
    await entity1OtherAttributePanel.primaryKeyCheckbox.check();

    if (
        !(await dataBuilder.workbench.explorer.dataExplorerTab.dataEntityTreeItemIsSelected(
            entity2.name
        ))
    ) {
        await dataBuilder.workbench.explorer.dataExplorerTab
            .dataEntityTreeItemLabel(entity2.name)
            .click();
    }

    const entity2IdAttributePanel =
        dataBuilder.workbench.inspector.propertiesTab.attributePanel('id');
    await entity2IdAttributePanel.panelExpansionArrowButton.click();
    await entity2IdAttributePanel.primaryKeyCheckbox.uncheck();

    await dataBuilder.workbench.canvas.toolbar.autoLayoutButton.click();
    await dataBuilder.workbench.canvas.fitViewButton.click();

    const sourceHandle = dataBuilder.workbench.canvas
        .entityCard(entity1.technicalName)
        .connectionHandle(entity1.attributes[0].technicalName, 'left');
    const targetHandle = dataBuilder.workbench.canvas
        .entityCard(entity2.technicalName)
        .connectionHandle(entity2.attributes[0].technicalName, 'right');
    await dataBuilder.workbench.canvas.hideMinimap();
    await sourceHandle.dragTo(targetHandle);

    await dataBuilder.workbench.canvas.toolbar.saveModelButton.click();
    await dataBuilder.workbench.canvas.syncToDatabaseButton.click();

    await expect(dataBuilder.workbench.canvas.connectionLine).toBeVisible();
    await expect(
        dataBuilder.workbench.canvas.entityCard(entity1.technicalName).keyIcon
    ).toBeVisible();
    await expect(
        dataBuilder.workbench.canvas.entityCard(entity2.technicalName).keyIcon
    ).toBeVisible();
});
