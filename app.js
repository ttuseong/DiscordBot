const Discord = require('discord.js');
const schedule = require('node-schedule');
const config = require('./config.json')

const client = new Discord.Client();
const hook = new Discord.WebhookClient(config.webhookId, config.webhookToken);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  var msgArray = msg.content.split(' ')[0];

  if (msgArray === config.prefix + '도움말') {
    msg.channel.send("일정 추가 방법 : !@일정추가 일정내용/시간/매월 반복");
    msg.channel.send("ex:)!@일정추가 공부 시작/9:30/y");
    msg.channel.send("ex:)!@일정추가 외식/16:00/n");
  } else if(msgArray == config.prefix + '일정추가') {
    addSchedule(msg);
  } else{
    console.log("test");
  }
});

function addSchedule(data){
  var newSchedule = data.content.split("/");
  newSchedule[0] = newSchedule[0].substring(7, newSchedule[0].length);

  if(newSchedule[2] == 'n' || newSchedule[2] == 'N'){
    var now = new Date();
    var time = newSchedule[1].split(":");

    var date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), time[0], time[1], 0);

    const job = schedule.scheduleJob(date, function(){
      data.channel.send(newSchedule[0]);
    });
  } else if(newSchedule[2] == 'y' || newSchedule[2] == 'Y'){
    var time = newSchedule[1].split(":");

    const job = schedule.scheduleJob(time[1] + ' ' + time[0] + ' '+ '* * *', function(){
      data.channel.send(newSchedule[0]);
    });
  } else{
    data.channel.send("반복을 판단하는 곳에 입력을 확인해주세요!");
    return;
  }
}

//훅, 봇이 먼저 메시지를 보냄
//hook.send('hook test');

client.login(config.token);
