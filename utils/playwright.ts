import { expect, type Locator } from '@playwright/test';
import { testConfig } from 'test/test.config';

/**
 * Scrolls the given container until the target element becomes visible.
 * In select dropdowns, scrollIntoViewIfNeeded does not work (thank you, Vuetify).
 *
 * `.toPass()` ignores the global expect timeout and defaults to 0 (infinite),
 * so we set an explicit default value.
 */
export async function scrollUntilVisible(
    target: Locator,
    scrollContainer: Locator,
    options?: { timeout?: number }
) {
    await expect(async () => {
        if (!(await target.isVisible())) {
            await scrollContainer.hover();
            await scrollContainer.page().mouse.wheel(0, 250);
            throw new Error('Element not yet visible, retrying...');
        }
    }).toPass({
        intervals: [0],
        timeout: options?.timeout ?? 3 * testConfig.actionTimeout
    });
}
