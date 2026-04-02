import { Locator, Page } from '@playwright/test';
import { Canvas } from './workbenchPage/canvas';
import { DeploymentToolbar } from './workbenchPage/deploymentToolbar';
import { Explorer } from './workbenchPage/explorer';
import { Inspector } from './workbenchPage/inspector';
import { RunbookModal } from './workbenchPage/runbookModal';
import { UnsavedChangesModal } from './workbenchPage/unsavedChangesModal';

export class WorkbenchPage {
    readonly page: Page;
    readonly root: Locator;

    readonly canvas: Canvas;
    readonly explorer: Explorer;
    readonly deploymentToolbar: DeploymentToolbar;
    readonly inspector: Inspector;
    readonly runbookModal: RunbookModal;
    readonly unsavedChangesModal: UnsavedChangesModal;

    readonly notification: (text: string) => Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.locator('main .wrapper');

        this.canvas = new Canvas(this);
        this.explorer = new Explorer(this);
        this.deploymentToolbar = new DeploymentToolbar(this);
        this.inspector = new Inspector(this);
        this.runbookModal = new RunbookModal(this);
        this.unsavedChangesModal = new UnsavedChangesModal(this);

        this.notification = (text: string) =>
            this.page.getByTestId('DB-App-IxNotification-IxNotification-root').getByText(text);
    }

    public async exit(
        { saveModelIfAsked }: { saveModelIfAsked: boolean } = { saveModelIfAsked: true }
    ) {
        await this.deploymentToolbar.moveBackToOverviewButton.click();
        if (await this.unsavedChangesModal.root.isVisible()) {
            if (saveModelIfAsked) {
                await this.unsavedChangesModal.saveButton.click();
            } else {
                await this.unsavedChangesModal.discardButton.click();
            }
        }
    }
}
