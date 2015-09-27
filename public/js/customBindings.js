var customBindings = {
  highcharts: {
    init: (el, opts) => {
      $(el).highcharts(opts());
    },
    update: (el, opts) => {
      var chart = $(el).highcharts(opts());
      chart.redraw();
    }
  }
}