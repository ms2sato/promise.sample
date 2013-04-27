//@see https://gist.github.com/okapies/5354929


var paths = ['file1.txt', 'file2.txt', 'file3.txt'];

(function(){
	// @see https://github.com/kriszyp/node-promise
	// npm install node-promise
	var promise = require('node-promise'), 
		fsp = require('node-promise/fs-promise.js');
		
	var statsPromises = paths.map(fsp.stat);
	var allPromises = promise.all.apply(this, statsPromises);

	promise.allOrNone(
		statsPromises[0].then(function(stat){
			console.log('1st promise:' + stat.size);
			return stat.size * 5;
		}), 
		allPromises.then(function(results){
	    	console.log('list fs.stat promise');
			console.dir(results);
			return results;
		})
	).then(function(results){
		//results[0] --> stat1.size * 5
		//results[1] --> [stat1, stat2, stat3]

		console.log('finish all: ' + results[0] + ': ' + results[1][1].size);
	}, function(err){
		console.log('something wrong: ' + err);
	});
})();


(function(){

	// npm install async
	var fs = require('fs'),
		async = require('async');

	var file1 = paths.shift();

	async.parallel([
	  function(callback) {
	    fs.stat(file1, function(error, stat) {
	      console.log('1st callback');
	      callback(error, stat.size * 5);
	    });
	  },
	  function(callback) {
	    async.map(paths, fs.stat, function(error, results){
	    	console.log('list fs.stat callback');
			console.dir(results);
			callback(error, results);
	    });
	  }
	], function(err, results) {

		if(err){
			console.log('something wrong: ' + err);
			return;
		}

		//results[0] --> stat1.size * 5
		//results[1] --> [stat2, stat3]
		console.log('finish all: ' + results[0] + ': ' + results[1][0].size);

	});

})()

