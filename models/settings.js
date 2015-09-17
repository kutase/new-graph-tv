var mongoose = require('mongoose'),
    SeriesSchema = require('./SeriesSchema');

// configure mongoose schemas
var configure = () => {
  mongoose.model('Series', SeriesSchema);
  mongoose.connect('mongodb://127.0.0.1/ngtv');
}

module.exports = configure;