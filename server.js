var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser'),
    configureDB = require('./models/settings');

configureDB();

var router = require('./routes');

const PORT = 1337;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.json(err);
  return next();
})

app.use(router);

http.listen(PORT, () => {
  console.log('Listening on port:',PORT);
})