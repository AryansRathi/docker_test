import { factories } from 'test/factories/factories';
import { expect, test } from 'test/fixtures/base';

test.skip('can sync draft to test and then to prod', async ({ dataBuilder }) => {
    test.slow();

    const testDataModel = factories.dataModel.createErDataModel();

    await dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);

    const normalizedTestDataModelName = testDataModel.technicalName.replace(/\s/g, '-');

    await dataBuilder.workbench.exit();

    await dataBuilder.overview.dataModelsTab.search(testDataModel.name);
    await dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.technicalName).open();

    const personsEntity = factories.dataModel.createDataModelEntity({
        name: 'persons',
        technicalName: 'persons',
        description: 'Persons entity',
        attributes: [
            factories.dataModel.createDataEntityAttribute('varchar'),
            factories.dataModel.createDataEntityAttribute('varchar'),
            factories.dataModel.createDataEntityAttribute('varchar')
        ]
    });
    personsEntity.attributes[0].name = 'name';
    personsEntity.attributes[0].technicalName = 'name';
    personsEntity.attributes[1].name = 'email';
    personsEntity.attributes[1].technicalName = 'email';
    personsEntity.attributes[2].name = 'phone';
    personsEntity.attributes[2].technicalName = 'phone';

    await dataBuilder.workbench.explorer.dataExplorerTab.createEntity(personsEntity);
    await dataBuilder.workbench.canvas.toolbar.autoLayoutButton.click();

    await dataBuilder.workbench.canvas.syncToDatabaseButton.click();

    await expect(dataBuilder.overview.page.getByText('Fully synced')).toBeVisible();

    await dataBuilder.workbench.canvas.toolbar.saveModelButton.click();

    const testData = {
        name: 'insert_draft',
        email: 'test@draft.com',
        phone: '98728370'
    };

    await dataBuilder.workbench.inspector.commandsTab.open();
    await dataBuilder.workbench.inspector.commandsTab.createCommand({
        commandType: 'INSERT',
        name: 'insert_draft',
        technicalName: 'insert_draft',
        dataEntity: 'persons',
        attributes: ['name', 'email', 'phone'],
        defaultValues: testData
    });

    await dataBuilder.workbench.inspector.commandsTab
        .commandCard(`${testDataModel.technicalName}_insert`)
        .click();
    await dataBuilder.workbench.inspector.commandsTab.commandForm.openPreviewButton.click();
    await dataBuilder.workbench.inspector.previewModal.executeButton.click();
    await dataBuilder.workbench.inspector.previewModal.closeButton.click();

    const queryTechnicalName = `${normalizedTestDataModelName}_test`;

    await dataBuilder.workbench.inspector.queriesTab.open();
    await dataBuilder.workbench.inspector.queriesTab.createQuery({
        name: 'test',
        technicalName: queryTechnicalName,
        dataEntityName: 'persons',
        attributeNames: ['name', 'email', 'phone']
    });

    await dataBuilder.workbench.inspector.queriesTab.queryCard(queryTechnicalName).click();
    await dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
    await dataBuilder.workbench.inspector.previewModal.executeButton.click();

    await expect(dataBuilder.overview.page.locator('tbody')).toContainText(testData.name);
    await expect(dataBuilder.overview.page.locator('tbody')).toContainText(testData.email);
    await expect(dataBuilder.overview.page.locator('tbody')).toContainText(testData.phone);

    await dataBuilder.workbench.inspector.previewModal.closeButton.click();

    await dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();
    await expect(dataBuilder.page.getByRole('button', { name: '1.0.0 DRAFT' })).toBeVisible();

    await dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();

    await dataBuilder.workbench.deploymentToolbar.deployToNextStageButton.click();

    await dataBuilder.workbench.inspector.queriesTabButton.click();
    await expect(dataBuilder.workbench.inspector.queriesTab.addQueryButton).not.toBeVisible();

    await dataBuilder.workbench.inspector.commandsTabButton.click();
    await expect(dataBuilder.workbench.inspector.commandsTab.addCommandButton).not.toBeVisible();

    await dataBuilder.workbench.inspector.queriesTabButton.click();

    await dataBuilder.workbench.inspector.queriesTab.search('test');

    await dataBuilder.workbench.inspector.queriesTab.queryCard(queryTechnicalName).click();
    await dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
    await dataBuilder.workbench.inspector.previewModal.executeButton.click();

    await expect(
        dataBuilder.page.getByTestId('DB-PreviewView-IxSplitPane-IxSplitPane-root')
    ).toContainText('Statement executed successfully, but the result is empty.');

    await dataBuilder.workbench.inspector.previewModal.closeButton.click();

    await dataBuilder.workbench.inspector.commandsTabButton.click();

    await dataBuilder.workbench.inspector.commandsTab.search('insert');
    await dataBuilder.workbench.inspector.commandsTab
        .commandCard(`${testDataModel.technicalName}_insert`)
        .click();

    await dataBuilder.workbench.inspector.commandsTab.commandForm.openPreviewButton.click();

    await dataBuilder.page
        .getByTestId(
            'DB-ErInput-Parameters-IxExpansionPanel-IxExpansionPanel-actions-IxIconButton-arrow_down-IxIconButton-root'
        )
        .click();

    await dataBuilder.page
        .getByTestId('DB-ErInput-Parameters-IxExpansionPanel-IxInput-name-text-value-IxInput-root')
        .locator('input')
        .fill('inser_test');

    await dataBuilder.page
        .getByTestId('DB-ErInput-Parameters-IxExpansionPanel-IxInput-email-text-value-IxInput-root')
        .locator('input')
        .fill('test@test.com');

    await dataBuilder.workbench.inspector.previewModal.executeButton.click();

    await dataBuilder.workbench.inspector.previewModal.closeButton.click();

    await dataBuilder.workbench.inspector.queriesTabButton.click();

    await dataBuilder.workbench.inspector.queriesTab.search('test');

    await dataBuilder.workbench.inspector.queriesTab.queryCard(queryTechnicalName).click();
    await dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
    await dataBuilder.workbench.inspector.previewModal.executeButton.click();

    await expect(dataBuilder.page.locator('tbody')).toContainText('inser_test');
    await expect(dataBuilder.page.locator('tbody')).toContainText('test@test.com');

    await dataBuilder.workbench.inspector.previewModal.closeButton.click();

    await dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();
    await expect(dataBuilder.page.getByRole('button', { name: '1.0.0 TEST' })).toBeVisible();

    await dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();

    await dataBuilder.workbench.deploymentToolbar.deployToNextStageButton.click();

    await dataBuilder.workbench.inspector.queriesTabButton.click();
    await expect(dataBuilder.workbench.inspector.queriesTab.addQueryButton).not.toBeVisible();

    await dataBuilder.workbench.inspector.commandsTabButton.click();

    await dataBuilder.workbench.inspector.queriesTabButton.click();

    await dataBuilder.workbench.inspector.queriesTab.search('test');

    await dataBuilder.workbench.inspector.queriesTab.queryCard(queryTechnicalName).click();

    await dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
    await dataBuilder.workbench.inspector.previewModal.executeButton.click();

    await expect(
        dataBuilder.page.getByTestId('DB-PreviewView-IxSplitPane-IxSplitPane-root')
    ).toContainText('Statement executed successfully, but the result is empty.');

    await dataBuilder.workbench.inspector.previewModal.closeButton.click();

    await dataBuilder.workbench.inspector.commandsTabButton.click();

    await dataBuilder.workbench.inspector.commandsTab.search('insert');
    await dataBuilder.workbench.inspector.commandsTab
        .commandCard(`${testDataModel.technicalName}_insert`)
        .click();

    await dataBuilder.workbench.inspector.commandsTab.commandForm.openPreviewButton.click();

    await dataBuilder.page
        .getByTestId(
            'DB-ErInput-Parameters-IxExpansionPanel-IxExpansionPanel-actions-IxIconButton-arrow_down-IxIconButton-root'
        )
        .click();

    await dataBuilder.page
        .getByTestId('DB-ErInput-Parameters-IxExpansionPanel-IxInput-name-text-value-IxInput-root')
        .locator('input')
        .fill('inser_prod');

    await dataBuilder.page
        .getByTestId('DB-ErInput-Parameters-IxExpansionPanel-IxInput-email-text-value-IxInput-root')
        .locator('input')
        .fill('prod@prod.com');

    await dataBuilder.workbench.inspector.previewModal.executeButton.click();

    await dataBuilder.workbench.inspector.previewModal.closeButton.click();

    await dataBuilder.workbench.inspector.queriesTabButton.click();

    await dataBuilder.workbench.inspector.queriesTab.search('test');

    await dataBuilder.workbench.inspector.queriesTab
        .queryCard(`${testDataModel.technicalName}_${testDataModel.technicalName}`)
        .click();

    await dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
    await dataBuilder.workbench.inspector.previewModal.executeButton.click();

    await expect(dataBuilder.page.locator('tbody')).toContainText('inser_prod');
    await expect(dataBuilder.page.locator('tbody')).toContainText('prod@prod.com');

    await dataBuilder.workbench.inspector.previewModal.closeButton.click();

    await dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();
    await expect(dataBuilder.page.getByRole('button', { name: '1.0.0 PROD' })).toBeVisible();

    await dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();

    await dataBuilder.workbench.canvas.toolbar.createNewVersionButton.click();

    await dataBuilder.page.getByRole('textbox', { name: 'Summary' }).click();
    await dataBuilder.page.getByRole('textbox', { name: 'Summary' }).fill('new version');

    await dataBuilder.page.getByRole('textbox', { name: 'Description' }).click();
    await dataBuilder.page
        .getByRole('textbox', { name: 'Description' })
        .fill('this will be a new version model');

    await dataBuilder.page.getByTestId('DB-VersionCreateModal-submit-IxButton-root').click();

    await dataBuilder.workbench.exit();

    await dataBuilder.overview.dataModelsTab.search(testDataModel.name);

    await expect(dataBuilder.page.getByText('2.0.0')).toBeVisible();

    await dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.technicalName).open();

    await dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();
    await expect(dataBuilder.page.getByRole('button', { name: '2.0.0 DRAFT' })).toBeVisible();

    await dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();

    await dataBuilder.workbench.explorer.dataExplorerTab.dataEntityTreeItemLabel('persons').click();

    await dataBuilder.workbench.inspector.propertiesTabButton.click();

    await dataBuilder.workbench.inspector.propertiesTab.attributePanel('name').deleteButton.click();
    await dataBuilder.workbench.inspector.propertiesTab
        .attributePanel('name')
        .deleteConfirmButton.click();

    await dataBuilder.workbench.canvas.toolbar.saveModelButton.click();

    await dataBuilder.workbench.deploymentToolbar.deployToNextStageButton.click();

    await dataBuilder.page.waitForTimeout(2000);

    await dataBuilder.workbench.deploymentToolbar.deployToNextStageButton.click();

    await dataBuilder.page
        .getByTestId('DB-WorkbenchView-ConfirmModal-IxModal-submit-IxButton-root')
        .click();

    await dataBuilder.page.getByTestId('DB-BreakingChangeModal-Continue-IxButton-root').click();

    await dataBuilder.workbench.exit();

    await dataBuilder.overview.dataModelsTab.search(testDataModel.name);

    await dataBuilder.overview.page
        .getByTestId(
            `DB-ModelsList-ListRow-${normalizedTestDataModelName}-Stage-PRODUCTION-IxChip-root`
        )
        .filter({ hasText: '2.0.0' })
        .hover();

    await expect(
        dataBuilder.overview.page.locator('.v-overlay__content').filter({ hasText: 'new version' })
    ).toBeVisible();

    await dataBuilder.page
        .getByTestId(
            `DB-ModelsList-ListRow-${normalizedTestDataModelName}-Stage-PRODUCTION-IxChip-root`
        )
        .getByText('2.0.0')
        .click();

    await dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();
    await expect(dataBuilder.page.getByRole('button', { name: '2.0.0 PROD' })).toBeVisible();

    await dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();
});
