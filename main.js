// Suppress only the punycode deprecation warning
const originalEmitWarning = process.emitWarning;
process.emitWarning = (warning, type, ...args) => {
  if (type === 'DeprecationWarning' && warning.includes('punycode')) {
    return;
  }
  return originalEmitWarning(warning, type, ...args);
};

// Now the rest of your bot code
const { Telegraf } = require("telegraf");
const { db } = require("./firebaseConfig");

// Replace 'YOUR_BOT_TOKEN' with the actual token from BotFather
const bot = new Telegraf("7807368465:AAEJhDrJHe3RDPtm1m2_XVwewPEwmkI3_qs");

// Command to save referral data
bot.start((ctx) => {
  const messageText = ctx.message.text || ""; // Ensure message text is defined
  const referrerId = messageText.includes("ref_") ? messageText.split(" ")[1]?.replace("ref_", "") : null;
  const userId = ctx.from.id.toString();
  if (referrerId) {
    // Save referral data to Firestore
    // db.collection("referral").add({
    //   referrerId,
    //   userId,
    //   timestamp: admin.firestore.FieldValue.serverTimestamp(),
    // }).then(() => {
    // }).catch(error => {
    //   console.error("Error saving referral data:", error);
    //   ctx.reply("Xəta baş vermişdir (:");
    // });
    ctx.reply(ctx);
  } else {
    ctx.reply("Bota xoş gəlmisiniz! Cədvəlinizi paylaşmaq üçün /share_schedule istifadə edin.");
  }
});

// Command to generate a share link
bot.command("share_schedule", (ctx) => {
  const referrerId = ctx.from.id;
  const miniAppLink = `https://t.me/tg_scheduler_bot/tg_scheduler_app?start=ref_${referrerId}`;
  ctx.reply(`Bu linkdən istifadə edərək cədvəlinizi paylaşın: ${miniAppLink}`);
});

bot.launch();
