(function () {

	var app = angular.module('app', ['card', 'deck', 'ngDrag']);

	app.controller('AppController', ['$scope', function ($scope) {

		$scope.flipId = "#card-17";

		$scope.range = function (x, y) {
			var a = [];
			if (!y)
				for (i=0;i<x;i++) a[i] = i;
			else
				for (i=0;i<Math.abs(y-x+1);i++) a[i] = i+x;
			return a;
		};

		$scope.flip = function (selector) {
			$(selector).isolateScope().flipCard();
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

		// space drop function
		$('board').on('ngDrop', 'space', function (event, elem) {
			$(elem).parent().removeClass('blue').removeClass('red');
			// make sure this is a card
			if ($(elem).is('card')) {
				var color = $(elem).attr('color');
				$(this).removeClass('blue').removeClass('red').addClass(color);
				return true;
			}
			return false;
		});

		$('body').on('dblclick', 'card', function (event) {
			var card = $(event.target).parent();
			card.isolateScope().flipCard();
		});

	}]);

})();