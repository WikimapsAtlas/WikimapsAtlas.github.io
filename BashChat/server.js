var spawn   = require('child_process').spawn;
var express = require('express');
var app     = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
      var spawn = require('child_process').spawn;
      var myProcess = spawn(__dirname + '/run.sh', [ msg || '' ]);

      io.emit('chat message', msg);

      myProcess.stdout.setEncoding('utf-8');
      myProcess.stdout.on('data', function (data) {
	  io.emit('chat message', data);
      });

      myProcess.stderr.setEncoding('utf-8');
      myProcess.stderr.on('data', function (data) {
	  io.emit('chat message', data);
      });
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
