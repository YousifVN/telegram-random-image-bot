# Telegram Random Image Bot

A Telegram bot that sends random images to users who are subscribed to a specific channel. Built with Node.js and the `node-telegram-bot-api` library.

## Features

- Sends random images from a local directory
- Requires channel subscription to use `/random` command
- Supports both private chats and group interactions
- Command system with help menu
- Arabic language interface

## Prerequisites

- Node.js 16 or higher
- A Telegram Bot Token (from [@BotFather](https://t.me/BotFather))
- A Telegram channel where the bot is admin

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YousifVN/telegram-random-image-bot.git
cd telegram-random-image-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the project root:
```
BOT_TOKEN=your_bot_token_here
```

4. Create an images directory in the project root and add your images:
```bash
mkdir images
# Add your .jpg, .jpeg, or other image files to this directory
```

5. Update the constants in bot.js:
```javascript
const CHANNEL_USERNAME = '@YourChannel';
const DEVELOPER_BOT = '@YourDevBot';
const BOT_USERNAME = '@YourBot';
```

## Usage

Start the bot:
```bash
npm start
```

### Available Commands

- `/start` - Welcome message and basic instructions
- `/random` - Get a random image (requires channel subscription)
- `/contact` - Get developer contact information
- `/help` - Display help message with all commands

## Customization

### Adding New Commands

Add new commands by following this pattern in bot.js:

```javascript
bot.onText(/\/yourcommand/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Your response here');
});
```

### Changing Images

Simply add or remove images from the images directory. Supported formats:
- JPG/JPEG
- PNG
- Other formats supported by Telegram

## Project Structure

```
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── bot.js                 # Main bot logic
├── package.json           # Project dependencies
└── images/                # Directory for random images
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request