import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('проверка что приложение рендериться', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  const mainPage = await loginPage.login('username', 'password');
  await mainPage.assertMainContentLorem();
});