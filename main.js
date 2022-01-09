//This is master branch
var http = require('http');
var net = require('net');
var events = require('events');
var util = require('util');
var channel = new events.EventEmitter();

channel.clients = {};
channel.subscriptions = {};

channel.on('join', function (id, client) {
this.clients[id] = client;
this.subscriptions[id] = function (senderId, message) {
            if (id != senderId) {
                this.clients[id].write(message);
            }            
    };
    this.on('broadcast', this.subscriptions[id]);
});

channel.on('leave', function (id) {
    channel.removeListener('broadcast', this.subscriptions[id]);
    channel.emit('broadcast', id, id + " has left the chat.\n");
});

channel.on('shutdown', function() {
    channel.emit('broadcast', '', 'chat shutdown\n');
    channel.removeAllListeners('broadcast');
});

var server = net.createServer(function (client) {
    var id = client.remoteAddress + ':' + client.remotePort;
    channel.emit('join', id, client);
    client.on('data', function (data) {
        if (data.indexOf('shutdown') == 0) {
            channel.emit('shutdown');
        }
        data = data.toString();
        channel.emit('broadcast', id, data);
    });
    client.on('close', function () {
        channel.emit('leave', id);
    });
});
server.listen(8000);

function Watcher (watchDir, processedDir) {
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}

util.inherits