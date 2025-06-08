# @qkogarashi/pagination

A pagination module for Discord.js v14 and DiscordX that allows you to easily create interactive messages with page navigation.

[![npm version](https://img.shields.io/npm/v/@qkogarashi/pagination.svg)](https://www.npmjs.com/package/@qkogarashi/pagination)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 Support for Discord.js v14 and DiscordX
- 📑 Two pagination types: buttons and dropdown menu
- 🔧 Fully customizable interface
- 🔄 Dynamic page generation
- ⚡ Simple and user-friendly API
- 📦 TypeScript support

## Installation

```bash
npm install @qkogarashi/pagination
# or
yarn add @qkogarashi/pagination
# or
pnpm add @qkogarashi/pagination
```

## Usage

### Basic Example with Buttons

```typescript
import { Pagination, PaginationType } from '@qkogarashi/pagination';
import { EmbedBuilder } from 'discord.js';

// Create embeds for pages
const pages = [
  { embeds: [new EmbedBuilder().setTitle('Page 1').setDescription('Content of page 1')] },
  { embeds: [new EmbedBuilder().setTitle('Page 2').setDescription('Content of page 2')] },
  { embeds: [new EmbedBuilder().setTitle('Page 3').setDescription('Content of page 3')] },
];

// Create pagination with buttons
const pagination = new Pagination(
  interaction, // CommandInteraction, ContextMenuCommandInteraction, MessageComponentInteraction or Message
  pages,
  {
    type: PaginationType.Button, // Pagination type: buttons
    time: 60000, // Timeout in milliseconds (default is 5 minutes)
    enableExit: true, // Enable exit button
    ephemeral: false, // Ephemeral message (only for interactions)
    initialPage: 0, // Initial page (default is 0)
  }
);

// Start pagination
await pagination.start();
```

### Example with Dropdown Menu

```typescript
import { Pagination, PaginationType } from '@qkogarashi/pagination';
import { EmbedBuilder } from 'discord.js';

// Create embeds for pages
const pages = [
  { embeds: [new EmbedBuilder().setTitle('Page 1').setDescription('Content of page 1')] },
  { embeds: [new EmbedBuilder().setTitle('Page 2').setDescription('Content of page 2')] },
  { embeds: [new EmbedBuilder().setTitle('Page 3').setDescription('Content of page 3')] },
];

// Create pagination with dropdown menu
const pagination = new Pagination(
  interaction,
  pages,
  {
    type: PaginationType.StringSelectMenu, // Pagination type: dropdown menu
    pageText: 'Page {page}', // Text for pages in the menu
    placeholder: 'Select a page', // Placeholder text for the menu
    enableExit: true, // Enable exit option
    labels: {
      start: 'Start',
      end: 'End',
      exit: 'Close',
    },
  }
);

// Start pagination
await pagination.start();
```

### Dynamic Page Generation

```typescript
import { Pagination, PaginationResolver, PaginationType } from '@qkogarashi/pagination';
import { EmbedBuilder } from 'discord.js';

// Create resolver for dynamic page generation
const resolver = new PaginationResolver(
  async (page) => {
    // Here you can perform asynchronous operations, such as database queries
    return {
      embeds: [
        new EmbedBuilder()
          .setTitle(`Dynamic Page ${page + 1}`)
          .setDescription(`This is a dynamically generated page ${page + 1}`)
      ]
    };
  },
  10 // Total number of pages
);

// Create pagination with dynamic resolver
const pagination = new Pagination(
  interaction,
  resolver,
  {
    type: PaginationType.Button,
    enableExit: true,
  }
);

// Start pagination
await pagination.start();
```

## API

### `Pagination` Class

The main class for creating pagination.

```typescript
constructor(
  sendTo: PaginationSendTo,
  pages: PaginationItem[] | PaginationResolver,
  config?: PaginationOptions
)
```

#### Parameters:

- `sendTo`: Where to send the pagination (CommandInteraction, ContextMenuCommandInteraction, MessageComponentInteraction, Message, or TextBasedChannel)
- `pages`: Array of pages or resolver for dynamic generation
- `config`: Pagination settings

#### Methods:

- `start()`: Starts pagination and sends the message
- `getPage(page: number)`: Gets a page by number

### `PaginationOptions` Interface

Pagination settings.

#### Common Parameters:

- `type`: Pagination type (PaginationType.Button or PaginationType.StringSelectMenu)
- `time`: Timeout in milliseconds (default is 5 minutes)
- `enableExit`: Enable exit button/option
- `ephemeral`: Ephemeral message (only for interactions)
- `initialPage`: Initial page (default is 0)
- `showStartEnd`: Show start and end buttons/options (default is true)
- `onTimeout`: Callback function when timeout expires
- `debug`: Enable debug messages

#### Button Parameters (PaginationType.Button):

- `start`: "Start" button settings
- `end`: "End" button settings
- `next`: "Next" button settings
- `previous`: "Previous" button settings
- `exit`: "Exit" button settings

#### Dropdown Menu Parameters (PaginationType.StringSelectMenu):

- `pageText`: Text for pages in the menu
- `placeholder`: Placeholder text for the menu
- `menuId`: Custom ID for the menu
- `labels`: Text settings for "Start", "End", and "Exit" options

## License

[MIT](./MIT-LICENCE)

## Authors

- [qKogarashi](https://github.com/qKogarashi)
- [Vijay Meena](https://github.com/vijayymmeena)
