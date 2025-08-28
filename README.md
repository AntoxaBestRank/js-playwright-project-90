# JS Playwright Project

Проект для автоматизированного тестирования веб-приложений с использованием Playwright и React.

## 📋 Описание

Этот проект представляет собой комплексное решение для автоматизированного тестирования, включающее:
- **React-приложение** - демонстрационное веб-приложение для Тестирование Канбан-доски
- **Playwright тесты** - набор автоматизированных тестов для различных сценариев

## 🚀 Технологии

- **Frontend**: React 18.2.0 + Vite
- **Тестирование**: Playwright 1.54.2
- **Язык**: TypeScript/JavaScript
- **Сборка**: Vite 7.0.4
- **Линтинг**: ESLint 9.30.1

## 📁 Структура проекта

```
js-playwright-project-90/
├── src/                    # Исходный код React-приложения
│   ├── App.jsx            # Главный компонент приложения
│   ├── main.jsx           # Точка входа
│   └── assets/            # Статические ресурсы
├── tests/                  # Тесты Playwright
│   ├── pages/             # Page Object модели
│   ├── interfaces/         # TypeScript интерфейсы
│   ├── data/              # Тестовые данные
│   ├── bitrix.spec.ts     # Тесты для Bitrix24
│   └── *.spec.ts          # Другие тестовые файлы
├── playwright.config.ts    # Конфигурация Playwright
├── package.json            # Зависимости и скрипты
└── README.md              # Документация
```

## 🛠️ Установка и запуск

### Предварительные требования
- Node.js (версия 18 или выше)
- npm или yarn

### Установка зависимостей
```bash
npm install
```

### Запуск React-приложения
```bash
npm run dev
```
Приложение будет доступно по адресу: http://localhost:5173

### Сборка для продакшена
```bash
npm run build
```

### Предварительный просмотр сборки
```bash
npm run preview
```

## 🧪 Запуск тестов

### Установка браузеров Playwright
```bash
npx playwright install
```

### Запуск всех тестов
```bash
npx playwright test
```

### Запуск тестов в UI режиме
```bash
npx playwright test --ui
```

### Запуск тестов в headed режиме (с видимыми окнами браузера)
```bash
npx playwright test --headed
```

### Запуск конкретного теста
```bash
npx playwright test bitrix.spec.ts
```

### Просмотр отчета о тестах
```bash
npx playwright show-report
```

## 📊 Типы тестов


### 2. Page Object модели
- **LoginPage** - страница авторизации
- **MainPage** - главная страница
- **TasksPage** - страница задач
- **LabelsPage** - страница меток
- **Users** - страница пользователей

### 3. Интерфейсы данных
- **User** - пользователь системы
- **Task** - задача
- **Label** - метка
- **TaskStatus** - статус задачи

## ⚙️ Конфигурация Playwright

Основные настройки в `playwright.config.ts`:
- **Браузер**: Chromium (по умолчанию)
- **Режим**: Headed (окна браузера видимы)
- **Замедление**: 50ms между действиями
- **Параллельность**: Включена для локальной разработки
- **Retry**: 2 попытки на CI

## 🔧 Скрипты npm

- `npm run dev` - запуск dev-сервера
- `npm run build` - сборка проекта
- `npm run lint` - проверка кода ESLint
- `npm run preview` - предварительный просмотр сборки


