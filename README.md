# @qkogarashi/pagination

Модуль пагинации для Discord.js v14 и DiscordX, который позволяет легко создавать интерактивные сообщения с навигацией по страницам.

[![npm version](https://img.shields.io/npm/v/@qkogarashi/pagination.svg)](https://www.npmjs.com/package/@qkogarashi/pagination)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Особенности

- 🚀 Поддержка Discord.js v14 и DiscordX
- 📑 Два типа пагинации: кнопки и выпадающее меню
- 🔧 Полностью настраиваемый интерфейс
- 🔄 Динамическая генерация страниц
- ⚡ Простой и удобный API
- 📦 Поддержка TypeScript

## Установка

```bash
npm install @qkogarashi/pagination
# или
yarn add @qkogarashi/pagination
# или
pnpm add @qkogarashi/pagination
```

## Использование

### Базовый пример с кнопками

```typescript
import { Pagination, PaginationType } from '@qkogarashi/pagination';
import { EmbedBuilder } from 'discord.js';

// Создание эмбедов для страниц
const pages = [
  { embeds: [new EmbedBuilder().setTitle('Страница 1').setDescription('Содержимое страницы 1')] },
  { embeds: [new EmbedBuilder().setTitle('Страница 2').setDescription('Содержимое страницы 2')] },
  { embeds: [new EmbedBuilder().setTitle('Страница 3').setDescription('Содержимое страницы 3')] },
];

// Создание пагинации с кнопками
const pagination = new Pagination(
  interaction, // CommandInteraction, ContextMenuCommandInteraction, MessageComponentInteraction или Message
  pages,
  {
    type: PaginationType.Button, // Тип пагинации: кнопки
    time: 60000, // Время ожидания в миллисекундах (по умолчанию 5 минут)
    enableExit: true, // Включить кнопку выхода
    ephemeral: false, // Эфемерное сообщение (только для взаимодействий)
    initialPage: 0, // Начальная страница (по умолчанию 0)
  }
);

// Запуск пагинации
await pagination.start();
```

### Пример с выпадающим меню

```typescript
import { Pagination, PaginationType } from '@qkogarashi/pagination';
import { EmbedBuilder } from 'discord.js';

// Создание эмбедов для страниц
const pages = [
  { embeds: [new EmbedBuilder().setTitle('Страница 1').setDescription('Содержимое страницы 1')] },
  { embeds: [new EmbedBuilder().setTitle('Страница 2').setDescription('Содержимое страницы 2')] },
  { embeds: [new EmbedBuilder().setTitle('Страница 3').setDescription('Содержимое страницы 3')] },
];

// Создание пагинации с выпадающим меню
const pagination = new Pagination(
  interaction,
  pages,
  {
    type: PaginationType.StringSelectMenu, // Тип пагинации: выпадающее меню
    pageText: 'Страница {page}', // Текст для страниц в меню
    placeholder: 'Выберите страницу', // Текст-подсказка для меню
    enableExit: true, // Включить опцию выхода
    labels: {
      start: 'В начало',
      end: 'В конец',
      exit: 'Закрыть',
    },
  }
);

// Запуск пагинации
await pagination.start();
```

### Динамическая генерация страниц

```typescript
import { Pagination, PaginationResolver, PaginationType } from '@qkogarashi/pagination';
import { EmbedBuilder } from 'discord.js';

// Создание резолвера для динамической генерации страниц
const resolver = new PaginationResolver(
  async (page) => {
    // Здесь можно выполнить асинхронные операции, например, запрос к базе данных
    return {
      embeds: [
        new EmbedBuilder()
          .setTitle(`Динамическая страница ${page + 1}`)
          .setDescription(`Это динамически сгенерированная страница ${page + 1}`)
      ]
    };
  },
  10 // Общее количество страниц
);

// Создание пагинации с динамическим резолвером
const pagination = new Pagination(
  interaction,
  resolver,
  {
    type: PaginationType.Button,
    enableExit: true,
  }
);

// Запуск пагинации
await pagination.start();
```

## API

### Класс `Pagination`

Основной класс для создания пагинации.

```typescript
constructor(
  sendTo: PaginationSendTo,
  pages: PaginationItem[] | PaginationResolver,
  config?: PaginationOptions
)
```

#### Параметры:

- `sendTo`: Место, куда отправить пагинацию (CommandInteraction, ContextMenuCommandInteraction, MessageComponentInteraction, Message или TextBasedChannel)
- `pages`: Массив страниц или резолвер для динамической генерации
- `config`: Настройки пагинации

#### Методы:

- `start()`: Запускает пагинацию и отправляет сообщение
- `getPage(page: number)`: Получает страницу по номеру

### Интерфейс `PaginationOptions`

Настройки пагинации.

#### Общие параметры:

- `type`: Тип пагинации (PaginationType.Button или PaginationType.StringSelectMenu)
- `time`: Время ожидания в миллисекундах (по умолчанию 5 минут)
- `enableExit`: Включить кнопку/опцию выхода
- `ephemeral`: Эфемерное сообщение (только для взаимодействий)
- `initialPage`: Начальная страница (по умолчанию 0)
- `showStartEnd`: Показывать кнопки/опции начала и конца (по умолчанию true)
- `onTimeout`: Функция обратного вызова при истечении времени ожидания
- `debug`: Включить отладочные сообщения

#### Параметры для кнопок (PaginationType.Button):

- `start`: Настройки кнопки "В начало"
- `end`: Настройки кнопки "В конец"
- `next`: Настройки кнопки "Вперед"
- `previous`: Настройки кнопки "Назад"
- `exit`: Настройки кнопки "Выход"

#### Параметры для выпадающего меню (PaginationType.StringSelectMenu):

- `pageText`: Текст для страниц в меню
- `placeholder`: Текст-подсказка для меню
- `menuId`: Пользовательский ID для меню
- `labels`: Настройки текста для опций "В начало", "В конец" и "Выход"

## Лицензия

[MIT](./MIT-LICENCE)

## Авторы

- [qKogarashi](https://github.com/qKogarashi)
- [Vijay Meena](https://github.com/vijayymmeena)
