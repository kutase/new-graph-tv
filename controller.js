var Promise = require('bluebird'),
    request = Promise.promisifyAll(require('request'));

exports.find_tv = Promise.coroutine(function *(req, res, next) {
  var name = req.body.name;
  name = name.trim().replace(/ +/g, '+');
  try {
    var data = yield request.getAsync('http://www.omdbapi.com/?t='+name);
  } catch (err) {
    console.error(err)
  }
  data = JSON.parse(data[0].body);

  res.send(data);
})