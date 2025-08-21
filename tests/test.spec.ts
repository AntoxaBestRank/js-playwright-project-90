import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  // ��������� �� ������ ��������
  await page.goto('https://demo.playwright.dev/todomvc/')

  // �������� ����� � ������� ����� ��������
  // ������������ �� DOM �������, � "�������"
  const input = page.getByPlaceholder('What needs to be done?')

  // ��������� � �������� Enter
  const taskName = 'Finish Hexlet\'s course'
  await input.fill(taskName)
  await input.press('Enter')

  // ���������, ��� ������ ��������� � ������ �����
  const item = page.getByTestId('todo-title').filter({ hasText: taskName })
  await expect(item).toBeVisible()
})