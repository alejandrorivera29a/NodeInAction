var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var chatServer = require('./lib/chat_server');

var cache = {};

function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(200, {'Content-Type': mime.lookup(filePath)});
    response.end(fileContents);
}

function serverStatic(response, cache, absPath) {
    if (cache[absPath]) {
        // Si el fichero existe en cache...
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function (exists) {
            // Si el fichero existe en el servidor...
            if (exists) {
                fs.readFile(absPath, function (err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        // Se guarda el fichero en cache
                        cache[absPath] = data;
                        sendFile(response, absPath, cache[absPath]);
                    }
                })
            } else {
                send404(response);
            }
        })
    }
}

var server = http.createServer();
server.on('request', function (request, response) {
    var filePath = false;
    if (request.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + request.url;
    }
    var absPath = './' + filePath;
    serverStatic(response, cache, absPath);
}).listen(3000, function () {
    console.log('Server listening on port 3000.');
});

chatServer.listen(server);