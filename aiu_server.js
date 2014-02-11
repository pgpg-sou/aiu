var fs = require('fs');
var mongodb = require("mongodb");
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var server = http.createServer();
var path = 'index.html';
var mainPage = fs.readFileSync(path);
var mongo_database;

var mongo_server = new mongodb.Server("localhost", 27017);
var database = new mongodb.Db("sample", mongo_server, { safe: true});
var count = 0;

server.on('request', function(req, res) {
	console.log(req.url + " count = " + count);
	count++;

	if(req.method == "POST") {
		var postData;
		var pathname = url.parse(req.url).pathname;
		var query = url.parse(req.url).query;

		req.setEncoding("utf8");
		var data="";

		// sample database
		var collection = mongo_database.collection("sample_coll");
		var result = collection.find({}, {"key1": "value1"});
		result.toArray(function (err, values) {
			console.dir(values);
		});

		req.on("readable", function () {
			data += req.read();
			console.log(data);
		});

		req.addListener("end", function() {
			res.writeHead(200, {"Content-Type": "application/json"});

			var people = [
			  { name: 'Dave', location: 'Atlanta' },
			  { name: 'Santa Claus', location: 'North Pole' },
			  { name: 'Man in the Moon', location: 'The Moon' }
			];

			var peopleJSON = JSON.stringify(people);
			res.end(peopleJSON);
		});
	}

	if(req.url == "/" && req.method=="GET") {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(mainPage);
	} 

    if(req.url.match('.css')) {
        console.log("text/stylesheet")
        res.writeHead(200,
            {'Content-Type': 'text/css; charset=UTF-8'}
            );
		var file_path = require.resolve("." + req.url);
		var file_content = fs.readFileSync(file_path);
		res.end(file_content);
    } else if(req.url.match('.js')) {
        console.log("text/javascript")
        res.writeHead(200,
            {'Content-Type': 'text/javascript; charset=UTF-8'}
            );
		var file_path = require.resolve("." + req.url);
		var file_content = fs.readFileSync(file_path);
		res.end(file_content);
	} else if(req.url.match('.jpg')) {
        console.log("image/jpeg")
        res.writeHead(200,
            {'Content-Type': 'image/jpeg; charset=UTF-8'}
            );
		var file_path = require.resolve("." + req.url);
		var file_content = fs.readFileSync(file_path);
		res.end(file_content);		
	}

});

database.open(function (err, db) {
	if (err) {
		console.log(err);
		return ;
	}
	mongo_database = db;
	console.log("sampledbにアクセスしました");
});

server.listen(1337);

console.log("Server running at http://localhost:1337/");
console.log("サーバを終了する際は[ctrl + c]を押してください");
