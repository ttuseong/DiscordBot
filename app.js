const Discord = require('discord.js');
const config = require('./config.json')

const client = new Discord.Client();
const hook = new Discord.WebhookClient(config.webhookId, config.webhookToken);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === '하이') {
    //상대방을 태그하고 메시지 전송
    msg.reply('헬로우');
    //상대방 태그 없이 메시지 전송
    msg.channel.send("퐁");
  }
});

//훅, 봇이 먼저 메시지를 보냄
hook.send('hook test');

client.login(config.token);
