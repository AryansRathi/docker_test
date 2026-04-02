import { Locator } from '@playwright/test';
import { DataModelsTab } from '../dataModelsTab';
import { TestDataSource } from 'test/factories/dataSourceFactory';
import { scrollUntilVisible } from 'test/utils/playwright';

export class ImportFromDatabaseModal {
    readonly parent: DataModelsTab;
    readonly root: Locator;

    readonly sqlSourceTypeButton: Locator;
    readonly openApiSourceTypeButton: Locator;

    readonly openApiFileInput: Locator;
    readonly openApiFileUploadItem: (fileName: string) => Locator;
    readonly openApiStep2NextButton: Locator;
    readonly openApiStep3NextButton: Locator;
    readonly productionBaseUriInput: Locator;
    readonly openApiStep4FinishButton: Locator;

    readonly draftDataSourceSelect: Locator;
    readonly draftDataSourceSelectItem: (technicalName: string) => Locator;
    readonly testDataSourceSelect: Locator;
    readonly testDataSourceSelectItem: (technicalName: string) => Locator;
    readonly previewDataSourceSelect: Locator;
    readonly previewDataSourceSelectItem: (technicalName: string) => Locator;
    readonly productionDataSourceSelect: Locator;
    readonly productionDataSourceSelectItem: (technicalName: string) => Locator;

    readonly importStep2NextButton: Locator;
    readonly importStep3SelectAllButton: Locator;
    readonly searchTableInput: Locator;
    readonly tableCheckbox: (tableName: string) => Locator;
    readonly importStep3NextButton: Locator;

    readonly nameInput: Locator;
    readonly technicalNameInput: Locator;
    readonly descriptionInput: Locator;

    readonly importStep4FinishButton: Locator;

    constructor(parent: DataModelsTab) {
        this.parent = parent;
        this.root = parent.parent.page.locator('div.v-overlay__content', {
            hasText: 'Import Model'
        });

        this.sqlSourceTypeButton = this.root.getByTestId('DB-ImportStep1Type-SQL-SourceType');
        this.openApiSourceTypeButton = this.root.getByTestId(
            'DB-ImportStep1Type-OpenAPI-SourceType'
        );

        this.openApiFileInput = this.root
            .getByTestId('DB-ImportStep2OpenAPIImport-v-file-input-Input')
            .locator('input[type="file"]');
        this.openApiFileUploadItem = (fileName: string) =>
            this.root.getByTestId(`DB-ImportStep2OpenAPIImport-v-file-upload-item-${fileName}`);
        this.openApiStep2NextButton = this.root.getByTestId(
            'DB-ImportStep2OpenAPIImport-Next-IxButton-root'
        );
        this.openApiStep3NextButton = this.root.getByTestId(
            'DB-ImportStep3OpenAPISelect-Next-IxButton-root'
        );
        this.nameInput = this.root
            .getByTestId('DB-ImportStep4OpenAPIDetails-DataModelName-IxInput-root')
            .getByRole('textbox');
        this.technicalNameInput = this.root
            .getByTestId('DB-ImportStep4OpenAPIDetails-DataModelId-IxInput-root')
            .getByRole('textbox');
        this.descriptionInput = this.root
            .getByTestId('DB-ImportStep4OpenAPIDetails-DataModelDescription-IxTextArea-root')
            .locator('textarea');
        this.productionBaseUriInput = this.root.locator('#DB-StagedBaseURIVue-ProductionBaseUri');
        this.openApiStep4FinishButton = this.root.getByTestId(
            'DB-ImportStep4OpenAPIDetails-Finish-IxButton-root'
        );

        this.draftDataSourceSelect = this.root
            .getByTestId('DB-StagedDatasourceVue-DraftDataSource-IxSelect-root')
            .locator('.v-field__input');
        this.draftDataSourceSelectItem = (technicalName: string) =>
            this.parent.parent.page.getByTestId(
                `DB-StagedDatasourceVue-DraftDataSource-IxSelect-item-${technicalName}_1000000`
            );
        this.testDataSourceSelect = this.root
            .getByTestId('DB-StagedDatasourceVue-TestDataSource-IxSelect-root')
            .locator('.v-field__input');
        this.testDataSourceSelectItem = (technicalName: string) =>
            this.parent.parent.page.getByTestId(
                `DB-StagedDatasourceVue-TestDataSource-IxSelect-item-${technicalName}_1000000`
            );
        this.previewDataSourceSelect = this.root
            .getByTestId('DB-StagedDatasourceVue-PreviewDataSource-IxSelect-root')
            .locator('.v-field__input');
        this.previewDataSourceSelectItem = (technicalName: string) =>
            this.parent.parent.page.getByTestId(
                `DB-StagedDatasourceVue-PreviewDataSource-IxSelect-item-${technicalName}_1000000`
            );
        this.productionDataSourceSelect = this.root
            .getByTestId('DB-StagedDatasourceVue-ProductionDataSource-IxSelect-root')
            .locator('.v-field__input');
        this.productionDataSourceSelectItem = (technicalName: string) =>
            this.parent.parent.page.getByTestId(
                `DB-StagedDatasourceVue-ProductionDataSource-IxSelect-item-${technicalName}_1000000`
            );

        this.importStep2NextButton = this.root.getByTestId(
            'DB-Step2SQLImport-HiddenForm-Next-IxButton-root'
        );
        this.importStep3SelectAllButton = this.root.getByTestId(
            'DB-ImportStep3SQLSelect-SelectAll-IxButton-root'
        );
        this.searchTableInput = this.root
            .getByTestId('DB-ReImportModal-SearchInput-IxInput-root')
            .getByRole('textbox');
        this.tableCheckbox = (tableName: string) =>
            this.root
                .getByTestId(`DB-ImportStep3SQLSelect-Tree-IxTree-checkbox--_${tableName}`)
                .getByRole('checkbox');
        this.importStep3NextButton = this.root.getByTestId(
            'DB-ImportStep3SQLSelect-Next-IxButton-root'
        );
        this.nameInput = this.root.getByRole('textbox', {
            name: 'Data Model name'
        });
        this.technicalNameInput = this.root.getByRole('textbox', {
            name: 'Data Model technical name'
        });
        this.descriptionInput = this.root.getByRole('textbox', {
            name: 'Data Model description'
        });

        this.importStep4FinishButton = this.root
            .getByTestId('DB-ImportStep4SQLDetails-Finish-IxButton-root')
            .or(this.root.getByTestId('DB-ImportStep4OpenAPIDetails-Finish-IxButton-root'));
    }

    public async selectDataSources({
        draftDataSource,
        testDataSource,
        previewDataSource,
        productionDataSource
    }: {
        draftDataSource: TestDataSource;
        testDataSource?: TestDataSource;
        previewDataSource?: TestDataSource;
        productionDataSource?: TestDataSource;
    }) {
        await this.draftDataSourceSelect.click();
        const draftDataSourceItem = this.draftDataSourceSelectItem(draftDataSource.technicalName);
        await scrollUntilVisible(
            draftDataSourceItem,
            this.parent.parent.page.locator('.v-overlay__content.ix-list')
        );
        await draftDataSourceItem.click();

        await this.testDataSourceSelect.click();
        const testDataSourceItem = this.testDataSourceSelectItem(
            testDataSource?.technicalName ?? draftDataSource.technicalName
        );
        await scrollUntilVisible(
            testDataSourceItem,
            this.parent.parent.page.locator('.v-overlay__content.ix-list')
        );
        await testDataSourceItem.click();

        await this.previewDataSourceSelect.click();
        const previewDataSourceItem = this.previewDataSourceSelectItem(
            previewDataSource?.technicalName ?? draftDataSource.technicalName
        );
        await scrollUntilVisible(
            previewDataSourceItem,
            this.parent.parent.page.locator('.v-overlay__content.ix-list')
        );
        await previewDataSourceItem.click();

        await this.productionDataSourceSelect.click();
        const productionDataSourceItem = this.productionDataSourceSelectItem(
            productionDataSource?.technicalName ?? draftDataSource.technicalName
        );
        await scrollUntilVisible(
            productionDataSourceItem,
            this.parent.parent.page.locator('.v-overlay__content.ix-list')
        );
        await productionDataSourceItem.click();
    }
}
