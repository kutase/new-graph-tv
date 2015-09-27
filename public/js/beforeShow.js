var beforeShow = {
  showRatings: (page) => {
    page = page.page;
    page.async(main.get_ratings(), page.currentId, null, main.isLoading);
  }
}