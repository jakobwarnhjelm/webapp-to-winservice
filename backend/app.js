///////////////////////////////////////////
// INITIALIZATION
///////////////////////////////////////////

// Start as service

const service = require("os-service");
service.run(function () {
    // Stop request received (i.e. a kill signal on Linux or from the
    // Service Control Manager on Windows), so let's stop!
    console.debug("Stop request"); 
    service.stop(0);
});

//Require dependencies

var express = require('express');
var path = require('path');
var cors = require("cors");
const sqlite3 = require('sqlite3');
const SQLite3 = sqlite3.verbose();
const process = require("process");
const bcrypt = require('bcrypt');
const fs = require("fs");
const { config } = require("process");

//Set constants
const saltRounds = 10;
const port=4000;

//Change working directory
const argv = require('minimist')(process.argv.slice(2));
console.log(argv);

let working_directory = process.cwd();
if (argv.cwd) {
    working_directory = argv.cwd;
    if (working_directory.endsWith('/') || working_directory.endsWith('\\')) {
        working_directory = working_directory.slice(0, -1); //slashes removed
        working_directory = working_directory.removeChars("\"");
    }
    if (working_directory.endsWith('\"')) {
        working_directory = working_directory.slice(0, -1); //double quote removed
    }
}

const wd_old_new= {
  "old_working_directory" :process.cwd(),
  "new_working_directory" : working_directory
};

console.debug("Changing directory to ", working_directory, " from ", process.cwd());
process.chdir(working_directory);
console.debug("Working directory is now ", process.cwd());


//Initialize DB as local file after changing working directory
const dbPath = path.join(process.cwd(),"startups.db");
const db = new SQLite3.Database(dbPath);

const configFilePath=path.join(process.cwd(),"config.txt");




///////////////////////////////////////////
// STANDARD EXPRESS NODEJS APP
///////////////////////////////////////////

//Do SQL INSERT on app boot to get some data in database
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS app_starts (info TEXT)");

  const stmt = db.prepare("INSERT INTO app_starts VALUES (?)");
  let now = Date();
  stmt.run("App started " + now.toString());

  stmt.finalize();
});

//Boilerplate nodejs express app
var app = express();
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", express.static(path.join(__dirname, 'react')));
app.use("/public", express.static(path.join(__dirname, 'public')));

var whitelist = ['http://localhost:3000', 'http://localhost:4000'];
const corsOptions = {
  origin: function (origin, callback) {
      var isWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, isWhitelisted);
  },
  credentials: true
  // credentials: Configures the Access-Control-Allow-Credentials CORS header. 
  //   Set to true to pass the header, otherwise it is omitted.
}

app.use(cors(corsOptions));

app.get('/backend', function(req, res, next) {
  res.render('index', { title: 'Title defined in backend js code' });
});

app.get('/api', function (req, res, next) {
  const not_hashed = 'some_value';
  bcrypt.hash(not_hashed, saltRounds, function (err, hash) {
    res.json({ 
      not_hashed: not_hashed,
      hashed : hash                    
      });
  });

});

app.get('/db_response', function (req, res, next) {
  db.all("SELECT rowid AS id, info FROM app_starts order by rowid desc LIMIT 3", (err, all) => {
    res.json({
      response: all
    });
  });
})

app.get('/config_file', function (req, res, next) {
  //Read config file from working directory
  const config_file = fs.readFileSync(configFilePath, "utf8");
  res.json({"config_txt" : config_file})
});



app.get('/working_directory', function (req, res, next) {
  res.json(wd_old_new)
});


///////////////////////////////////////////
// START LISTENING REQUESTS
///////////////////////////////////////////
app.listen(port);
