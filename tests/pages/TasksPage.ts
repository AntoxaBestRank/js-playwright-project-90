import { Page, expect } from '@playwright/test';
import { Task, UserData, TaskStatus, Label } from '../interfaces';

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

  // Filter methods
  async applyAssigneeFilter(user: UserData) {
    await this.page.getByRole('combobox', { name: 'Assignee' }).click();
    await this.page.getByRole('option', { name: user.email }).click();
  }

  async applyStatusFilter(status: TaskStatus) {
    await this.page.getByRole('combobox', { name: 'Status' }).click();
    await this.page.getByRole('option', { name: status.name }).click();
  }

  async applyLabelFilter(label: Label) {
    await this.page.getByRole('combobox', { name: 'Label' }).click();
    await this.page.getByRole('option', { name: label.name }).click();
  }

  async clearAllFilters() {
    await this.page.getByRole('button', { name: 'Add filter' }).click();
    await this.page.getByText('Remove all filters').click();
  }

  // Form interaction methods
  async fillAssignee(user: UserData) {
    await this.page.getByRole('combobox', { name: 'Assignee' }).click();
    await this.page.getByRole('option', { name: user.email }).click();
  }

  async fillTitle(title: string) {
    await this.page.getByRole('textbox', { name: 'Title' }).fill(title);
  }

  async fillContent(content: string) {
    await this.page.getByRole('textbox', { name: 'Content' }).fill(content);
  }

  async fillStatus(status: TaskStatus) {
    await this.page.getByRole('combobox', { name: 'Status' }).click();
    await this.page.getByRole('option', { name: status.name }).click();
  }

  async fillLabel(label: Label) {
    await this.page.getByRole('combobox', { name: 'Label' }).click();
    await this.page.getByRole('option', { name: label.name }).click();
    await this.page.locator('#menu-label_id div').first().click();
  }

  async saveTask() {
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async deleteTask() {
    await this.page.getByRole('button', { name: 'Delete' }).click();
  }

  // Task card methods
  async getTaskCard(taskIndex: number) {
    return this.page.locator('div.MuiCard-root').filter({ hasText: `Index: ${taskIndex}` });
  }

  async clickEditTask(taskIndex: number) {
    const card = await this.getTaskCard(taskIndex);
    await card.getByRole('link', { name: 'Edit' }).click();
  }

  async clickDeleteTask(taskIndex: number) {
    const card = await this.getTaskCard(taskIndex);
    await card.getByRole('link', { name: 'Edit' }).click();
    await this.deleteTask();
  }

  // Assertion methods
  async assertCreateFormVisible() {
    await expect(this.page.getByRole('combobox', { name: 'Assignee' })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Title' })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Content' })).toBeVisible();
    await expect(this.page.getByRole('combobox', { name: 'Status' })).toBeVisible();
    await expect(this.page.getByRole('combobox', { name: 'Label' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Save' })).toBeVisible();
  }

  async assertFormValues(user: UserData, title: string, content: string, status: TaskStatus, label: Label) {
    await expect(this.page.getByRole('combobox', { name: 'Assignee' })).toHaveText(user.email);
    await expect(this.page.getByRole('textbox', { name: 'Title' })).toHaveValue(title);
    await expect(this.page.getByRole('textbox', { name: 'Content' })).toHaveValue(content);
    await expect(this.page.getByRole('combobox', { name: 'Status' })).toHaveText(status.name);
    await expect(this.page.getByRole('combobox', { name: 'Label' })).toHaveText(label.name);
  }

  async assertAllTasksVisible(tasks: Task[]) {

    for (const task of tasks) {
      const card = await this.getTaskCard(task.index);
      await expect(card).toBeVisible();
      await expect(card).toContainText(task.title);
    }
    //как сделать чтобы дождаться появления этих элементов? Если их поставить до цикла, то ошибка!
      const visibleCards = await this.page.locator('div.MuiCard-root').all();
      await expect(visibleCards).toHaveLength(tasks.length);

  }

  async assertFilteredTasksVisible(tasks: Task[]) {
    const visibleCards = await this.page.locator('div.MuiCard-root').all();
    await expect(visibleCards).toHaveLength(tasks.length);

    for (const task of tasks) {
      const card = await this.getTaskCard(task.index);
      await expect(card).toBeVisible();
      await expect(card).toContainText(task.title);
    }
  }

  async assertTasksNotVisible(tasks: Task[]) {
    for (const task of tasks) {
      const card = await this.getTaskCard(task.index);
      await expect(card).not.toBeVisible();
    }
  }

  async assertFiltersCleared() {
    // Проверяем, что поля фильтров не содержат выбранных значений
    const assigneeField = this.page.getByRole('combobox', { name: 'Assignee' });
    const statusField = this.page.getByRole('combobox', { name: 'Status' });
    const labelField = this.page.getByRole('combobox', { name: 'Label' });

    // Проверяем, что поля не содержат текст (пустые или с placeholder)
    await expect(assigneeField).not.toHaveText(/^[a-zA-Z]/);
    await expect(statusField).not.toHaveText(/^[a-zA-Z]/);
    await expect(labelField).not.toHaveText(/^[a-zA-Z]/);
  }

  async assertKanbanColumnsVisible(statuses: TaskStatus[]) {
    for (const status of statuses) {
      await expect(this.page.locator('#main-content')).toContainText(status.name);
    }
  }

  async assertTasksInCorrectColumns(tasks: Task[], statuses: TaskStatus[]) {
    for (const status of statuses) {
      const column = this.page.locator(`[data-rfd-droppable-id="${status.id}"]`);
      await expect(column).toBeVisible();

      const tasksWithStatus = tasks.filter(task => task.status_id === status.id);
      for (const task of tasksWithStatus) {
        await expect(column).toContainText(task.title);
      }
    }
  }

  async dragTaskToColumn(taskId: number, targetStatusId: number) {
    const taskCard = this.page.locator(`[data-rfd-draggable-id="${taskId}"]`);
    const targetColumn = this.page.locator(`[data-rfd-droppable-id="${targetStatusId}"]`);
    await taskCard.dragTo(targetColumn);
  }

  async waitForFiltersApplied() {
    await this.page.waitForTimeout(1000);
  }

  async getVisibleTasksCount() {
    const cards = await this.page.locator('div.MuiCard-root').all();
    return cards.length;
  }
}
