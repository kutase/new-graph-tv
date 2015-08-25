define(['jquery', 'knockout', 'ko_mapping'], function ($, ko) {
  return function () {
    var self = this;
    self.search_tv_text = ko.observable('');
    self.search_tv = function () {
      if (self.search_tv_text() != null) {
        $.post('/find_tv', {name: self.search_tv_text()})
        .done(function (data) {
          console.log(data)
          if (data.Response != 'False' && data.Type == 'series') {
            self.has_tv_info(true);
            data.imdbHref = 'http://imdb.com/title/'+data.imdbID;
            data = ko.mapping.fromJS(data);
            self.search_tv_info(data);
          } else {
            self.has_tv_info(false);
          }
        })
        .fail(function (err) {
          console.error(err);
        })
      }
    }
    self.search_tv_info = ko.observable({});
    self.has_tv_info = ko.observable(false);
  }
})