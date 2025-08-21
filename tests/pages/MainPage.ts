import { Page, expect } from '@playwright/test';
import { LoginPage } from './LoginPage';

export class MainPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private mainContent() {
    return this.page.locator('#main-content');
  }

  private profileButton() {
    return this.page.getByRole('button', { name: 'Profile' });
  }

  private logoutMenuItem() {
    return this.page.getByRole('menuitem', { name: 'Logout' });
  }

  async assertMainContentLorem() {
    await expect(this.mainContent()).toContainText('Lorem ipsum sic dolor amet...');
  }

  async expectProfileButtonVisible() {
    await expect(this.profileButton()).toBeVisible();
  }

  async openProfile() {
    await this.profileButton().click();
  }

  async logout(): Promise<LoginPage> {
    await this.openProfile();
    await this.logoutMenuItem().click();
    return new LoginPage(this.page);
  }
}
