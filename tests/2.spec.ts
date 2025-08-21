import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('�������� ��� ���������� �����������', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  const mainPage = await loginPage.login('username', 'password');
  await mainPage.assertMainContentLorem();
});