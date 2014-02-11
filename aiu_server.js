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

server.on('request', function(req, res) {
	console.log(req.method);
	
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
		res.end(mainPage);
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

server.listen(1337, 'localhost');

console.log("Server running at http://localhost:1337/");
console.log("サーバを終了する際は[ctrl + c]を押してください");
