(function () {

	var app = angular.module('app', ['card', 'deck']);

	app.controller('AppController', ['$scope', function ($scope) {

		$scope.range = function (x, y) {
			var a = [];
			if (!y)
				for (i=0;i<x;i++) a[i] = i;
			else
				for (i=0;i<Math.abs(y-x+1);i++) a[i] = i+x;
			return a;
		};

		$scope.randomArr = null;

		$scope.random = function (count, max) {
			if (!$scope.randomArr) {
				var a = new Array(count);
				for (var i = 0; i < count; i++) 
					a[i] = Math.floor(Math.random() * 80 + 1);
				$scope.randomArr = a;
			}
			return $scope.randomArr;
		};

	}]);

})();