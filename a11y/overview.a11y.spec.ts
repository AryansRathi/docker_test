import { createHtmlReport } from 'axe-html-reporter';
import { expect, test } from 'test/fixtures/axe';

test.describe('overview', () => {
    test.skip('should not have accessibility issues', async ({
        dataBuilder,
        makeAxeBuilder
    }, testInfo) => {
        await dataBuilder.overview.dataModelsTabButton.click();

        const accessibilityScanResults = await makeAxeBuilder().analyze();

        await testInfo.attach('accessibility-scan-results', {
            body: JSON.stringify(accessibilityScanResults, null, 2),
            contentType: 'application/json'
        });

        createHtmlReport({
            results: accessibilityScanResults,
            options: {
                outputDir: './test-results/accessibility-report',
                reportFileName: 'overview.html',
                projectKey: 'Data Builder'
            }
        });

        expect(accessibilityScanResults.violations.length).toEqual(0);
    });
});
