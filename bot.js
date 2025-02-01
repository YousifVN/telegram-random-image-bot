require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

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

// '/help' command handler
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        "📌 Available Commands:\n\n" +
        "🔹 /start - Welcome message and basic instructions\n" +
        "🔹 /random - Get a random image (requires channel subscription)\n" +
        "🔹 /contact - Get developer contact information\n" +
        "🔹 /help - Show this help message\n\n" +
        "📱 How to use in private chat:\n" +
        "Simply send any of the above commands\n\n" +
        "👥 How to use in groups:\n" +
        "1. Add '@' and bot username after commands (e.g., /random" + BOT_USERNAME + ")\n" +
        "2. The bot only responds when:\n" +
        "   • You mention it using " + BOT_USERNAME + "\n" +
        "   • You reply to one of its messages\n\n" +
        "⭐️ Requirements:\n" +
        "You must be subscribed to " + CHANNEL_USERNAME + " to use the /random command"
    );
});

// Handle all other messages
bot.on('message', (msg) => {
    if (!msg.text) return;
    
    const commands = ['/random', '/start', '/contact', '/help'];
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
