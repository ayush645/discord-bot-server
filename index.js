const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Discord bot token (replace with your actual token)
const DISCORD_BOT_TOKEN = 'MTMzMDIzNTk3MDEyOTIzNjAyMQ.GUlSBs.Zm4rM243wnUuHRjWU-PNiiq6yBZ1OZ7eisbpA4'; // Replace with your bot token

// API details
const API_URL = 'http://195.179.229.119/gpt/api.php';
const API_KEY = 'fa46e0a40af5e2847299d27bef9abfad'; // Replace with your actual API key
const DEFAULT_MODEL = 'gpt-3.5-turbo';

// Create a new Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Log the bot in
client.login(DISCORD_BOT_TOKEN);

// Bot is ready
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Respond to religious questions
client.on('messageCreate', async (message) => {
  // Ignore messages from the bot itself
  if (message.author.bot) return;

  // Command to trigger the bot
  if (message.content.startsWith('!ask')) {
    // Extract the question after "!ask"
    const userQuestion = message.content.slice(5).trim();

    if (!userQuestion) {
      return message.reply('Please provide a question after "!ask".');
    }

    try {
      // Make API request
      const response = await axios.get(API_URL, {
        params: {
          prompt: userQuestion,
          api_key: API_KEY,
          model: DEFAULT_MODEL,
        },
      });

      // Log the entire API response to check its structure
      console.log('API Response:', response.data);

      // Extract the response
      let botResponse = response.data.content || 'I could not find an answer to that question.';

      // Split the content into multiple messages if it's too long
      const maxMessageLength = 2000;
      const messages = [];

      while (botResponse.length > maxMessageLength) {
        messages.push(botResponse.slice(0, maxMessageLength));
        botResponse = botResponse.slice(maxMessageLength);
      }

      messages.push(botResponse); // Add the remaining part of the response

      // Send each message separately
      for (const msg of messages) {
        await message.reply(msg);
      }

    } catch (error) {
      console.error('Error fetching response:', error.message);
      message.reply('An error occurred while fetching the answer. Please try again later.');
    }
  }
});
