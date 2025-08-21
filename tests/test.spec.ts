import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  // Переходим на нужную страницу
  await page.goto('https://demo.playwright.dev/todomvc/')

  // Выбираем инпут с которым будем работать
  // Возвращается не DOM элемент, а "локатор"
  const input = page.getByPlaceholder('What needs to be done?')

  // Заполняем и нажимаем Enter
  const taskName = 'Finish Hexlet\'s course'
  await input.fill(taskName)
  await input.press('Enter')

  // Проверяем, что задача появилась в списке задач
  const item = page.getByTestId('todo-title').filter({ hasText: taskName })
  await expect(item).toBeVisible()
})