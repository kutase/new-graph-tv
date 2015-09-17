requirejs.config({
  shim: {
    'bootstrap': {
        deps: ['jquery']
    },
    pager: {
      deps: ['jquery', 'knockout']
    }
  },
  paths: {
    bluebird: '../bower_components/bluebird/js/browser/bluebird.min',
    jquery: '../bower_components/jquery/dist/jquery.min',
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min',
    knockout: '../bower_components/knockout/dist/knockout',
    ko_mapping: '../bower_components/knockout-mapping/build/output/knockout.mapping-latest',
    pager: '../bower_components/pagerjs/dist/pager.min',
    domReady: '../bower_components/requirejs-domready/domReady',
    main: './index'
  }
})

requirejs(['jquery', 'knockout','ko_mapping', 'main', 'pager', 'bootstrap', 'domReady'], function ($, ko, ko_mapping, main, pager) {
  ko.mapping = ko_mapping;
  pager.Href.hash = '#!/';
  var main = new main(); // For debugging
  pager.extendWithPage(main);
  ko.applyBindings(main, document.body);
  pager.start();
})