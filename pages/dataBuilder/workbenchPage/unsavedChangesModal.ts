import { Locator } from '@playwright/test';
import { WorkbenchPage } from '../workbenchPage';

export class UnsavedChangesModal {
    readonly parent: WorkbenchPage;
    readonly root: Locator;

    readonly cancelButton: Locator;
    readonly discardButton: Locator;
    readonly saveButton: Locator;

    constructor(parent: WorkbenchPage) {
        this.parent = parent;
        this.root = parent.page.getByTestId('DB-WorkbenchView-UnsavedChanges-IxModal-root');

        this.cancelButton = this.root.getByTestId(
            'DB-WorkbenchView-UnsavedChanges-Cancel-IxButton-root'
        );
        this.discardButton = this.root.getByTestId(
            'DB-WorkbenchView-UnsavedChanges-Discard-IxButton-root'
        );
        this.saveButton = this.root.getByTestId(
            'DB-WorkbenchView-UnsavedChanges-Discard-IxButton-root'
        );
    }
}
