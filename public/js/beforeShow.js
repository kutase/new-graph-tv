var beforeShow = {
  showRatings: (page) => {
    page = page.page;
    main.isLoading(true);
    main.get_tv(() => {
      main.get_ratings(() => {
        main.isLoading(false);
        $('#graph').highcharts(main.graph);        
      });
    });
  }
}