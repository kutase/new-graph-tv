var Promise = require('bluebird'),
    request = Promise.promisifyAll(require('request')),
    cheerio = require('cheerio'),
    mongoose = Promise.promisifyAll(require('mongoose'));

var Series = mongoose.model('Series');

exports.find_tv = Promise.coroutine(function *(req, res, next) {
  var name = req.body.name;
  name = name.trim().replace(/ +/g, '+');
  try {
    var data = yield request.getAsync(`http://www.omdbapi.com/?t=${name}`);
  } catch (err) {
    console.error(err)
  }
  data = JSON.parse(data[0].body);
  if (data.Type != 'series') {
    data = {Response: 'False', text: name};
  }

  res.json(data);
})

exports.get_ratings = Promise.coroutine(function *(req, res, next) {
  var imdbId = req.params.id;
  var ratings = yield Series.findOneAsync({seriesId: imdbId});

  if (ratings == null) {
    ratings = [];
    try {
      var data = yield request.getAsync(`http://www.imdb.com/title/${imdbId}/eprate?ref_=ttep_ql_3`);
    } catch (err) {
      console.error(err.stack);
      return next(err);
    }

    $ = cheerio.load(data[0].body);

    var table = $($($('table')[0]).find('tr'));
    table.each(function (index) {
      if (index !== 0) {
        var items = $(this).find('td');
        ratings.push({
          number: $(items[0]).text(),
          name: $(items[1]).text(),
          rating: $(items[2]).text(),
          votes: $(items[3]).text()
        })
      }
    });

    ratings = yield Series.createAsync({seriesId: imdbId, ratings: ratings});
  }

  res.json(ratings.ratings);
})