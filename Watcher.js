var events = require('events');
var util = require('util');
var fs = require('fs');

export function FileWatcher(watchDir, processedDir) {
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}
util.inherits(FileWatcher, events.EventEmitter);

var watch = './watch';
var processedDir = './done';

FileWatcher.prototype.watch = function () {

};

