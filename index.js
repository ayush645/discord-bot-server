const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Discord bot token (replace with your actual token)
const DISCORD_BOT_TOKEN = 'MTMzMDIzNTk3MDEyOTIzNjAyMQ.GUlSBs.Zm4rM243wnUuHRjWU-PNiiq6yBZ1OZ7eisbpA4'; // Replace with your bot token

// API details
const API_URL = 'https://api.ddc.xiolabs.xyz/v1/chat/completions';
const API_TOKEN = 'Free-For-YT-Subscribers-@DevsDoCode-WatchFullVideo'; // Replace with your actual API token
const DEFAULT_MODEL = 'provider-3/gpt-4o-mini';

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
    console.log(userQuestion);

    try {
      // Make API request
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
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );

      // Log the entire API response to check its structure
      console.log('API Response:', response.data);

      // Extract the response
      const botResponse =
        response.data.choices[0]?.message?.content ||
        'I could not find an answer to that question.';

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
      message.reply('The server is down. Please try again later.');
    }
  }
});
