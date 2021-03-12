const Discord = require('discord.js');
const schedule = require('node-schedule');
const config = require('./config.json');
const dao = require('./dao.js');

const client = new Discord.Client();

var map = new Map();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'asdqwe');

  if (!channel) return;

  channel.send(`${member}님 어서오세요!`);
});

client.on('message', msg => {
  var msgArray = msg.content.split(' ')[0];

  if (msgArray === config.prefix + '도움말') {
    msg.channel.send("일정 추가 방법 : "+config.prefix+"일정추가 일정이름/일정내용/시간/매일 반복");
    msg.channel.send("ex:)" + config.prefix + "일정추가 공부시작/야야야야 빨리 공부해라!/9:30/y");
    msg.channel.send("ex:)" + config.prefix + "일정추가 외식/야야야야오늘 외식이다/16:00/n");
    msg.channel.send("일정 삭제 방법 : " + config.prefix +"삭제 일정이름")
  } else if(msgArray == config.prefix + '서버등록'){
    insertServer(msg);
  } else if(msgArray == config.prefix + '일정추가') {
    addSchedule(msg);
  } else if(msgArray == config.prefix + '삭제'){
    deleteSchedule(msg);
  }
});

function insertServer(msg){
  var data = msg.content.split("/");
  var dataMap = new Map();

  data[0] = data[0].substring(7, data[0].length);

  dataMap.set("webhookID", data[0]);
  dataMap.set("webhookToken", data[1]);
  dataMap.set("serverID", msg.guild.id);

  dao.dbConnect(0, dataMap);
}


function addSchedule(msg){
  var newSchedule = msg.content.split("/");
  newSchedule[0] = newSchedule[0].substring(7, newSchedule[0].length);

  var dataMap = new Map();
  dataMap.set("serverID", msg.guild.id);
  dataMap.set("userID", msg.author.id);
  dataMap.set("alarmName", newSchedule[0]);
  dataMap.set("alarmContent", newSchedule[1]);
  dataMap.set("alarmTime", newSchedule[2]);

  var job;

  if(newSchedule[3] == 'n' || newSchedule[3] == 'N'){
    var now = new Date();
    var time = newSchedule[2].split(":");

    var date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), time[0], time[1], 0);

    dataMap.set("roof", 0);

    dao.dbConnect(1, dataMap);

    job = schedule.scheduleJob(date, function(){
      msg.channel.send(newSchedule[1]);
    });
  } else if(newSchedule[3] == 'y' || newSchedule[3] == 'Y'){
    var time = newSchedule[2].split(":");

    dataMap.set("roof", 1);

    dao.dbConnect(1, dataMap);

    job = schedule.scheduleJob(time[1] + ' ' + time[0] + ' '+ '* * *', function(){
      msg.channel.send(newSchedule[1]);
    });
  } else{
    msg.channel.send("반복을 판단하는 곳에 입력을 확인해주세요!");
    return;
  }


  map.set(msg.author.id+newSchedule[0], job);
}

function deleteSchedule(data){
  var key = data.author.id + data.content.substring(5, data.content.length);
  var target = map.get(key);

  if(target == null){
    data.channel.send("삭제할 수 없습니다.");
    return;
  } else{
    target.cancel();
  }
}



client.login(config.token);
