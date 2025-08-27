import { Page, expect } from '@playwright/test';
import { Task } from '../interfaces';

export class TasksPage {
  readonly page: Page;
  private readonly url = 'http://localhost:5173/#/tasks';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.url);
  }

  // Navigation methods
  async clickCreate() {
    await this.page.getByRole('link', { name: 'Create' }).click();
  }





}
