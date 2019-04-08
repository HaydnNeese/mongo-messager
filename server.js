var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var path = require("path");
var app = express();

var PORT = process.env.PORT || 3000;

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

//handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local articleDB database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/articleDB";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
//routes
require('./controllers/htmlRoutes')(app);
require('./controllers/scraper')(app);
require("./controllers/articleRoute")(app);
// Start the server
app.listen(PORT, function() {
    console.log(`App running on port ${PORT}
    ----------------------------`);
  });