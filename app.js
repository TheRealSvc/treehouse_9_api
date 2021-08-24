'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const sequelize = require("./models").sequelize;
const routes = require("./routes");
const compression = require('compression');
const helmet = require('helmet');

// variable to enable global error logging
// Import cors library
const cors = require('cors');
// Enable all CORS Requests
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

//const bodyParser = require('body-parser');

// create the Express app
const app = express();
app.use(helmet()) ;
app.use(compression());
// check connection 
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection successful to database");
    await sequelize.sync();
    console.log("all tables between db and orm synced"); 
  } catch (err) {
    console.log("Failed to connect to database or syncing failed", err);
  }
})();

app.use(cors()); // enables cors "globally" 

// setup morgan which gives us http request logging
app.use(morgan('dev'));

app.use(express.json()) // bodyParser is included here 
// Body parser
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json());

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Add routes.
app.use('/api', routes);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});


// set our port
app.set('port', process.env.PORT || 5000);


// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
