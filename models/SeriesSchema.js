var mongoose = require('mongoose');

var SeriesSchema = new mongoose.Schema({
  exp: Number,
  seriesId: {type: String, unique: true},
  ratings: [{
    number: String,
    name: String,
    rating: String,
    votes: String
  }]
});

module.exports = SeriesSchema;