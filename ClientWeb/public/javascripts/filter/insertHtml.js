myApp.filter('insertHtml', function($sce) {
  return function(html) {
    return $sce.trustAsHtml(html);
  };
});