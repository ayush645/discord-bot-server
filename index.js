const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const express = require('express');
require('dotenv').config();

// Discord bot token (replace with your actual token)
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; // Replace with your bot token
const API_URL = 'https://api.ddc.xiolabs.xyz/v1/chat/completions';
const API_TOKEN = 'Free-For-YT-Subscribers-@DevsDoCode-WatchFullVideo'; // Replace with your actual API token
const DEFAULT_MODEL = 'provider-3/gpt-4o-mini';

// Create a new Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Start Express server to prevent port timeout issues
const app = express();
const PORT = process.env.PORT || 3100; // Use platform-provided port or 3000

app.get('/', (req, res) => {
  res.send('Discord Bot is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Web server is running on port ${PORT}`);
});

// Log the bot in
client.login(DISCORD_BOT_TOKEN);

// Bot is ready
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Respond to religious questions
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!ask')) {
    const userQuestion = message.content.slice(5).trim();
    if (!userQuestion) {
      return message.reply('Please provide a question after "!ask".');
    }

    try {
      const response = await axios.post(
        API_URL,
        {
          model: DEFAULT_MODEL,
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: userQuestion },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        }
      );

      const botResponse =
        response.data.choices[0]?.message?.content || 'I could not find an answer to that question.';
      await message.reply(botResponse);
    } catch (error) {
      console.error('Error fetching response:', error.message);
      message.reply('The server is down. Please try again later.');
    }
  }
});
