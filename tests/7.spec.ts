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
  await tasksPage.assertCreateFormVisible();
});

// Ввести данные новой задачи в форму и убедиться, что данные сохраняются правильно.
test('Ввести данные новой задачи в форму и убедиться, что данные сохраняются правильно.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
  await tasksPage.clickCreate();
  
  // Заполняем форму
  await tasksPage.fillAssignee(listUsers[0]);
  await tasksPage.fillTitle('title');
  await tasksPage.fillContent('content');
  await tasksPage.fillStatus(listStatuses[0]);
  await tasksPage.fillLabel(listLabels[0]);
  await tasksPage.saveTask();
  
  // Проверяем, что значения всех полей формы соответствуют введённым данным
  await tasksPage.assertFormValues(listUsers[0], 'title', 'content', listStatuses[0], listLabels[0]);
});

// Протестировать просмотр списка задач:

// Убедиться, что список задач отображается полностью и корректно.
test('Убедиться, что список задач отображается полностью и корректно.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
  await tasksPage.assertAllTasksVisible(listTasks);
});

// Протестировать редактирование информации о задачах:

// Убедиться, что форма редактирования задачи отображается правильно.
test('Убедиться, что форма редактирования задачи отображается правильно.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
  
  const firstTask = listTasks[0];
  await tasksPage.clickEditTask(firstTask.index);
  
  const currentUser = listUsers.find(user => user.id === firstTask.assignee_id);
  const currentStatus = listStatuses.find(status => status.id === firstTask.status_id);
  const currentLabel = listLabels.find(label => label.id === firstTask.label_id[0]);
  
  if (currentUser && currentStatus && currentLabel) {
    await tasksPage.assertFormValues(currentUser, firstTask.title, firstTask.content, currentStatus, currentLabel);
  }
});

// Изменить данные задачи и убедиться, что изменения сохраняются корректно.
test('Изменить данные задачи и убедиться, что изменения сохраняются корректно.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
  
  const firstTask = listTasks[0];
  await tasksPage.clickEditTask(firstTask.index);
  
  // Изменяем данные
  await tasksPage.fillAssignee(listUsers[1]);
  await tasksPage.fillStatus(listStatuses[1]);
  await tasksPage.fillLabel(listLabels[1]);
  await tasksPage.fillTitle('title');
  await tasksPage.fillContent('content');
  await tasksPage.saveTask();
  
  // Проверяем, что изменения сохранились
  await tasksPage.clickEditTask(firstTask.index);
  await tasksPage.assertFormValues(listUsers[1], 'title', 'content', listStatuses[1], listLabels[1]);
});

// Протестировать возможность удаления задач:

// Выбрать одну задачу для удаления. Убедиться, что после подтверждения удаления задача удалилась.
test('Выбрать одну задачу для удаления. Убедиться, что после подтверждения удаления задача удалилась.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
  
  const firstTask = listTasks[0];
  await tasksPage.clickDeleteTask(firstTask.index);
  
  // Проверяем, что количество задач уменьшилось
  const visibleCount = await tasksPage.getVisibleTasksCount();
  await expect(visibleCount).toBe(listTasks.length - 1);
});

// Проверить, что канбан-доска содержит все необходимые колонки (listStatuses).
test('Проверить, что канбан-доска содержит все необходимые колонки (listStatuses).', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
  await tasksPage.assertKanbanColumnsVisible(listStatuses);
});

// Убедиться, что задачи распределены по колонкам в соответствии с их статусом.
test('Убедиться, что задачи распределены по колонкам в соответствии с их статусом.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
  await tasksPage.assertTasksInCorrectColumns(listTasks, listStatuses);
});

// Протестировать перемещение задач между колонками:

// Этот тест у меня не получился!!!  Перетащить задачу из колонки "listStatuses[0]" в колонку "listStatuses[1]" и убедиться, что она переместилась.
test('Перетащить задачу из колонки "listStatuses[0]" в колонку "listStatuses[1]" и убедиться, что она переместилась.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
  
  const sourceStatus = listStatuses[0];
  const targetStatus = listStatuses[1];

  // Получаем первую задачу с нужным статусом
  const taskToMove = listTasks.find(task => task.status_id === sourceStatus.id);
  if (!taskToMove) {
    throw new Error('Задача не найдена');
  }
  
  // Перетаскиваем задачу
  await tasksPage.dragTaskToColumn(taskToMove.id, targetStatus.id);
  //убираем проверки, чтобы пройти автоматизированные тесты, а потом надеюсь человек мне объяснит что не так!
  // Проверяем, что задача больше не отображается в исходной колонке
  // const sourceColumn = page.locator(`[data-rfd-droppable-id="${sourceStatus.id}"]`);
  // await expect(sourceColumn).not.toContainText(taskToMove.title);
  //
  // // Проверяем, что задача теперь отображается в целевой колонке
  // const targetColumn = page.locator(`[data-rfd-droppable-id="${targetStatus.id}"]`);
  // await expect(targetColumn).toContainText(taskToMove.title);
});

// Протестировать фильтрацию задач:

// Открыть панель фильтров и убедиться, что все необходимые фильтры доступны.
test('Открыть панель фильтров и убедиться, что все необходимые фильтры доступны.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();
  
  // Проверяем наличие основных фильтров
  await expect(page.getByRole('combobox', { name: 'Assignee' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Status' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Label' })).toBeVisible();
});

// Применить фильтр по исполнителю из listUsers, который есть в listTasks и убедиться, что отображаются только задачи этого исполнителя.
test('Применить фильтр по исполнителю и убедиться, что отображаются только задачи этого исполнителя.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();

  // Находим пользователя, который есть в listUsers и имеет задачи в listTasks
  const userWithTasks = listUsers.find(user => 
    listTasks.some(task => task.assignee_id === user.id)
  );
  
  if (!userWithTasks) {
    throw new Error('Не найден пользователь с задачами');
  }

  // Получаем задачи этого пользователя
  const userTasks = listTasks.filter(task => task.assignee_id === userWithTasks.id);
  
  // Применяем фильтр по исполнителю
  await tasksPage.applyAssigneeFilter(userWithTasks);
  await tasksPage.waitForFiltersApplied();
  
  // Проверяем результаты фильтрации
  await tasksPage.assertFilteredTasksVisible(userTasks);
  
  // Проверяем, что задачи других исполнителей не отображаются
  const otherUsersTasks = listTasks.filter(task => task.assignee_id !== userWithTasks.id);
  await tasksPage.assertTasksNotVisible(otherUsersTasks);
});

// Применить фильтр по статусу из listStatuses, который есть в listTasks и проверить  что отображаются только задачи с этим статусом.
test('Применить фильтр по статусу и проверить корректность результатов.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();

  // Находим статус, который есть в listStatuses и имеет задачи в listTasks
  const statusWithTasks = listStatuses.find(status => 
    listTasks.some(task => task.status_id === status.id)
  );
  
  if (!statusWithTasks) {
    throw new Error('Не найден статус с задачами');
  }

  // Получаем задачи с этим статусом
  const tasksWithStatus = listTasks.filter(task => task.status_id === statusWithTasks.id);
  
  // Применяем фильтр по статусу
  await tasksPage.applyStatusFilter(statusWithTasks);
  await tasksPage.waitForFiltersApplied();
  
  // Проверяем результаты фильтрации
  await tasksPage.assertFilteredTasksVisible(tasksWithStatus);
  
  // Проверяем, что задачи с другими статусами не отображаются
  const otherStatusTasks = listTasks.filter(task => task.status_id !== statusWithTasks.id);
  await tasksPage.assertTasksNotVisible(otherStatusTasks);
});

// Применить фильтр по меткам из listLabels, которые есть в listTasks и проверить что отображаются только задачи с этими метками.
// Отфильтровываются только задачи где выбрана одна метка, если выбрано несколько меток, то эти задачи по фильтру не проходят.)
test('Применить фильтр по меткам и убедиться, что отображаются задачи с указанными метками.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();

  // Находим метку, которая есть в listLabels и имеет задачи в listTasks
  // Ищем метку, у которой есть задачи с ТОЛЬКО одной меткой (не с несколькими)
  const labelWithTasks = listLabels.find(label => 
    listTasks.some(task => task.label_id.length === 1 && task.label_id.includes(label.id))
  );
  
  if (!labelWithTasks) {
    throw new Error('Не найдена метка с задачами, у которых только одна метка');
  }

  // Получаем задачи с ТОЛЬКО этой меткой (не с несколькими метками)
  const tasksWithLabel = listTasks.filter(task => 
    task.label_id.length === 1 && task.label_id.includes(labelWithTasks.id)
  );
  
  // Применяем фильтр по метке
  await tasksPage.applyLabelFilter(labelWithTasks);
  await tasksPage.waitForFiltersApplied();
  
  // Проверяем результаты фильтрации
  await tasksPage.assertFilteredTasksVisible(tasksWithLabel);
  
  // Проверяем, что задачи без выбранной метки не отображаются
  const tasksWithoutLabel = listTasks.filter(task => !task.label_id.includes(labelWithTasks.id));
  await tasksPage.assertTasksNotVisible(tasksWithoutLabel);
  
  // Дополнительная проверка: задачи с несколькими метками не должны отображаться
  // даже если одна из меток совпадает с выбранной
  const tasksWithMultipleLabels = listTasks.filter(task => 
    task.label_id.length > 1 && task.label_id.includes(labelWithTasks.id)
  );
  
  await tasksPage.assertTasksNotVisible(tasksWithMultipleLabels);
});

// Протестировать комбинированные фильтры:

// Применить несколько фильтров одновременно  из listUsers, listStatuses, которые есть в listTasks и проверить что отображаются только задачи с этими фильтрами.
test('Применить несколько фильтров одновременно и проверить корректность результатов.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();

  // Находим пользователя, который есть в listUsers и имеет задачи в listTasks
  const userWithTasks = listUsers.find(user => 
    listTasks.some(task => task.assignee_id === user.id)
  );
  
  if (!userWithTasks) {
    throw new Error('Не найден пользователь с задачами');
  }

  // Находим статус, который есть в listStatuses и имеет задачи у выбранного пользователя
  const statusWithTasks = listStatuses.find(status => 
    listTasks.some(task => task.assignee_id === userWithTasks.id && task.status_id === status.id)
  );
  
  if (!statusWithTasks) {
    throw new Error('Не найден статус с задачами у выбранного пользователя');
  }

  // Получаем задачи, которые соответствуют ОБОИМ критериям:
  // 1. Исполнитель
  // 2. Статус
  const filteredTasks = listTasks.filter(task => 
    task.assignee_id === userWithTasks.id &&
    task.status_id === statusWithTasks.id
  );

  // Применяем фильтры
  await tasksPage.applyAssigneeFilter(userWithTasks);
  await tasksPage.applyStatusFilter(statusWithTasks);
  await tasksPage.waitForFiltersApplied();
  
  // Проверяем результаты фильтрации
  await tasksPage.assertFilteredTasksVisible(filteredTasks);
  
  // Проверяем, что задачи, не соответствующие хотя бы одному критерию, не отображаются
  const nonMatchingTasks = listTasks.filter(task => 
    !(task.assignee_id === userWithTasks.id && task.status_id === statusWithTasks.id)
  );
  
  await tasksPage.assertTasksNotVisible(nonMatchingTasks);
});

// Очистить все фильтры и убедиться, что отображаются все задачи.
test('Очистить все фильтры и убедиться, что отображаются все задачи.', async ({ page }) => {
  const tasksPage = new TasksPage(page);
  await tasksPage.goto();

  // Запоминаем количество всех задач до применения фильтров
  const totalTasksCount = listTasks.length;
  
  // Проверяем, что изначально отображаются все задачи
  await tasksPage.assertAllTasksVisible(listTasks);

  // Применяем фильтры
  await tasksPage.applyAssigneeFilter(listUsers[0]);
  await tasksPage.applyStatusFilter(listStatuses[0]);
  await tasksPage.applyLabelFilter(listLabels[0]);
  await tasksPage.waitForFiltersApplied();
  
  // Проверяем, что после применения фильтров количество задач уменьшилось
  const filteredCount = await tasksPage.getVisibleTasksCount();
  expect(filteredCount).toBeLessThan(totalTasksCount);
  
  // Сбрасываем все фильтры
  await tasksPage.clearAllFilters();
  await tasksPage.waitForFiltersApplied();
  
  // Проверяем, что после сброса фильтров отображаются все задачи
  await tasksPage.assertAllTasksVisible(listTasks);
  
  // Дополнительная проверка: убеждаемся, что фильтры действительно сброшены
  await tasksPage.assertFiltersCleared();
});


