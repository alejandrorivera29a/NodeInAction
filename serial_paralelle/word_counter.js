var fs = require('fs');
var completedTasks = 0;
var tasks = [];
var wordCounts = {};
var filesDir = './serial_paralelle/word_counter_files'
var delay = 0;

// Paralelle flow control
console.log(alb);

function checkIfComplete() {
    completedTasks++;
    if(completedTasks == tasks.length) {
        for(var i in wordCounts) {
            console.log(i + ': ' + wordCounts[i]);
        }
    }    
}

function countWordsInText(text) {
    var words = text.toString()
                    .toLowerCase()
                    .split(/\W+/)
                    .sort();
    for(var i in words) {
        var word = words[i];
        if(word) {
            wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
        }
    }
}

fs.readdir(filesDir, function(err, files) {
    if(err) throw err;
    for(var i in files) {
        var task = (function(file) {
            return function() {
                fs.readFile(file, function(err, text) {
                    if(err) throw err;
                    countWordsInText(text);
                    checkIfComplete();
                });
            }
        })(filesDir + '/' + files[i]);
        var task = (function(file) {
            return function() { 
                delay += 1000;
                setTimeout(function() {
                    fs.readFile(file, function(err, text) {
                        if(err) throw err;
                        countWordsInText(text);
                        checkIfComplete();
                    })}, delay);
            }
        })(filesDir + '/' + files[i]);
        tasks.push(task);
    }
    for(var task in tasks) {
        tasks[task]();
    }
});
