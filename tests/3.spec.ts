import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('авторизация в приложении', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  const mainPage = await loginPage.login('username', 'password');
  await mainPage.assertMainContentLorem();
});

test('выход из приложения', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  const mainPage = await loginPage.login('username', 'password');
  await mainPage.expectProfileButtonVisible();
  const backToLogin = await mainPage.logout();
  await backToLogin.assertSignInButtonVisible();
});