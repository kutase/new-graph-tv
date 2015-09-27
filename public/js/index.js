$(function () {
  var main = function () {
    this.isLoading = ko.observable(false);
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
            data.imdbEpisodes = 'http://www.imdb.com/title/'+data.imdbID+'/epdate?ref_=ttep_sa_3';
            data = ko.mapping.fromJS(data);
            this.tv_info({});
            this.tv_info(data);
          } else {
            this.has_tv_info(false);
          }
        })
        .fail(function (err) {
          console.error(err);
        })
      }
    };
    this.get_tv = (done) => {
      $.get(`/get_tv/${window.location.hash.split('/')[2]}`)
      .done((data) => {
        console.log(data)
        if (data.Response !== 'False' && data.Type === 'series') {
          data.wikiPage = 'https://en.wikipedia.org/wiki/List_of_'+data.Title.replace(/ +/g, '_')+'_episodes';
          data = ko.mapping.fromJS(data);
          this.tv_info({});
          this.tv_info(data);
        }
        done && done();
      })
      .fail(function (err) {
        console.error(err);
        done && done(err);
      })
    };
    this.see_ratings = () => {
      pager.navigate(`#!/ratings/${this.tv_info().imdbID()}`);        
    };
    this.get_ratings = (done) => {
      $.get(`/get_ratings/${window.location.hash.split('/')[2]}`)
      .done((data) => {
        var graph_info = [];
        var seriesCount = 0;
        data.forEach((item, i) => {
          var graph_data = [];
          var line_data = [[],[]];
          var XSum = 0;
          var YSum = 0;
          var XYSum = 0;
          var XXSum = 0;
          item.forEach((obj) => {
            var x = parseInt(obj.number);
            var y = parseFloat(obj.rating);
            XSum += x;
            YSum += y;
            XYSum += x*y;
            XXSum += x*x;
            graph_data.push({
              x: x+seriesCount,
              y: y,
              //imdb_id: '3792838',
              id: 's'+(i+1)+'e'+obj.number,
              title: $('<div/>').html(obj.name).text(),
              rating: obj.rating,
              votes: obj.votes
            })
          });
          var N = item.length;
          var b = (N*XYSum - XSum*YSum)/(N*XXSum- XSum*XSum);
          var a = (YSum - b*XSum)/N;
          // y = a + bx - Linear Regression Graph formule
          var XOne = parseInt(item[0].number);
          var YOne = a + b*XOne;
          var XTwo = XOne + N - 1;
          var YTwo = a + b*XTwo;
          line_data[0] = [XOne+seriesCount, YOne];
          line_data[1] = [XTwo+seriesCount, YTwo];
          seriesCount += item.length;
          graph_info.push({
            type: 'line',
            name: 'Season '+(i+1),
            data: line_data,
            marker: {
              enabled: false
            },
            states: {
              hover: {
                lineWidth: 0
              }
            },
            enableMouseTracking: false
          },{
            type: 'scatter',
            name: 'Season '+(i+1),
            data: graph_data,
            marker: {
              radius: 4
            }
          })
        });
        this.graph = {};
        var graph = {
          // yAxis: {
          //   min: 7,
          //   max: 10
          // },
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
            text: this.tv_info().Title()
          },
          series: graph_info
        };
        this.graph = graph;
        done && done();
      })
      .fail((err) => {
        console.error(err);
        done && done(err);
      })
    };
    this.tv_info = ko.observable({});
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
      return (this.has_tv_info() && this.tv_info_focus()) || this.hover_on_info();
    });
    this.graph = {};
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
      data: [[1, 2], [5, 5]],
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
          rating: 8.1,
          votes: '8652'
        },
        {   
          x: 1.5,
          y: 5,
          imdb_id: '3792838',
          id: 's01e01',
          title: $('<div/>').html('The Western Book of the Dead').text(),
          rating: 8.1,
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
  window.main = main;
  pager.extendWithPage(main);
  ko.applyBindings(main, document.body);
  pager.start();
})
