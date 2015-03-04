(function () {

	var card = angular.module('card', ['ui.bootstrap', 'ngDraggable']);

	card.directive('card', ['$interval', function ($interval) {
		return {
			restrict: 'E',
			templateUrl: function (elem, attr) { return (attr.thumb)?'template/card_t.html':'template/card.html' },
			scope: { id: '@', color: '@' },
			controller: ['$http', '$scope', function ($http, $scope) {
				var _card = this;
				$http.get('data/cards.json').success(function (data) {
					data = data[$scope.id - 1];
					_card.color = ($scope.color)?$scope.color:'default';
					_card.id = ("000" + data.number).slice(-3);
					_card.tooltip = data.name;
					_card.type = (data.type > 0)?data.type:undefined;
					_card.rarity = data.rarity;
					_card.top = data.topValue;
					_card.right = data.rightValue;
					_card.bottom = data.bottomValue;
					_card.left = data.leftValue;
				});
			}],
			link: function (scope, elem, attr) {
				if (attr.thumb) {
					scope.card.hoverCycle = 1;
					var interval;
					elem.on('mouseenter', function (e) {
						scope.card.hoverCycle = 1;
						interval = $interval(function () {
							if (scope.card.hoverCycle == 3)
								scope.card.hoverCycle = 1;
							else
								scope.card.hoverCycle++;

						}, 2000);
					});
					elem.on('mouseleave', function (e) {
						scope.card.hoverCycle = 1;
						$interval.cancel(interval);
						interval = undefined;
					});
				}
			},
			controllerAs: "card",
		};
	}]);

})();
