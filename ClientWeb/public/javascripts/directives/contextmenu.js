
myApp.directive('ngContextMenu', function ($parse) {
    var buildMenuItem = function($, $scope, list, item) {
      var $li = $('<li>');
            $a = $('<a>');
            $a.attr({ tabindex: '-1', cursor:  'pointer'});
            $a.text(item[0]);
            $li.append($a);
            $li.on('click', function () {
                item[1].call($scope, $scope);
                $scope.$apply();
            });
        
        list.append($li);
    };
    
    var renderContextMenu = function ($scope, event, options) {
        var $ = angular.element; 
        var $contextMenu = $('<div>');
        var $ul = $('<ul>');
		$ul.addClass('contextM');
		$ul.css( {
            display: 'block',
            position: 'absolute',
            left: event.pageX + 'px',
            top: event.pageY + 'px'
        });
		
        angular.forEach(options, function (item, i) {
            buildMenuItem($, $scope, $ul, item);
        });
		
        $contextMenu.append($ul);
        $contextMenu.css({
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 9999
        });
        $(document).find('body').append($contextMenu);
        $contextMenu.on("click", function (e) {
            $contextMenu.remove();
        }).on('contextmenu', function (event) {
            event.preventDefault();
            $contextMenu.remove();
        });
    };
    return function ($scope, element, attrs) {
        element.on('contextmenu', function (event) {
			event.preventDefault();
			var options = $scope.$eval(attrs.ngContextMenu);
			renderContextMenu($scope, event, options);
			$scope.$apply();
        });
    };
});