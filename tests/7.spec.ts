import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { TasksPage } from './pages/TasksPage';
import { listTasks } from './data';
import { listUsers } from './data';
import { listLabels } from './data';
import { listStatuses } from './data';

// Хук beforeEach для общей настройки перед каждым тестом
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  const mainPage = await loginPage.login('username', 'password');
  await mainPage.assertMainContentLorem();
});

// Протестировать создание новых задач:

// Убедиться, что форма создания задачи отображается корректно.
test('Убедиться, что форма создания задачи отображается корректно.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
  await tasksPage.clickCreate();
    await expect(page.getByRole('combobox', { name: 'Assignee' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Title' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Content' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Status' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Label' })).toBeVisible();
    await expect(page.getByRole('button', {name: 'Save'})).toBeVisible();
});

// Ввести данные новой задачи в форму и убедиться, что данные сохраняются правильно.
test('Ввести данные новой задачи в форму и убедиться, что данные сохраняются правильно.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
  await tasksPage.clickCreate();
    await page.getByRole('combobox', { name: 'Assignee' }).click();
    await page.getByRole('option', { name: listUsers[0].email }).click();
    await page.getByRole('textbox', { name: 'Title' }).fill('title');
    await page.getByRole('textbox', { name: 'Content' }).fill('content');
    await page.getByRole('combobox', { name: 'Status' }).click();
    await page.getByRole('option', { name: listStatuses[0].name }).click();
    await page.getByRole('combobox', { name: 'Label' }).click();
    await page.getByRole('option', { name: listLabels[0].name }).click();
    await page.locator('#menu-label_id div').first().click();
    await page.getByRole('button', { name: 'Save' }).click();
    // Проверяем, что значения всех полей формы соответствуют введённым данным
    await expect(page.getByRole('combobox', { name: 'Assignee' })).toHaveText(listUsers[0].email);
    await expect(page.getByRole('textbox', { name: 'Title' })).toHaveValue('title');
    await expect(page.getByRole('textbox', { name: 'Content' })).toHaveValue('content');
    await expect(page.getByRole('combobox', { name: 'Status' })).toHaveText(listStatuses[0].name);
    await expect(page.getByRole('combobox', { name: 'Label' })).toHaveText(listLabels[0].name);
});

// Протестировать просмотр списка задач:

// Убедиться, что список задач отображается полностью и корректно.
test('Убедиться, что список задач отображается полностью и корректно.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();

  for (const task of listTasks) {
    // Находим карточку, которая содержит название этой задачи
    const card = page.locator('div.MuiCard-root').filter({ hasText: 'Index: ' + task.index });
    
    // Проверяем, что в карточке есть название задачи
    await expect(card).toContainText(task.title);
    // Проверяем, что в карточке есть описание задачи
    await expect(card).toContainText(task.content);
  }

  // Проверяем, что количество карточек задач соответствует количеству задач в списке
  const cards = await page.locator('div.MuiCard-root').all();
  await expect(cards).toHaveLength(listTasks.length);


});


// Протестировать редактирование информации о задачах:

// Убедиться, что форма редактирования задачи отображается правильно.
test('Убедиться, что форма редактирования задачи отображается правильно.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
    const firstTask = listTasks[0];
    const card = page.locator('div.MuiCard-root').filter({ hasText: 'Index: ' + firstTask.index });
    // Определяем title задачи из карточки (элемент с классом MuiTypography-h5)
    const title = await card.locator('.MuiTypography-h5').innerText();
    const description = await card.locator('.MuiTypography-body2').innerText();
    await card.getByRole('link', { name: 'Edit' }).click();
    const currentUser = listUsers.find(user => user.id === firstTask.assignee_id);
    const currentStatus = listStatuses.find(status => status.id === firstTask.status_id);
    const currentLabel = listLabels.find(label => label.id === firstTask.label_id[0]);
    await expect(page.getByRole('combobox', { name: 'Assignee' })).toHaveText(currentUser?.email || '');
    await expect(page.getByRole('textbox', { name: 'Title' })).toHaveValue(title);
    await expect(page.getByRole('textbox', { name: 'Content' })).toHaveValue(description);
    await expect(page.getByRole('combobox', { name: 'Status' })).toHaveText(currentStatus?.name || '');
    await expect(page.getByRole('combobox', { name: 'Label' })).toHaveText(currentLabel?.name || '');
});

// Изменить данные задачи и убедиться, что изменения сохраняются корректно.
test('Изменить данные задачи и убедиться, что изменения сохраняются корректно.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
  const firstTask = listTasks[0];
    const card = page.locator('div.MuiCard-root').filter({ hasText: 'Index: ' + firstTask.index });
    await card.getByRole('link', { name: 'Edit' }).click();
    await page.getByRole('combobox', { name: 'Assignee' }).click();
    await page.getByRole('option', { name: listUsers[1].email }).click();
    await page.getByRole('combobox', { name: 'Status' }).click();
    await page.getByRole('option', { name: listStatuses[1].name }).click();
    await page.getByRole('combobox', { name: 'Label' }).click();
    await page.getByRole('option', { name: listLabels[1].name }).click();
    await page.locator('#menu-label_id div').first().click();
    await page.getByRole('textbox', { name: 'Title' }).fill('title');
    await page.getByRole('textbox', { name: 'Content' }).fill('content');
    await page.getByRole('button', { name: 'Save' }).click();
    const listCard = await page.locator('div.MuiCard-root').filter({ hasText: 'Index: ' + firstTask.index });
    await listCard.getByRole('link', { name: 'Edit' }).click();
    await expect(page.getByRole('combobox', { name: 'Assignee' })).toHaveText(listUsers[1].email);
    await expect(page.getByRole('combobox', { name: 'Status' })).toHaveText(listStatuses[1].name);
    await expect(page.getByRole('combobox', { name: 'Label' })).toHaveText(listLabels[1].name);
    await expect(page.getByRole('textbox', { name: 'Title' })).toHaveValue('title');
    await expect(page.getByRole('textbox', { name: 'Content' })).toHaveValue('content');

});

// Протестировать возможность удаления задач:

// Выбрать одну задачу для удаления. Убедиться, что после подтверждения удаления задача удалилась.
test('Выбрать одну задачу для удаления. Убедиться, что после подтверждения удаления задача удалилась.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
    const firstTask = listTasks[0];
    const card = page.locator('div.MuiCard-root').filter({ hasText: 'Index: ' + firstTask.index });
    await card.getByRole('link', { name: 'Edit' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.locator('div.MuiCard-root')).toHaveCount(listTasks.length - 1);
});



// Проверить, что канбан-доска содержит все необходимые колонки (listStatuses).
test('Проверить, что канбан-доска содержит все необходимые колонки (listStatuses).', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
    // Проверяем, что каждая колонка из listStatuses отображается на канбан-доске
    for (const status of listStatuses) {
      await expect(page.locator('#main-content')).toContainText(status.name);
    }
});

// Убедиться, что задачи распределены по колонкам в соответствии с их статусом.
test('Убедиться, что задачи распределены по колонкам в соответствии с их статусом.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
  // Для каждой колонки статуса проверяем, что задачи с этим статусом действительно находятся в соответствующей колонке
  for (const status of listStatuses) {
    // Находим колонку по имени статуса
    const column = page.locator(`[data-rfd-droppable-id="${status.id}"]`);
    await expect(column).toBeVisible();

    // Получаем задачи, которые должны быть в этой колонке
    const tasksWithStatus = listTasks.filter(task => task.status_id === status.id);

    // Проверяем, что каждая задача с этим статусом отображается в колонке
    for (const task of tasksWithStatus) {
      await expect(column).toContainText(task.title);
    }
  }

});

// Протестировать перемещение задач между колонками:

// Перетащить задачу из колонки "listStatuses[0]" в колонку "listStatuses[1]" и убедиться, что она переместилась.
test('Перетащить задачу из колонки "listStatuses[0]" в колонку "listStatuses[1]" и убедиться, что она переместилась.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
  // Находим первую задачу в первой колонке (listStatuses[0])
  const sourceStatus = listStatuses[0];
  const targetStatus = listStatuses[1];

  // Получаем первую задачу с нужным статусом
  const taskToMove = listTasks.find(task => task.status_id === sourceStatus.id);

  // Находим карточку
    const taskCard = page.locator(`[data-rfd-draggable-id="${taskToMove.id}"]`);
  //исходная колонка
    const sourceColumn = page.locator(`[data-rfd-droppable-id="${sourceStatus.id}"]`);
  // Находим целевую колонку
  const targetColumn = page.locator(`[data-rfd-droppable-id="${targetStatus.id}"]`);

  // Перетаскиваем карточку задачи в целевую колонку
    const source = await sourceColumn.boundingBox();
    const target = await targetColumn.boundingBox();
    await page.mouse.move(source.x + source.width / 2, source.y + source.height / 2);
    await page.mouse.down();
    await page.mouse.move(target.x + target.width / 2, target.y + target.height / 2);
    await page.mouse.up();
  //await taskCard.dragTo(targetColumn);
  page.waitForTimeout(10000);
  // Проверяем, что задача больше не отображается в исходной колонке
  await expect(sourceColumn).not.toContainText('Index: ' + taskToMove.index);

  // Проверяем, что задача теперь отображается в целевой колонке
  await expect(targetColumn).toContainText('Index: ' + taskToMove.index);

});

// Перетащить задачу из колонки "In Progress" в колонку "Done" и проверить обновление статуса.
test('Перетащить задачу из колонки "In Progress" в колонку "Done" и проверить обновление статуса.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();

});

// Протестировать фильтрацию задач:

// Открыть панель фильтров и убедиться, что все необходимые фильтры доступны.
test('Открыть панель фильтров и убедиться, что все необходимые фильтры доступны.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
  const assignee = await page.getByRole('combobox', { name: 'Assignee' });
  // Проверяем наличие основных фильтров
  await expect(assignee).toBeVisible();
  const status = await page.getByRole('combobox', { name: 'Status' });
  await expect(status).toBeVisible();
  const label = await page.getByRole('combobox', { name: 'Label' });
  await expect(label).toBeVisible();
});

// Применить фильтр по исполнителю и убедиться, что отображаются только задачи этого исполнителя.
test('Применить фильтр по исполнителю и убедиться, что отображаются только задачи этого исполнителя.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();

});

// Применить фильтр по статусу и проверить корректность результатов.
test('Применить фильтр по статусу и проверить корректность результатов.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();

});

// Применить фильтр по меткам и убедиться, что отображаются задачи с указанными метками.
test('Применить фильтр по меткам и убедиться, что отображаются задачи с указанными метками.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();

});





// Протестировать комбинированные фильтры:

// Применить несколько фильтров одновременно и проверить корректность результатов.
test('Применить несколько фильтров одновременно и проверить корректность результатов.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();

});

// Очистить все фильтры и убедиться, что отображаются все задачи.
test('Очистить все фильтры и убедиться, что отображаются все задачи.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();

});
// Протестировать переключение между представлениями:

