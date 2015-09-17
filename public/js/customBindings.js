var customBindings = {
  highcharts: {
    init: (el, opts) => {
      $(el).highcharts(opts());
    }
  }
}