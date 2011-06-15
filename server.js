/**
 * Important note: this application is not suitable for benchmarks!
 */

var http = require('http')
  , io = require('socket.io')
  , sys = require(process.binding('natives').util ? 'util' : 'sys')
  , server;
    
server = http.createServer(function(req, res){});

server.listen(8080);

// socket.io, I choose you
// simplest chat application evar
var io = io.listen(server, { origins: '*:*' })
  , buffer = [];
  
io.on('connection', function(client){
  client.send({ buffer: buffer });
  client.broadcast({ announcement: client.sessionId + ' connected' });
  
  client.on('message', function(message){
    var msg = { message: [client.sessionId, message] };
    buffer.push(msg);
    if (buffer.length > 15) buffer.shift();
    client.broadcast(msg);
  });

  client.on('disconnect', function(){
    client.broadcast({ announcement: client.sessionId + ' disconnected' });
  });
});

console.log('Server listen on 8080');
