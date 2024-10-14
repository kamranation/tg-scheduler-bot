// api/bot.js

// Suppress only the punycode deprecation warning
const originalEmitWarning = process.emitWarning;
process.emitWarning = (warning, type, ...args) => {
  if (type === 'DeprecationWarning' && warning.includes('punycode')) {
    return;
  }
  return originalEmitWarning(warning, type, ...args);
};

const { Telegraf } = require("telegraf");
const { db } = require("../firebaseConfig");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  const messageText = ctx.message.text || ""; 
  const referrerId = messageText.includes("ref_") ? messageText.split(" ")[1]?.replace("ref_", "") : null;
  const userId = ctx.from.id.toString();
  if (referrerId) {
    ctx.reply(`Welcome! You were referred by user ID: ${referrerId}`);
  } else {
    ctx.reply("Bota xoş gəlmisiniz! Cədvəlinizi paylaşmaq üçün /share_schedule istifadə edin.");
  }
});

bot.command("share_schedule", (ctx) => {
  const referrerId = ctx.from.id;
  const miniAppLink = `https://t.me/tg_scheduler_bot/tg_scheduler_app?start=ref_${referrerId}`;
  ctx.reply(`Bu linkdən istifadə edərək cədvəlinizi paylaşın: ${miniAppLink}`);
});

// Function to handle the webhook request
module.exports = async (req, res) => {
  // Parse the body as JSON
  let update;
  if (req.body) {
    update = req.body;
  } else {
    // For Vercel compatibility, explicitly parse the incoming data
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks).toString();
    update = JSON.parse(rawBody);
  }

  // Handle the parsed update
  try {
    await bot.handleUpdate(update);
    res.status(200).send("OK");
  } catch (error) {
    console.error("Error handling update:", error);
    res.status(500).send("Internal Server Error");
  }
};
