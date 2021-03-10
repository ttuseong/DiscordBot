const Discord = require('discord.js');
const schedule = require('node-schedule');
const config = require('./config.json');
const tedious = require('tedious');

const client = new Discord.Client();

const Connection = tedious.Connection;
var Request = tedious.Request;
var TYPES = tedious.TYPES;

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
    msg.channel.send("일정 추가 방법 : !@일정추가 일정내용/시간/매일 반복");
    msg.channel.send("ex:)" + config.prefix + "일정추가 공부 시작/9:30/y");
    msg.channel.send("ex:)" + config.prefix + "일정추가 외식/16:00/n");
  } else if(msgArray == config.prefix + '일정추가') {
    addSchedule(msg);
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

var dbConfig = {
    server: config.dbServer,
    authentication: {
        type: 'default',
        options: {
            userName: config.dbUserName,
            password: config.dbPassWord
        }
    },
    options: {
        encrypt: false,
        database: config.db
    }
};
var connection = new Connection(dbConfig);
connection.on('connect', function(err) {
    if(err){
      throw err;
    }
    console.log("Connected");
    deleteTest();
    // updateTest();
    //insertTest();
  //  selectTest();
});

connection.connect();

function selectTest() {
    request = new Request("select * from test;", function(err) {
    if (err) {
        console.log(err);}
    });
    var result = "";
    request.on('row', function(columns) {
        columns.forEach(function(column) {
          if (column.value === null) {
            console.log('NULL');
          } else {
            result+= column.value + " ";
          }
        });
        console.log(result);
        result ="";
    });

    request.on('done', function(rowCount, more) {
    console.log(rowCount + ' rows returned');
    });
    connection.execSql(request);
}

function insertTest() {
   request = new Request("insert into test values(@Name, @text);", function(err) {
    if (err) {
       console.log(err);}
   });
   request.addParameter('Name', TYPES.Int,23);
   request.addParameter('text', TYPES.VarChar, 'gldlr');

   request.on('row', function(columns) {
       columns.forEach(function(column) {
         if (column.value === null) {
           console.log('NULL');
         } else {
           console.log("Product id of inserted item is " + column.value);
         }
       });
   });
   connection.execSql(request);
}

function updateTest(){
  request = new Request("update test set text = @text where name = @Name;", function(err) {
   if (err) {
      console.log(err);}
  });
  request.addParameter('Name', TYPES.Int, 5);
  request.addParameter('text', TYPES.VarChar, '성공쓰');

  request.on('row', function(columns) {
      columns.forEach(function(column) {
        if (column.value === null) {
          console.log('NULL');
        } else {
          console.log("Product id of inserted item is " + column.value);
        }
      });
  });
  connection.execSql(request);
}

function deleteTest(){
  request = new Request("delete from test where name = @Name;", function(err) {
   if (err) {
      console.log(err);}
  });
  request.addParameter('Name', TYPES.Int, 8);


  request.on('row', function(columns) {
      columns.forEach(function(column) {
        if (column.value === null) {
          console.log('NULL');
        } else {
          console.log("Product id of inserted item is " + column.value);
        }
      });
  });
  connection.execSql(request);
}

client.login(config.token);
