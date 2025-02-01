require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

async function isSubscribed(userId) {
    try {
        // TODO: Replace the channel username with the coding channel
        const chatMember = await bot.getChatMember('@YousifDiaries', userId);
        return ['member', 'administrator', 'creator'].includes(chatMember.status);
    } catch (error) {
        console.error('Error checking subscription:', error);
        return false;
    }
}

function getRandomImage() {
    const imagesDir = path.join(__dirname, 'images');
    const images = fs.readdirSync(imagesDir);
    const randomImage = images[Math.floor(Math.random() * images.length)];
    return path.join(imagesDir, randomImage);
}

// '/random' command handler
bot.onText(/\/random/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    try {
        const subscribed = await isSubscribed(userId);
        
        if (!subscribed) {
            return bot.sendMessage(
                chatId,
                // TODO: Replace the channel username with the coding channel
                'Please subscribe to @YousifDiaries channel first to use this bot!'
            );
        }

        const imagePath = getRandomImage();
        await bot.sendPhoto(chatId, imagePath);
        await bot.sendMessage(chatId, 'Hope you liked the image! Send /random to get another one 😊');
    } catch (error) {
        bot.sendMessage(chatId, 'Sorry, I could not process your request at this time.');
        console.error('Error:', error);
    }
});

// '/start' command handler
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        "👋 Hi! Welcome to Random Images Bot!\n\n" +
        "To use this bot, you need to:\n" +
        // TODO: Replace the channel username with the coding channel
        "1. Subscribe to @YousifDiaries channel\n" +
        "2. Send /random to get random images\n\n" +
        "Enjoy! 😊"
    );
});

// '/contact' command handler
bot.onText(/\/contact/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        "You can contact the developer via his bot @VNN3Bot (send me new messages to add to this bot)\n\n" +
        "This is my coding channel where I post my recent projects and updates @YousifCoding"
    );
});

// Handle all other messages
bot.on('message', (msg) => {
    // Skip if message is any of the commands
    if (msg.text === '/random' || msg.text === '/start' || msg.text === '/contact') return;
    
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        "This bot isn't for chatting, get in touch with the developer on @VNN3Bot or get a random image by sending /random"
    );
});
