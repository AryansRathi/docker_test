import { expect, test } from 'test/fixtures/base';

test.describe('Connection to external data source', () => {
    test('should work with postgres', async ({ dataBuilder, factories, studio }) => {
        const postgresCredential = factories.admin.createUsernamePasswordCredential({
            username: 'postgres',
            password: 'postgres'
        });

        await studio.adminPage.open();
        await studio.adminPage.credentialsTab.open();
        await studio.adminPage.credentialsTab.createUsernamePasswordCredential(postgresCredential);

        await dataBuilder.open();
        await dataBuilder.overview.dataSourcesTab.open();

        const externalPostgresDataSource =
            factories.dataSource.createExternalDataSource('postgres');
        await dataBuilder.overview.dataSourcesTab.createExternalDataSource(
            externalPostgresDataSource,
            postgresCredential
        );

        await expect(
            dataBuilder.overview.dataSourcesTab.dataSourceStageChip(
                externalPostgresDataSource.technicalName
            )
        ).toContainText('Connected');
    });

    test('should work with sqlserver', async ({ dataBuilder, factories, studio }) => {
        const sqlServerCredential = factories.admin.createUsernamePasswordCredential({
            username: 'sa',
            password: 'sqlserver@123'
        });

        await studio.adminPage.open();
        await studio.adminPage.credentialsTab.open();
        await studio.adminPage.credentialsTab.createUsernamePasswordCredential(sqlServerCredential);

        await dataBuilder.open();
        await dataBuilder.overview.dataSourcesTab.open();

        const externalSqlServerDataSource =
            factories.dataSource.createExternalDataSource('sqlserver');
        await dataBuilder.overview.dataSourcesTab.createExternalDataSource(
            externalSqlServerDataSource,
            sqlServerCredential
        );

        await expect(
            dataBuilder.overview.dataSourcesTab.dataSourceStageChip(
                externalSqlServerDataSource.technicalName
            )
        ).toContainText('Connected');
    });
});
