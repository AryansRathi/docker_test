import { test as baseTest, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { AdminFactory } from 'test/factories/adminFactory';
import { type TestExternalDataSource } from 'test/factories/dataSourceFactory';
import { factories, Factories } from 'test/factories/factories';
import { DataBuilder } from 'test/pages/dataBuilder';
import { Studio } from 'test/pages/studio';
import { LoginPage } from 'test/pages/studio/loginPage';
import { testConfig } from 'test/test.config';
import { ExternalMssql } from 'test/utils/externalMssql';
import { ExternalPostgres } from 'test/utils/externalPostgres';

export * from '@playwright/test';

type TestScopedFixtures = {
    factories: Factories;
    dataBuilder: DataBuilder;
    studio: Studio;
};

type WorkerScopedFixtures = {
    workerStorageState: string;
    externalPostgres: ExternalPostgres;
    externalPostgresDataSource: TestExternalDataSource;
    externalMssql: ExternalMssql;
    externalMssqlDataSource: TestExternalDataSource;
};

export const test = baseTest.extend<TestScopedFixtures, WorkerScopedFixtures>({
    // Use the factories fixture to create random but unique test data.
    // This provides an interface to all factories for convenience.
    // eslint-disable-next-line no-empty-pattern
    factories: async ({}, use) => {
        await use(factories);
    },

    dataBuilder: async ({ page }, use) => {
        await page.goto('/');
        const dataBuilder = new DataBuilder(page);
        await dataBuilder.open();
        await use(dataBuilder);
    },

    studio: async ({ page }, use) => {
        await use(new Studio(page));
    },

    // Use the same storage state for all tests in this worker.
    storageState: ({ workerStorageState }, use) => use(workerStorageState),

    // Authenticate once per worker with a worker-scoped fixture.
    workerStorageState: [
        async ({ browser }, use) => {
            // Use parallelIndex as a unique identifier for each worker.
            const id = test.info().parallelIndex;
            const fileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);

            if (fs.existsSync(fileName)) {
                // Reuse existing authentication state if any.
                await use(fileName);
                return;
            }

            // Important: make sure we authenticate in a clean environment by unsetting storage state.
            const page = await browser.newPage({
                storageState: undefined,
                ignoreHTTPSErrors: true
            });

            // Perform authentication steps.
            const loginPage = new LoginPage(page);
            await page.goto(testConfig.baseURL + '/');
            await loginPage.login(testConfig.username, testConfig.password);

            // Close the usersnap overlay if it appears
            try {
                const gotItButton = page.getByRole('button', { name: /Got it/i });
                await gotItButton.waitFor({ timeout: 2000 });
                await gotItButton.click();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                // Ignore if the overlay does not appear
            }

            // Wait until the page receives the cookies.
            // Alternatively, you can wait until the page reaches a state where all cookies are set.
            const studio = new Studio(page);
            await expect(studio.navRail.homeButton).toBeVisible();

            // End of authentication steps.

            await page.context().storageState({ path: fileName });
            await page.close();
            await use(fileName);
        },
        { scope: 'worker' }
    ],

    externalPostgres: [
        // eslint-disable-next-line no-empty-pattern
        async ({}, use) => {
            const pg = new ExternalPostgres();
            await use(pg);
            await pg.close();
        },
        { scope: 'worker' }
    ],

    externalPostgresDataSource: [
        async ({ browser, workerStorageState }, use) => {
            const page = await browser.newPage({
                storageState: workerStorageState,
                ignoreHTTPSErrors: true
            });

            const credential = AdminFactory.createUsernamePasswordCredential({
                username: 'postgres',
                password: 'postgres'
            });
            const studio = new Studio(page);
            await studio.page.goto('/');
            await studio.adminPage.open();
            await studio.adminPage.sidebar.credentialsTabButton.click();
            await studio.adminPage.credentialsTab.createUsernamePasswordCredential(credential);

            const dataBuilder = new DataBuilder(page);
            await dataBuilder.open();
            await dataBuilder.overview.dataSourcesTab.open();

            const externalPostgresDataSource =
                factories.dataSource.createExternalDataSource('postgres');
            await dataBuilder.overview.dataSourcesTab.createExternalDataSource(
                externalPostgresDataSource,
                credential
            );

            await page.close();
            await use(externalPostgresDataSource);
        },
        { scope: 'worker' }
    ],

    externalMssql: [
        // eslint-disable-next-line no-empty-pattern
        async ({}, use) => {
            const mssql = new ExternalMssql();
            await use(mssql);
            await mssql.close();
        },
        { scope: 'worker' }
    ],

    externalMssqlDataSource: [
        async ({ browser, workerStorageState }, use) => {
            const page = await browser.newPage({
                storageState: workerStorageState,
                ignoreHTTPSErrors: true
            });

            const credential = AdminFactory.createUsernamePasswordCredential({
                username: 'sa',
                password: 'sqlserver@123'
            });
            const studio = new Studio(page);
            await studio.page.goto('/');
            await studio.adminPage.open();
            await studio.adminPage.sidebar.credentialsTabButton.click();
            await studio.adminPage.credentialsTab.createUsernamePasswordCredential(credential);

            const dataBuilder = new DataBuilder(page);
            await dataBuilder.open();
            await dataBuilder.overview.dataSourcesTab.open();

            const externalMssqlDataSource =
                factories.dataSource.createExternalDataSource('sqlserver');
            await dataBuilder.overview.dataSourcesTab.createExternalDataSource(
                externalMssqlDataSource,
                credential
            );

            await page.close();
            await use(externalMssqlDataSource);
        },
        { scope: 'worker' }
    ]
});
