var events = require('events');
var util = require('util');
var fs = require('fs');

function Watcher (watchDir, processedDir) {
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}
util.inherits(Watcher, events.EventEmitter);
Watcher.prototype = new events.EventEmitter();

var watchDir = './watch';
var processedDir = './done';

Watcher.prototype.watch = function () {
    var watcher = this;
    fs.readdir(this.watchDir, function (err, files) {
        console.log('change detected');
        if (err) throw err;
        for (var index in files) {
            console.log('File ' + files[index] + ' being processed');
            watcher.emit('process', files[index]);
        }
    });
};

Watcher.prototype.start = function () {
    var watcher = this;
    fs.watchFile(watchDir, function () {
        console.log('started to watch');
        watcher.watch();
    });
};

var watcher = new Watcher(watchDir, processedDir);
watcher.on('process', function (file) {
    var watchFile = watchDir + '/' + file;
    var processedFile = processedDir + '/' + file.toLowerCase();
    fs.rename(watchFile, processedFile, err => {
        if (err) throw err;
        console.log('File ' + file + ' renamed.');
    })
});

watcher.start();


