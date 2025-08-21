import { Page, expect } from '@playwright/test';
import { MainPage } from './MainPage';

export class LoginPage {
  readonly page: Page;
  private readonly url = 'http://localhost:5173/#/login';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.url);
  }

  private usernameInput() {
    return this.page.getByRole('textbox', { name: 'Username' });
  }

  private passwordInput() {
    return this.page.getByRole('textbox', { name: 'Password' });
  }

  private signInButton() {
    return this.page.getByRole('button', { name: 'Sign in' });
  }

  async fillUsername(username: string) {
    await this.usernameInput().click();
    await this.usernameInput().fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput().click();
    await this.passwordInput().fill(password);
  }

  async submit() {
    await this.signInButton().click();
  }

  async login(username: string, password: string): Promise<MainPage> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.submit();
    return new MainPage(this.page);
  }

  async assertSignInButtonVisible() {
    await expect(this.signInButton()).toBeVisible();
  }
}
