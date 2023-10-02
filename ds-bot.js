const Discord = require('discord.js');
const client = new Discord.Client();

const token = 'MTE1ODQzNDIyNjk3OTQ3OTYxMw.GleYrU.R5gXSHx1X10jBH233pTxchZHz5w3jh0YeG4IS8'; 

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (message) => {
  if (message.author.bot || !message.content.toLowerCase().startsWith('hi')) {
    return;
  }
  message.reply('hi');
});

client.login(token);
