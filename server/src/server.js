const Config = require('./utils/config');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const DBMigrate = require('db-migrate');

let dbConfig = {
  dev: {
    user: Config.DB_USER,
    host: Config.HOST,
    database: Config.DB_NAME,
    password: Config.DB_PASSWORD,
    port: Config.DB_PORT,
    driver: 'pg'
  }
};

const dbmCesar = DBMigrate.getInstance(true, { env: 'dev', config: dbConfig });
let dbStartConfig = dbConfig;
dbStartConfig.dev.database = Config.DB_START_NAME;
const dbmStart = DBMigrate.getInstance(true, { env: 'dev', config: dbStartConfig });

const port = Config.PORT;

app.use(Config.UPLOAD_DIR_EXPOSE, express.static(Config.UPLOAD_DIR));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//user requests
require('./controller/user')(app);
//basic crud controller
require('./controller/account')(app);
require('./controller/game')(app);
require('./controller/genre')(app);
require('./controller/platform')(app);
require('./controller/player')(app);
require('./controller/race')(app);
require('./controller/raceType')(app);
require('./controller/user')(app);
require('./controller/mail')(app);
require('./utils/upload')(app);

app.get('/', (req, res) => {
  res.send('Cesar server running here!');
});

app.get('/api/test', (req, res) => {
  res.send({message: "Caesar API it's working! \o/" });
});

dbmStart.createDatabase("cesar")
.then(function() {
  dbmCesar.up().then(function() {
    app.listen(port, () => {
      console.info(`Listening on port ${port}...`);
      console.info(`Cesar Server started!`)
    })
  }).catch(function (e) {
    console.error(e);
  });
})
.catch(function(e) {
  console.error(e);
  dbmCesar.up().then(function() {
    app.listen(port, () => {
      console.info(`Listening on port ${port}...`);
      console.info(`Cesar Server started!`)
    })
  });
});