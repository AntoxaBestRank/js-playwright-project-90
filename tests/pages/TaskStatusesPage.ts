import { Page, expect } from '@playwright/test';

export interface TaskStatus {
  id: number;
  name: string;
  slug: string;
}

export class TaskStatusesPage {
  readonly page: Page;
  private readonly url = 'http://localhost:5173/#/task_statuses';

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

  async clickDelete() {
    await this.page.getByRole('button', { name: 'Delete' }).click();
  }

  async clickSelectAll() {
    await this.page.getByRole('columnheader', { name: 'Select all' }).click();
  }

  // Form methods
  private nameInput() {
    return this.page.getByRole('textbox', { name: 'Name' });
  }

  private slugInput() {
    return this.page.getByRole('textbox', { name: 'Slug' });
  }

  private saveButton() {
    return this.page.getByRole('button', { name: 'Save' });
  }

  async fillName(name: string) {
    await this.nameInput().fill(name);
  }

  async fillSlug(slug: string) {
    await this.slugInput().fill(slug);
  }

  async fillForm(name: string, slug: string) {
    await this.fillName(name);
    await this.fillSlug(slug);
  }

  async clickSave() {
    await this.saveButton().click();
  }

  // Row selection methods
  async selectRowById(id: number) {
    await this.page.getByRole('row', { name: `Select this row ${id}` }).getByRole('checkbox').check();
  }

  async selectMultipleRows(ids: number[]) {
    for (const id of ids) {
      await this.selectRowById(id);
    }
  }

  async clickRowById(id: number) {
    await this.page.getByText(id.toString(), { exact: true }).click();
  }

  // Table methods
  async getAllRows() {
    return await this.page.getByRole('row').all();
  }

  async getTableHeaders() {
    const header = await this.page.getByRole('row').first();
    return await header.getByRole('columnheader').allInnerTexts();
  }

  async getRowById(id: number) {
    return this.page.locator('tr').filter({ has: this.page.getByRole('cell', { name: id.toString(), exact: true }) });
  }

  async getRowCells(row: any) {
    return await row.getByRole('cell').allInnerTexts();
  }

  async getAllCheckboxes() {
    return await this.page.getByRole('checkbox').all();
  }

  // Assertion methods
  async assertCreateFormVisible() {
    await expect(this.nameInput()).toBeVisible();
    await expect(this.slugInput()).toBeVisible();
    await expect(this.saveButton()).toBeDisabled();
  }

  async assertEditFormVisible() {
    await expect(this.nameInput()).toBeVisible();
    await expect(this.slugInput()).toBeVisible();
    await expect(this.saveButton()).toBeDisabled();
  }

  async assertFormValues(name: string, slug: string) {
    await expect(this.nameInput()).toHaveValue(name);
    await expect(this.slugInput()).toHaveValue(slug);
  }

  async assertTableRowCount(expectedCount: number) {
    const rows = await this.getAllRows();
    await expect(rows).toHaveLength(expectedCount + 1); // +1 for header
  }

  async assertTableContent(expectedStatuses: TaskStatus[]) {
    const rows = await this.getAllRows();
    const actual: TaskStatus[] = [];
    
    for (const row of rows.slice(1)) { // skip header
      const cells = await this.getRowCells(row);
      const [checkbox, idStr, name, slug] = cells;
      actual.push({ id: Number(idStr), name, slug });
    }

    const expected = expectedStatuses.map(({ id, name, slug }) => ({ id, name, slug }));
    await expect(actual).toEqual(expected);
  }

  async assertRowInfoDisplayed() {
    const header = await this.getTableHeaders();
    const nameIndex = header.indexOf('Name');
    const slugIndex = header.indexOf('Slug');

    const rows = await this.getAllRows();
    for (const row of rows.slice(1)) {
      const rowCells = await this.getRowCells(row);
      await expect(rowCells[nameIndex]).not.toBe('');
      await expect(rowCells[slugIndex]).not.toBe('');
    }
  }

  async assertRowUpdated(id: number, expectedName: string, expectedSlug: string) {
    const header = await this.getTableHeaders();
    const nameIndex = header.indexOf('Name');
    const slugIndex = header.indexOf('Slug');

    const rowWithId = await this.getRowById(id);
    const nameCell = rowWithId.getByRole('cell').nth(nameIndex);
    const slugCell = rowWithId.getByRole('cell').nth(slugIndex);

    await expect(nameCell).toHaveText(expectedName);
    await expect(slugCell).toHaveText(expectedSlug);
  }

  async assertRowsDeleted(ids: number[]) {
    for (const id of ids) {
      await expect(this.page.getByRole('cell', { name: id.toString(), exact: true })).not.toBeVisible();
    }
  }

  async assertAllCheckboxesSelected() {
    const checkboxes = await this.getAllCheckboxes();
    for (const checkbox of checkboxes) {
      await expect(checkbox).toBeChecked();
    }
  }

  async assertNoStatusesMessage() {
    await expect(this.page.getByText('No Task statuses yet.')).toBeVisible();
  }
}
