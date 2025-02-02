require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const token = process.env.BOT_TOKEN;
const CHANNEL_USERNAME = '@YousifCoding';
const DEVELOPER_BOT = '@VNN3Bot';
const BOT_USERNAME = '@VNTummyBot'; // TODO: this should be the username of the bot

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
                `لازم تشترك بالقناة ${CHANNEL_USERNAME} قبل ما تگدر تستخدم البوت!`
            );
        }

        const imagePath = getRandomImage();
        await bot.sendPhoto(chatId, imagePath);
        await bot.sendMessage(chatId, 'مبروك تعبئة كرشك 😁، دز /random اذا تريد بعد وحدة!');
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
        "هلو هلو 👋\n\n" +
        "حتى تگدر تستخدم البوت لازم:\n" +
        `1. تشترك بالقناة ${CHANNEL_USERNAME}\n` +
        "2. تدز /random حتى تحصل صور عشوائية\n\n" +
        "مبروك تعبئة كرشك 😁"
    );
});

// '/contact' command handler
bot.onText(/\/contact/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        `تگدر تتواصل وياي عن طريق البوت هذا ${DEVELOPER_BOT}، دزلي اي استفسارات او افكار للبوت هذا حتى اضيفهم، واذا عندك صور تم تعبئة الكرش تحب اضيفهم للبوت هم دزلي!\n\n` +
        `وهاي قناة البرمجة مالتي ${CHANNEL_USERNAME} انشر بيها المشاريع الي اسويهم وآخر التحديثات عليهم`
    );
});

// '/help' command handler
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        "الاوامر المتوفرة: 📌\n\n" +
        "🔹 /start - رسالة الترحيب والتعليمات الاساسية\n" +
        "🔹 /random - يطلعلك صورة عشوائية (لازم تشترك بالقناة)\n" +
        "🔹 /contact - معلومات التواصل وياي\n" +
        "🔹 /help - يطلعلك هاي الرسالة\n\n" +
        "📱 شلون تستخدم البوت بالخاص:\n" +
        "بس دز اي امر من الاوامر فوك\n\n" +
        "👥 شلون تستخدم البوت بالگروبات:\n" +
        "1. حط '@' و يوزر البوت بعد الامر (مثال: /random" + BOT_USERNAME + ")\n" +
        "2. البوت يرد بس اذا:\n" +
        "   • تسوي منشن " + BOT_USERNAME + "\n" +
        "   • ترد على رسالة من رسائل البوت\n\n" +
        "⭐️ الشروط:\n" +
        "لازم تشترك بقناة " + CHANNEL_USERNAME + " حتى تگدر تستخدم امر /random"
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
        `هذا البوت مو للسوالف، تگدر تتواصل وياي على ${DEVELOPER_BOT} او دز /random حتى تحصل على صورة`
    );
});
