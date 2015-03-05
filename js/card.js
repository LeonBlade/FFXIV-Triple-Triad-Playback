(function () {

	var card = angular.module('card', ['ui.bootstrap']);

	card.directive('card', function () {
		return {
			restrict: 'E',
			templateUrl: function (elem, attr) { return (attr.thumb) ? 'template/card_t.html' : 'template/card.html' },
			scope: { which: '@', color: '@' },
			controller: ['$http', '$scope', function ($http, $scope) {
				// create instance of controller for the template instance
				var ctrl = this;

				$scope.changeColor = function (color) {
					$scope.$apply(function () {
						$scope.color = color;
					});
				};

				// transfer the data into the card object to the controller to be used in the template
				$http.get('card.php?id='+$scope.which).success(function (data) {
					// reset the data
					ctrl.color = ($scope.color) ? $scope.color : 'default';
					ctrl.id = ("000" + data.number).slice(-3);
					ctrl.tooltip = data.name;
					ctrl.type = (data.type > 0)?data.type:undefined;
					ctrl.rarity = data.rarity;
					ctrl.top = data.topValue;
					ctrl.right = data.rightValue;
					ctrl.bottom = data.bottomValue;
					ctrl.left = data.leftValue;
				});
			}],
			link: function (scope, elem, attr) {
				// create a card id for the element and set a proper id for reference ine the DOM
				elem.attr('id', "card-" + attr['which']);

				// if this is a card thumbnail
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
