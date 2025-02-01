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

bot.onText(/\/random/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    try {
        const subscribed = await isSubscribed(userId);
        
        if (!subscribed) {
            return bot.sendMessage(
                chatId,
                'Please subscribe to @YousifCoding channel first to use this bot!'
            );
        }

        const imagePath = getRandomImage();
        bot.sendPhoto(chatId, imagePath);
    } catch (error) {
        bot.sendMessage(chatId, 'Sorry, I could not process your request at this time.');
        console.error('Error:', error);
    }
});
