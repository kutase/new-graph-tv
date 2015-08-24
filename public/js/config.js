requirejs.config({
  paths: {
    bluebird: '../bower_components/bluebird/js/browser/bluebird.min',
    jquery: '../bower_components/jquery/dist/jquery.min',
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min',
    knockout: '../bower_components/knockout/dist/knockout',
    ko_mapping: '../bower_components/knockout-mapping/build/output/knockout.mapping-latest',
    pager: '../bower_components/pagerjs/dist/pager.min',
    domReady: '../bower_components/requirejs-domready/domready',
    main: './index'
  }
})

requirejs(['jquery', 'knockout','ko_mapping', 'main', 'pager', 'bootstrap', 'domReady'], function ($, ko, ko_mapping, main) {
  ko.mapping = ko_mapping;

  window.main = new main(); // For debugging
  
  ko.applyBindings(main);

})