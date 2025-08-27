import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { Users } from './pages/Users';
import { listUsers } from './data';

// Хук beforeEach для общей настройки перед каждым тестом
test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const mainPage = await loginPage.login('username', 'password');
    await mainPage.assertMainContentLorem();
});

test('Протестировать создание новых пользователей', async ({ page }) => {
    const users = new Users(page);
    await users.openUsers();
    await users.openCreate();
    await users.assertCreateFormVisible();
    await users.expectSaveDisabled();

    const data = { email: 'user@email.ru', firstName: 'First name', lastName: 'Last name' };
    await users.createUser(data);
    await users.assertAlertCreated();
    await users.assertFormValues(data);
});

test('Протестировать просмотр списка пользователей', async ({ page }) => {
    const users = new Users(page);
    await users.openUsers();
    
    // Проверяем количество строк в таблице
    await users.assertTableRowCount(listUsers.length);
    
    // Проверяем содержимое таблицы
    await users.assertTableData(listUsers);
});

test('Проверить, что отображается основная информация о каждом пользователе: электронная почта, имя и фамилия.', async ({ page }) => {
    const users = new Users(page);
    await users.openUsers();

    // Проверяем, что все поля имеют значения
    await users.assertAllFieldsHaveValues();
});

test('Протестировать редактирование информации о пользователях', async ({ page }) => {
    const users = new Users(page);
    await users.openUsers();

    // Редактируем пользователя с id = 1
    const updatedData = { 
        email: 'john@google.com2', 
        firstName: 'John2', 
        lastName: 'Doe2' 
    };
    
    await users.editUser(1, updatedData);

    // Открываем форму редактирования снова для проверки валидации
    await users.openEditUser(1);
    await users.assertEditFormVisible();

    // Очищаем все поля и проверяем валидацию
    await users.clearAllFields();
    await users.save();

    // Проверяем наличие ошибок валидации
    await users.assertFieldRequired('Email');
    await users.assertFieldRequired('First name');
    await users.assertFieldRequired('Last name');
});

test('Проверить валидацию данных при редактировании пользователя, включая проверку корректности ввода электронной почты.', async ({ page }) => {
    const users = new Users(page);
    await users.gotoUser(1);
    
    // Вводим некорректный email и проверяем ошибку
    await users.fillEditForm({ email: 'testmail.ru' });
    await users.save();
    
    // Проверяем сообщение об ошибке формата email
    await users.assertEmailFormatError();
});

test('Протестировать удаление пользователей', async ({ page }) => {
    const users = new Users(page);
    await users.openUsers();

    // Удаляем пользователей с id = 1 и 2
    await users.deleteUsers([1, 2]);
});

test('Протестировать массовое удаление пользователей', async ({ page }) => {
    const users = new Users(page);
    await users.openUsers();
    
    // Удаляем всех пользователей
    await users.deleteAllUsers();
});