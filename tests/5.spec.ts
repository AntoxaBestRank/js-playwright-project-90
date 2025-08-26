import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { TaskStatusesPage, TaskStatus } from './pages/TaskStatusesPage';

const listStatuses: TaskStatus[] = [
  {
    "id": 1,
    "name": "Draft",
    "slug": "draft",
  },
  {
    "id": 2,
    "name": "To Review",
    "slug": "to_review",
  },
  {
    "id": 3,
    "name": "To Be Fixed",
    "slug": "to_be_fixed",
  },
  {
    "id": 4,
    "name": "To Publish",
    "slug": "to_publish",
  },
  {
    "id": 5,
    "name": "Published",
    "slug": "published",
  }
];

// Хук beforeEach для общей настройки перед каждым тестом
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  const mainPage = await loginPage.login('username', 'password');
  await mainPage.assertMainContentLorem();
});

// Протестировать создание новых статусов:

// Убедиться, что форма создания статуса отображается корректно.
test('Убедиться, что форма создания статуса отображается корректно.', async ({ page }) => {
  const taskStatusesPage = new TaskStatusesPage(page);
  await taskStatusesPage.goto();
  await taskStatusesPage.clickCreate();
  await taskStatusesPage.assertCreateFormVisible();
});

// Ввести данные нового статуса в форму и убедиться, что данные сохраняются правильно.
test('Ввести данные нового статуса в форму и убедиться, что данные сохраняются правильно.', async ({ page }) => {
  const taskStatusesPage = new TaskStatusesPage(page);
  await taskStatusesPage.goto();
  await taskStatusesPage.clickCreate();
  await taskStatusesPage.fillForm('New Status', 'new-status');
  await taskStatusesPage.clickSave();
  await taskStatusesPage.assertFormValues('New Status', 'new-status');
});

// Протестировать просмотр списка статусов:

// Убедиться, что список статусов отображается полностью и корректно.
test('Убедиться, что список статусов отображается полностью и корректно.', async ({ page }) => {
  const taskStatusesPage = new TaskStatusesPage(page);
  await taskStatusesPage.goto();
  await taskStatusesPage.assertTableRowCount(listStatuses.length);
  await taskStatusesPage.assertTableContent(listStatuses);
});

// Проверить, что отображается основная информация о каждом статусе: название и slug.
test('Проверить, что отображается основная информация о каждом статусе: название и slug.', async ({ page }) => {
  const taskStatusesPage = new TaskStatusesPage(page);
  await taskStatusesPage.goto();
  await taskStatusesPage.assertRowInfoDisplayed();
});

// Протестировать редактирование информации о статусах:

// Убедиться, что форма редактирования статуса отображается правильно.
test('Убедиться, что форма редактирования статуса отображается правильно.', async ({ page }) => {
  const taskStatusesPage = new TaskStatusesPage(page);
  await taskStatusesPage.goto();
  await taskStatusesPage.clickRowById(1);
  await taskStatusesPage.assertEditFormVisible();
});

// Изменить данные статуса и убедиться, что изменения сохраняются корректно.
test('Изменить данные статуса и убедиться, что изменения сохраняются корректно.', async ({ page }) => {
  const taskStatusesPage = new TaskStatusesPage(page);
  await taskStatusesPage.goto();
  await taskStatusesPage.clickRowById(1);
  await taskStatusesPage.fillForm('New Status', 'new-status');
  await taskStatusesPage.clickSave();
  await taskStatusesPage.assertRowUpdated(1, 'New Status', 'new-status');
});

// Протестировать возможность удаления статусов:

// Выбрать один или несколько статусов для удаления. Убедиться, что после подтверждения удаления статусы удаляются.
test('Выбрать один или несколько статусов для удаления. Убедиться, что после подтверждения удаления статусы удаляются.', async ({ page }) => {
  const taskStatusesPage = new TaskStatusesPage(page);
  await taskStatusesPage.goto();
  await taskStatusesPage.selectMultipleRows([1, 2]);
  await taskStatusesPage.clickDelete();
  await taskStatusesPage.assertRowsDeleted([1, 2]);
});

// Протестировать массовое удаление статусов:

// Выбрать опцию для выделения всех статусов. Убедиться, что все статусы выделены.
test('Выбрать опцию для выделения всех статусов. Убедиться, что все статусы выделены.', async ({ page }) => {
  const taskStatusesPage = new TaskStatusesPage(page);
  await taskStatusesPage.goto();
  await taskStatusesPage.clickSelectAll();
  await taskStatusesPage.assertAllCheckboxesSelected();
});

// Выбрать опцию для удаления всех выбранных статусов и убедиться, что они успешно удалены.
test('Выбрать опцию для удаления всех выбранных статусов и убедиться, что они успешно удалены.', async ({ page }) => {
  const taskStatusesPage = new TaskStatusesPage(page);
  await taskStatusesPage.goto();
  await taskStatusesPage.clickSelectAll();
  await taskStatusesPage.clickDelete();
  await taskStatusesPage.assertNoStatusesMessage();
});