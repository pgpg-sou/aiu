var fs = require('fs');
var mongodb = require("mongodb");
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var server = http.createServer();
var path = 'index.html';
var mainPage = fs.readFileSync(path);
var mongo_database;
		var postData;


var mongo_server = new mongodb.Server("localhost", 27017);
var database = new mongodb.Db("aiu", mongo_server, { safe: true});

server.on('request', function(req, res) {
	console.log(req.url);

	if(req.method == "POST") {
		var pathname = url.parse(req.url).pathname;
		var query = url.parse(req.url).query;

		req.setEncoding("utf8");
		var buffer="";

		// sample database
		// 0.000277778
		var collection = mongo_database.collection("aiu");
		req.on('data', function(data) {
			buffer += data.toString();
			var ParamsWithValue = querystring.parse(buffer);
			console.log(ParamsWithValue.x);
			console.log(ParamsWithValue.y);
			var x = Number(ParamsWithValue.x);
			var y = Number(ParamsWithValue.y);
			console.log(x + " y = " + y);
			var result = collection.find( { "lat": {$gt: x-0.000277778, $lt: x+0.000277778}, "lon":{$gt: y-0.000277778, $lt: y+0.000277778}});
			result.toArray(function (err, values) {
				postData = values;
				// console.log(postData);
			});
		});
		
		req.addListener("end", function() {
			res.writeHead(200, {"Content-Type": "application/json"});
			console.log(postData);
			res.end(JSON.stringify(postData));
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
