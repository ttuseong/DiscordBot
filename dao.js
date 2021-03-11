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
      }
  });

  connection.connect();
};

function insertServer(map){
  request = new Request("insert into serverTB values(NEXT VALUE FOR seq_serverNo, @webhookID, @webhookToken, @serverID);", function(err) {
   if (err) {
     console.log("실패");
     console.log(err);
    } else{
      console.log("성공")
    }
  });

  request.addParameter('webhookID', TYPES.VarChar, map.get("webhookID"));
  request.addParameter('webhookToken', TYPES.VarChar, map.get('webhookToken'));
  request.addParameter('serverID', TYPES.VarChar, map.get('serverID'));


  connection.execSql(request);
}
