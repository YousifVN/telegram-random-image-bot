require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Function to get random image from images directory
function getRandomImage() {
    const imagesDir = path.join(__dirname, 'images');
    const images = fs.readdirSync(imagesDir);
    const randomImage = images[Math.floor(Math.random() * images.length)];
    return path.join(imagesDir, randomImage);
}

// Command handler for random image
bot.onText(/\/random/, (msg) => {
    const chatId = msg.chat.id;
    try {
        const imagePath = getRandomImage();
        bot.sendPhoto(chatId, imagePath);
    } catch (error) {
        bot.sendMessage(chatId, 'Sorry, I could not send an image at this time.');
        console.error('Error:', error);
    }
});
