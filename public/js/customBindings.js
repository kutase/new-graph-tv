var customBindings = {
  highcharts: {
    init: (el, opts) => {
      $(el).highcharts(opts());
    },
    update: (el, opts) => {
      var chart = $(el).highcharts(opts());
      chart.redraw();
    }
  },
  popover: {
    init: (el, opts) => {
      opts = opts();
      $.extend(opts, {
        html: true,
        content: () => $(opts.contentId).html()
      });
      $(el).popover(opts);
    }
  }
}