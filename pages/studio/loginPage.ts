import { Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async login(username: string, password: string) {
        await this.page.getByRole('textbox', { name: /Username or email/i }).fill(username);
        await this.page.getByRole('textbox', { name: /Password/i }).fill(password);
        await this.page.getByRole('button', { name: /Sign In/i }).click();
    }
}
