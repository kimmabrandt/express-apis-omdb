var express = require('express');
var bodyParser = require("body-parser"); // Enables us to read post variables
var fs = require("fs"); // Enables us to read from and write to
var ejsLayouts = require("express-ejs-layouts"); // Enables us to use a layout
var request = require("request"); // Enables XMLHttp Requests(e.g. like AJAX). already npm installed

var app = express();

app.use(require('morgan')('dev'));

// Use or Set statements
app.use(bodyParser.urlencoded({ extended: false})); //enables us to read post variables from the req
app.set("view engine", "ejs");
app.use(ejsLayouts);

// Routes defined here

// Pages
app.get('/', function(req, res) {
  res.render('index.ejs');
});

app.get('/results', function(req, res) {
  res.render('results');
});



// Form - add search query to json file
app.post("/", function(req, res){
	// Get the data in data.json
	var fileContents = fs.readFileSync("./data.json");

	// Parse it
	var parsedMovies = JSON.parse(fileContents);

	// Add our new movie to the data
	parsedMovies.push(req.body);

	// Write the data back out (stringify - opposite of parse - parse for storing, stringify for using)
	fs.writeFileSync("./data.json", JSON.stringify(parsedMovies));

	// We need to send a response Let's redirect them to the / page (home page)
	res.redirect("/results");

	// // console.log(req.body);
	// res.send("Success");
});



//Get data from JSON File
app.get("/results", function(req, res){
	// Get data from data.json
	var fileContents = fs.readFileSync("./data.json");

	// Parsing the data into a json format we can understand
	var parsedArticles = JSON.parse(fileContents);

	//Render movies.ejs (inside layouts.js) with the movies object passed to it
	res.render("articles", {articles: parsedArticles})
});



// get results from OMDB 

app.get("/results", function(req, res){
	var searchQuery = {
		s: "star wars"   //what here? 
	};

	request({
		url: "http://www.omdbapi.com",
		qs: searchQuery
	},
	function(error, response, body){
		if(!error && response.statusCode == 200){
			var movieData = JSON.parse(body);
			// res.send(movieData.Search); //result of search
			res.render("results", { movies: movieData.Search }); // use res.render with views. dont need .ejs (its implied)
		}
		else {
			res.send("An error happened: " + error);
		}
	});
});





var server = app.listen(process.env.PORT || 3000);

module.exports = server;
