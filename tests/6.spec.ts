import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { LabelsPage } from './pages/LabelsPage';
import { listLabels } from './data';

// Хук beforeEach для общей настройки перед каждым тестом
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  const mainPage = await loginPage.login('username', 'password');
  await mainPage.assertMainContentLorem();
});

// Протестировать создание новых меток:

// Убедиться, что форма создания метки отображается корректно.
test('Убедиться, что форма создания метки отображается корректно.', async ({ page }) => {
  const labelsPage = new LabelsPage(page);
  await labelsPage.goto();
  await labelsPage.clickCreate();
  await labelsPage.assertCreateFormVisible();
});

// Ввести данные новой метки в форму и убедиться, что данные сохраняются правильно.
test('Ввести данные новой метки в форму и убедиться, что данные сохраняются правильно.', async ({ page }) => {
  const labelsPage = new LabelsPage(page);
  await labelsPage.goto();
  await labelsPage.clickCreate();
  await labelsPage.fillForm('New Label');
  await labelsPage.clickSave();
  await labelsPage.assertFormValues('New Label');
});

// Протестировать просмотр списка меток:

// Убедиться, что список меток отображается полностью и корректно.
test('Убедиться, что список меток отображается полностью и корректно.', async ({ page }) => {
  const labelsPage = new LabelsPage(page);
  await labelsPage.goto();
  await labelsPage.assertTableRowCount(listLabels.length);
  await labelsPage.assertTableContent(listLabels);
});

// Проверить, что отображается основная информация о каждой метке: название и slug.
test('Проверить, что отображается основная информация о каждой метке: название и slug.', async ({ page }) => {
  const labelsPage = new LabelsPage(page);
  await labelsPage.goto();
  await labelsPage.assertRowInfoDisplayed();
});

// Протестировать редактирование информации о метках:

// Убедиться, что форма редактирования метки отображается правильно.
test('Убедиться, что форма редактирования метки отображается правильно.', async ({ page }) => {
  const labelsPage = new LabelsPage(page);
  await labelsPage.goto();
  await labelsPage.clickRowById(1);
  await labelsPage.assertEditFormVisible();
});

// Изменить данные метки и убедиться, что изменения сохраняются корректно.
test('Изменить данные метки и убедиться, что изменения сохраняются корректно.', async ({ page }) => {
  const labelsPage = new LabelsPage(page);
  await labelsPage.goto();
  await labelsPage.clickRowById(1);
  await labelsPage.fillForm('Updated Label');
  await labelsPage.clickSave();
  await labelsPage.assertRowUpdated(1, 'Updated Label');
});

// Протестировать возможность удаления меток:

// Выбрать одну или несколько меток для удаления. Убедиться, что после подтверждения удаления метки удаляются.
test('Выбрать одну или несколько меток для удаления. Убедиться, что после подтверждения удаления метки удаляются.', async ({ page }) => {
  const labelsPage = new LabelsPage(page);
  await labelsPage.goto();
  await labelsPage.selectMultipleRows([1, 2]);
  await labelsPage.clickDelete();
  await labelsPage.assertRowsDeleted([1, 2]);
});

// Протестировать массовое удаление меток:

// Выбрать опцию для выделения всех меток. Убедиться, что все метки выделены.
test('Выбрать опцию для выделения всех меток. Убедиться, что все метки выделены.', async ({ page }) => {
  const labelsPage = new LabelsPage(page);
  await labelsPage.goto();
  await labelsPage.clickSelectAll();
  await labelsPage.assertAllCheckboxesSelected();
});

// Выбрать опцию для удаления всех выбранных меток и убедиться, что они успешно удалены.
test('Выбрать опцию для удаления всех выбранных меток и убедиться, что они успешно удалены.', async ({ page }) => {
  const labelsPage = new LabelsPage(page);
  await labelsPage.goto();
  await labelsPage.clickSelectAll();
  await labelsPage.clickDelete();
  await labelsPage.assertNoLabelsMessage();
});
