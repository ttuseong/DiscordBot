const config = require('./config.json');
const tedious = require('tedious');
const Request = tedious.Request;
const TYPES = tedious.TYPES;

const Connection = tedious.Connection;
var connection;

module.exports.dbConnect = function (index, map) {
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

  connection = new Connection(dbConfig);
  connection.on('connect', function(err) {
      if(err){
        throw err;
      }
      console.log("Connected" );
      
      switch(index){
        case 0:
          insertServer(map);
        case 1:
          insertAlarm(map);
      }
  });

  connection.connect();
};

function insertServer(map){
  request = new Request("insert into serverTB values(NEXT VALUE FOR seq_serverNo, @webhookID, @webhookToken, @serverID);", function(err, result) {
   if(err){
     console.log(err);
   }
  });

  request.addParameter('webhookID', TYPES.VarChar, map.get("webhookID"));
  request.addParameter('webhookToken', TYPES.VarChar, map.get('webhookToken'));
  request.addParameter('serverID', TYPES.VarChar, map.get('serverID'));


  connection.execSql(request);
}

function insertAlarm(map){
  request = new Request("insert into alarmTB values((select serverNo from serverTB where serverID  = @serverID), @userID, @alarmName, @alarmContent, @alarmTime, @roof);", function(err, result) {
   if(err){
     console.log(err);
   }
  });

  request.addParameter('serverID', TYPES.VarChar, map.get("serverID"));
  request.addParameter('userID', TYPES.VarChar, map.get('userID'));
  request.addParameter('alarmName', TYPES.VarChar, map.get('alarmName'));
  request.addParameter('alarmContent', TYPES.VarChar, map.get('alarmContent'));
  request.addParameter('alarmTime', TYPES.VarChar, map.get('alarmTime'));
  request.addParameter('roof', TYPES.Int, map.get('roof'));

  connection.execSql(request);
}
