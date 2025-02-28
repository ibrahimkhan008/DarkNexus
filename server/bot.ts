import TelegramBot from "node-telegram-bot-api";
import { nanoid } from "nanoid";
import { storage } from "./storage";
import type { InsertUser, InsertNews, InsertGateway } from "@shared/schema";

const ADMIN_CHAT_IDS = process.env.ADMIN_CHAT_IDS?.split(",").map(Number) || [];
const token = process.env.TELEGRAM_BOT_TOKEN || "";

export function startBot() {
  if (!token) {
    console.error("Telegram bot token not found!");
    return;
  }

  const bot = new TelegramBot(token, { polling: true });

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    if (!ADMIN_CHAT_IDS.includes(chatId)) {
      bot.sendMessage(chatId, "Unauthorized. Contact the administrator.");
      return;
    }
    
    bot.sendMessage(chatId, 
      "Welcome to Nezuko Card Checker Admin Panel!\n\n" +
      "Commands:\n" +
      "/genkey - Generate new access key\n" +
      "/revoke <key> - Revoke access key\n" +
      "/addnews <title>|<content> - Add news\n" +
      "/addgateway <name>|<endpoint> - Add gateway\n" +
      "/togglegateway <id> - Toggle gateway status\n" +
      "/addcredits <key> <amount> - Add credits to user"
    );
  });

  // Generate access key
  bot.onText(/\/genkey/, async (msg) => {
    const chatId = msg.chat.id;
    if (!ADMIN_CHAT_IDS.includes(chatId)) return;

    const accessKey = nanoid(10);
    await storage.createUser({
      accessKey,
      credits: 0,
      language: "en"
    });

    bot.sendMessage(chatId, `New access key generated: ${accessKey}`);
  });

  // Revoke access key
  bot.onText(/\/revoke (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (!ADMIN_CHAT_IDS.includes(chatId)) return;
    if (!match) return;

    const key = match[1];
    const success = await storage.revokeAccessKey(key);
    
    bot.sendMessage(chatId, success 
      ? `Access key ${key} revoked successfully`
      : `Access key ${key} not found`
    );
  });

  // Add news
  bot.onText(/\/addnews (.+)\|(.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (!ADMIN_CHAT_IDS.includes(chatId)) return;
    if (!match) return;

    const [_, title, content] = match;
    await storage.addNews({
      title,
      content,
      createdAt: new Date().toISOString()
    });

    bot.sendMessage(chatId, "News added successfully");
  });

  // Add gateway
  bot.onText(/\/addgateway (.+)\|(.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (!ADMIN_CHAT_IDS.includes(chatId)) return;
    if (!match) return;

    const [_, name, endpoint] = match;
    await storage.addGateway({
      name,
      endpoint,
      active: true
    });

    bot.sendMessage(chatId, "Gateway added successfully");
  });

  // Toggle gateway
  bot.onText(/\/togglegateway (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (!ADMIN_CHAT_IDS.includes(chatId)) return;
    if (!match) return;

    const id = parseInt(match[1]);
    const success = await storage.toggleGateway(id);
    
    bot.sendMessage(chatId, success 
      ? `Gateway ${id} status toggled successfully`
      : `Gateway ${id} not found`
    );
  });

  // Add credits
  bot.onText(/\/addcredits (.+) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (!ADMIN_CHAT_IDS.includes(chatId)) return;
    if (!match) return;

    const [_, key, amount] = match;
    const credits = parseInt(amount);
    
    const user = await storage.validateAccessKey(key);
    if (!user) {
      bot.sendMessage(chatId, "User not found");
      return;
    }

    await storage.updateUserCredits(user.id, user.credits + credits);
    bot.sendMessage(chatId, `Added ${credits} credits to user ${key}`);
  });

  console.log("Telegram bot started!");
}
