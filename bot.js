require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// Bot configuration constants
const token = process.env.BOT_TOKEN;
const CHANNEL_USERNAME = '@YousifCoding';
const DEVELOPER_BOT = '@VNN3Bot';
const BOT_USERNAME = '@DemoVNBot'; // TODO: this should be the username of the bot

const bot = new TelegramBot(token, { polling: true });

async function isSubscribed(userId) {
    try {
        const chatMember = await bot.getChatMember(CHANNEL_USERNAME, userId);
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
                `Please subscribe to ${CHANNEL_USERNAME} channel first to use this bot!`
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
        `1. Subscribe to ${CHANNEL_USERNAME} channel\n` +
        "2. Send /random to get random images\n\n" +
        "Enjoy! 😊"
    );
});

// '/contact' command handler
bot.onText(/\/contact/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        `You can contact the developer via his bot ${DEVELOPER_BOT} (send me new messages to add to this bot)\n\n` +
        `This is my coding channel where I post my recent projects and updates ${CHANNEL_USERNAME}`
    );
});

// Handle all other messages
bot.on('message', (msg) => {
    if (!msg.text) return;
    
    const commands = ['/random', '/start', '/contact'];
    const isCommand = commands.some(cmd => 
        msg.text === cmd || msg.text.startsWith(`${cmd}@`)
    );
    
    if (isCommand) return;

    const chatId = msg.chat.id;
    
    // Check if message is in a group
    if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
        // Only respond if bot is mentioned or message is reply to bot's message
        const isBotMentioned = msg.text.includes(BOT_USERNAME);
        const isReplyToBot = msg.reply_to_message && msg.reply_to_message.from.is_bot;
        
        if (!isBotMentioned && !isReplyToBot) return;
    }
    
    bot.sendMessage(
        chatId,
        `This bot isn't for chatting, get in touch with the developer on ${DEVELOPER_BOT} or get a random image by sending /random`
    );
});
