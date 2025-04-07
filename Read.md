# Appeal System

Проект **Appeal System** предназначен для управления обращениями пользователей в различных статусах (новое, в работе, завершённое, отменённое). Система предоставляет REST API для создания и обработки обращений, а также взаимодействия с базой данных через Prisma ORM.

## Описание

Проект состоит из двух частей:
1. **Backend** — сервер на Express.js, использующий Prisma ORM для взаимодействия с базой данных PostgreSQL.
2. **Frontend** — интерфейс на React для взаимодействия с API сервера.

## Установка

### Шаг 1: Клонировать репозиторий

```bash
git clone https://github.com/your-username/appeal-system.git
cd appeal-system
```

### Шаг 2: Установка зависимостей
Перейди в директории backend и frontend и установи зависимости с помощью pnpm:

#### Для Backend:

```bash
cd backend
pnpm install
```

#### Для Frontend:

```bash
cd frontend
pnpm install
```

### Шаг 3: Настройка базы данных

1. Убедись, что PostgreSQL установлен и запущен на локальном сервере или в Docker.
2. Создай базу данных для проекта, например, appeal_system
3. Создай .env, содержащий DATABASE_URL
4. Выполни миграции для создания необходжимых таблиц в БД

```bash
cd backend
pnpm prisma migrate dev --name init
```

### Шаг 4: Запуск серверной части

```bash
cd backend
pnpm start
```

### Шаг 5: Запуск клиентской части
В директории frontend запусти клиентскую часть:
```bash
cd frontend
pnpm run dev
```
Клиент будет доступен по адресу: http://localhost:3000.