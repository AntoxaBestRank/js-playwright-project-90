import { Page, expect } from '@playwright/test';

export type UserFormData = {
  email: string;
  firstName: string;
  lastName: string;
};

export type UserData = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

export class Users {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation
  async openUsers() {
    await this.page.getByRole('menuitem', { name: 'Users' }).click();
  }

  async openCreate() {
    await this.page.getByRole('link', { name: 'Create' }).click();
  }

  async openEditUser(userId: number) {
    await this.page.getByRole('cell', { name: userId.toString(), exact: true }).click();
  }

  async gotoUser(userId: number) {
    await this.page.goto(`http://localhost:5173/#/users/${userId}`);
  }

  // Locators
  private emailInput() {
    return this.page.getByRole('textbox', { name: 'Email' });
  }

  private firstNameInput() {
    return this.page.getByRole('textbox', { name: 'First name' });
  }

  private lastNameInput() {
    return this.page.getByRole('textbox', { name: 'Last name' });
  }

  private saveButton() {
    return this.page.getByRole('button', { name: 'Save' });
  }

  private deleteButton() {
    return this.page.getByRole('button', { name: 'Delete' });
  }

  private alert() {
    return this.page.getByRole('alert');
  }

  private tableRows() {
    return this.page.getByRole('row');
  }

  private tableHeaders() {
    return this.page.getByRole('columnheader');
  }

  private selectAllCheckbox() {
    return this.page.getByRole('checkbox', { name: 'Select all' });
  }

  private deleteSelectedButton() {
    return this.page.getByRole('button', { name: 'Delete' });
  }

  // Table methods
  async getTableRows() {
    return await this.tableRows().all();
  }

  async getTableHeaders() {
    const header = await this.tableRows().first();
    return await header.getByRole('columnheader').allInnerTexts();
  }

  async getColumnIndex(columnName: string) {
    const headers = await this.getTableHeaders();
    return headers.indexOf(columnName);
  }

  async getRowCells(row: any) {
    return await row.getByRole('cell').allInnerTexts();
  }

  async getTableData(): Promise<UserData[]> {
    const rows = await this.getTableRows();
    const actual: UserData[] = [];
    
    for (const row of rows.slice(1)) { // пропускаем заголовок
      const cells = await this.getRowCells(row);
      const [checkbox, idStr, email, firstName, lastName] = cells;
      actual.push({ 
        id: Number(idStr), 
        email, 
        firstName, 
        lastName
      });
    }
    
    return actual;
  }

  // Edit form methods
  async assertEditFormVisible() {
    await expect(this.emailInput()).toBeVisible();
    await expect(this.firstNameInput()).toBeVisible();
    await expect(this.lastNameInput()).toBeVisible();
    await expect(this.deleteButton()).toBeVisible();
    await expect(this.saveButton()).toBeVisible();
  }

  async fillEditForm(data: Partial<UserFormData>) {
    if (data.email !== undefined) {
      await this.emailInput().click();
      await this.emailInput().clear();
      await this.emailInput().fill(data.email);
    }
    if (data.firstName !== undefined) {
      await this.firstNameInput().click();
      await this.firstNameInput().clear();
      await this.firstNameInput().fill(data.firstName);
    }
    if (data.lastName !== undefined) {
      await this.lastNameInput().click();
      await this.lastNameInput().clear();
      await this.lastNameInput().fill(data.lastName);
    }
  }

  async clearAllFields() {
    await this.emailInput().click();
    await this.emailInput().clear();
    await this.emailInput().fill('');

    await this.firstNameInput().click();
    await this.firstNameInput().clear();
    await this.firstNameInput().fill('');

    await this.lastNameInput().click();
    await this.lastNameInput().clear();
    await this.lastNameInput().fill('');
  }

  async waitForUpdateSuccess() {
    await expect(this.page.getByText('Element updated')).toBeVisible();
  }

  async assertUpdatedValues(userId: number, expectedData: Partial<UserFormData>) {
    const emailIndex = await this.getColumnIndex('Email');
    const firstNameIndex = await this.getColumnIndex('First name');
    const lastNameIndex = await this.getColumnIndex('Last name');

    const rowWithId = this.page.locator('tr').filter({ 
      has: this.page.getByRole('cell', { name: userId.toString(), exact: true }) 
    });
    
    if (expectedData.email !== undefined) {
      const emailCell = rowWithId.getByRole('cell').nth(emailIndex);
      await expect(emailCell).toHaveText(expectedData.email);
    }
    
    if (expectedData.firstName !== undefined) {
      const firstNameCell = rowWithId.getByRole('cell').nth(firstNameIndex);
      await expect(firstNameCell).toHaveText(expectedData.firstName);
    }
    
    if (expectedData.lastName !== undefined) {
      const lastNameCell = rowWithId.getByRole('cell').nth(lastNameIndex);
      await expect(lastNameCell).toHaveText(expectedData.lastName);
    }
  }

  // Validation methods
  async assertFieldRequired(fieldName: string) {
    const fieldLabel = this.page.getByLabel(fieldName);
    const fieldFormControl = fieldLabel.locator('xpath=ancestor::*[contains(@class, "MuiFormControl-root")]');
    await expect(fieldFormControl).toContainText('Required');
  }

  async assertEmailFormatError() {
    const emailLabel = this.page.getByLabel('Email');
    const emailFormControl = emailLabel.locator('xpath=ancestor::*[contains(@class, "MuiFormControl-root")]');
    await expect(emailFormControl).toContainText('Incorrect email format');
  }

  // Assertions
  async assertCreateFormVisible() {
    await expect(this.emailInput()).toBeVisible();
    await expect(this.firstNameInput()).toBeVisible();
    await expect(this.lastNameInput()).toBeVisible();
  }

  async expectSaveDisabled() {
    await expect(this.saveButton()).toBeDisabled();
  }

  async assertAlertCreated() {
    await expect(this.alert()).toContainText('Element created');
  }

  async assertFormValues(data: UserFormData) {
    await expect(this.emailInput()).toHaveValue(data.email);
    await expect(this.firstNameInput()).toHaveValue(data.firstName);
    await expect(this.lastNameInput()).toHaveValue(data.lastName);
  }

  async assertTableRowCount(expectedCount: number) {
    const rows = await this.getTableRows();
    await expect(rows).toHaveLength(expectedCount + 1); // +1 для заголовка
  }

  async assertTableData(expectedData: UserData[]) {
    const actual = await this.getTableData();
    const expected = expectedData.map(({ id, email, firstName, lastName }) => ({ 
      id, email, firstName, lastName 
    }));
    await expect(actual).toEqual(expected);
  }

  async assertAllFieldsHaveValues() {
    const emailIndex = await this.getColumnIndex('Email');
    const firstNameIndex = await this.getColumnIndex('First name');
    const lastNameIndex = await this.getColumnIndex('Last name');

    const rows = await this.getTableRows();
    for (const row of rows.slice(1)) {
      const rowCells = await this.getRowCells(row);
      await expect(rowCells[emailIndex]).not.toBe('');
      await expect(rowCells[firstNameIndex]).not.toBe('');
      await expect(rowCells[lastNameIndex]).not.toBe('');
    }
  }

  // Actions
  async fillForm(data: UserFormData) {
    await this.emailInput().fill(data.email);
    await this.firstNameInput().fill(data.firstName);
    await this.lastNameInput().fill(data.lastName);
  }

  async save() {
    await this.saveButton().click();
  }

  async createUser(data: UserFormData) {
    await this.fillForm(data);
    await this.save();
  }

  async editUser(userId: number, data: Partial<UserFormData>) {
    await this.openEditUser(userId);
    await this.assertEditFormVisible();
    await this.fillEditForm(data);
    await this.save();
    await this.waitForUpdateSuccess();
    await this.assertUpdatedValues(userId, data);
  }

  // Delete methods
  async selectUserForDeletion(userId: number) {
    const row = this.page.locator('tr').filter({ 
      has: this.page.getByRole('cell', { name: userId.toString(), exact: true }) 
    });
    await row.getByRole('checkbox').check();
  }

  async selectMultipleUsers(userIds: number[]) {
    for (const userId of userIds) {
      await this.selectUserForDeletion(userId);
    }
  }

  async selectAllUsers() {
    await this.selectAllCheckbox().check();
  }

  async deleteSelectedUsers() {
    await this.deleteSelectedButton().click();
  }

  async deleteUsers(userIds: number[]) {
    await this.selectMultipleUsers(userIds);
    await this.deleteSelectedUsers();
    
    for (const userId of userIds) {
      await this.assertUserDeleted(userId);
    }
  }

  async deleteAllUsers() {
    await this.selectAllUsers();
    await this.deleteSelectedUsers();
    await this.assertAllUsersDeleted();
  }

  async assertUserDeleted(userId: number) {
    await expect(this.page.getByRole('cell', {name: userId.toString(), exact: true })).not.toBeVisible();
  }

  async assertAllUsersDeleted() {
    await expect(this.page.getByText('No Users yet.')).toBeVisible();
  }
}
