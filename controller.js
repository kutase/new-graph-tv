'use strict';

var Promise = require('bluebird'),
    request = Promise.promisifyAll(require('request')),
    cheerio = require('cheerio'),
    mongoose = Promise.promisifyAll(require('mongoose')),
    http = require('http');

var Series = mongoose.model('Series');

exports.find_tv = Promise.coroutine(function *(req, res, next) {
  var name = req.body.name;
  var id = req.body.id;
  name = name.trim().replace(/ +/g, '+'); // 'true detective' -> 'true+detective'
  try {
    var data = yield request.getAsync(`http://www.omdbapi.com/?t=${name}&type=series`); //http://www.omdbapi.com/?t=true+detective
  } catch (err) {
    console.error(err);
    return next(err);
  }
  data = JSON.parse(data[0].body);
  if (['series', 'mini-series'].indexOf(data.Type) == -1) {
    data = { Response: 'False', text: name };
  }

  return res.json(data);
})

exports.get_tv = Promise.coroutine(function *(req, res, next) {
  var id = req.params.id;
  try {
    var data = yield request.getAsync(`http://www.omdbapi.com/?i=${id}`); //http://www.omdbapi.com/?t=true+detective
  } catch (err) {
    console.error(err);
    return next(err);
  }
  data = JSON.parse(data[0].body);
  if (['series', 'mini-series'].indexOf(data.Type) == -1) {
    data = { Response: 'False', text: name };
  }

  return res.json(data);
})

exports.get_ratings = Promise.coroutine(function *(req, res, next) {
  var imdbId = req.params.id;
  var ratings = yield Series.findOneAsync({seriesId: imdbId});

  if (ratings == null) {
    ratings = [];
    try {
      var data = yield request.getAsync(`http://www.imdb.com/title/${imdbId}/epdate?ref_=ttep_ql_3`);
    } catch (err) {
      console.error(err.stack);
      return next(err);
    }

    var $ = cheerio.load(data[0].body);

    var table = $($($('table')[0]).find('tr'));
    table.each(function (index) {
      if (index !== 0) {
        var items = $(this).find('td');
        ratings.push({
          number: $(items[0]).text(),
          imdbHref: `http://www.imdb.com${$(items[1]).find('a').attr('href')}`,
          name: $(items[1]).text(),
          rating: $(items[2]).text(),
          votes: $(items[3]).text()
        })
      }
    });
    console.log(ratings, ratings[0])

    ratings = yield Series.createAsync({seriesId: imdbId, ratings: ratings});
  }

  var sorted_ratings = [];
  for (let ep of ratings.ratings) {
    let epNum = ep.number.match(/(\d)+/g);
    if (epNum && epNum[1] != 0) {
      epNum = epNum.map(x => parseInt(x, 10));
      ep.number = epNum[1];
      if (!sorted_ratings[epNum[0]-1]) {
        sorted_ratings[epNum[0]-1] = [];
        sorted_ratings[epNum[0]-1].push(ep);
      } else {
        sorted_ratings[epNum[0]-1].push(ep);
      }
    }
  }

  res.json(sorted_ratings);
})