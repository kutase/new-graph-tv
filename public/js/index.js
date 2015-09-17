$(function () {
  var main = function () {
    this.ratings = ko.observableArray([]);
    this.search_tv_text = ko.observable('');
    this.search_tv = () => {
      if (this.search_tv_text() != null) {
        $.post('/find_tv', {name: this.search_tv_text()})
        .done((data) => {
          if (data.Response !== 'False' && data.Type === 'series') {
            this.has_tv_info(true);
            data.imdbHref = 'http://imdb.com/title/'+data.imdbID;
            data.wikiPage = 'https://en.wikipedia.org/wiki/List_of_'+data.Title.replace(/ +/g, '_')+'_episodes';
            data.imdbEpisodes = 'http://www.imdb.com/title/'+data.imdbID+'/episodes';
            data = ko.mapping.fromJS(data);
            this.search_tv_info(data);
          } else {
            this.has_tv_info(false);
          }
        })
        .fail(function (err) {
          console.error(err);
        })
      }
    };
    this.see_ratings = () => {
      pager.navigate(`#!/ratings/${this.search_tv_info().imdbID()}`);
      this.get_ratings();
    };
    this.get_ratings = () => {
      $.get(`/get_ratings/${this.search_tv_info().imdbID()}`)
      .done((data) => {
        this.ratings([]);
        data.forEach((item) => {
          item = ko.mapping.fromJS(item);
          this.ratings.push(item);
        });
        this.ratings(data);
      })
      .fail((err) => {
        console.error(err);
      })
    };
    this.search_tv_info = ko.observable({});
    this.has_tv_info = ko.observable(false);
    this.tv_info_focus = ko.observable(false);
    this.hover_on_info = ko.observable(false);
    this.enableHover = () => {
      // this.tv_info_focus(false);
      this.hover_on_info(true);
    };
    this.disableHover = () => {
      this.hover_on_info(false);
    };
    this.can_watch_info = ko.computed(() => {
      console.log(this.hover_on_info())
      return (this.has_tv_info() && this.tv_info_focus()) || this.hover_on_info();
    })
  }

  var demoGraph = {
    xAxis: {
      min: -0.5,
      max: 5.5
    },
    yAxis: {
      min: 0
    },
    tooltip: {
      useHTML: true,
      formatter: function() {
        if (this.series.options.type === "scatter") {
          return [
            "<b>", this.point.id, "</b>", "<br>",
            this.point.title, "<br>", 
            "Rating: ", this.point.rating, "<br>", 
            "Votes: ", this.point.votes
           ].join("");
        } else if (this.series.options.type === "line") {
          return false;
        }
      }
    },
    title: {
      text: 'Series ratings'
    },
    series: [{
      type: 'line',
      name: 'Season 1',
      data: [[0, 1.11], [5, 5]],
      marker: {
        enabled: false
      },
      states: {
        hover: {
          lineWidth: 0
        }
      },
      enableMouseTracking: false
    }, {
      type: 'scatter',
      name: 'Season 1',
      data: [
        {   
          x: 1,
          y: 1.5,
          imdb_id: '3792838',
          id: 's01e01',
          title: $('<div/>').html('The Western Book of the Dead').text(),
          rating: '8.1',
          votes: '8652'
        }
      ],
      marker: {
        radius: 4
      }
    }]
  }

  $.extend(ko.bindingHandlers, customBindings);
  pager.Href.hash = '#!/';
  var main = new main();
  main.demoGraph = demoGraph;
  pager.extendWithPage(main);
  ko.applyBindings(main, document.body);
  pager.start();
})
