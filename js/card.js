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

				$scope.changeCard = function (id) {
					$http.get('card.php?id='+id).success(function (data) {
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
				}

				// transfer the data into the card object to the controller to be used in the template
				$scope.changeCard($scope.which);
			}],
			link: function (scope, elem, attrs) {
				
			},
			controllerAs: "card",
		};
	});

})();
