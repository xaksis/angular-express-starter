var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var path       = require('path');

// routes
var users = require('./routes/users');
var places = require('./routes/places');
var meals = require('./routes/meals');

// constants
var publicDir = __dirname + '/../client/public';

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// static directory
// testing
app.use('/static', express.static(publicDir));

// each module here will handle requests
// relevant to their own shit
app.use('/users', users);
app.use('/places', places);
app.use('/meals', meals);

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.sendFile(path.join(publicDir, '/index.html'));
  });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
