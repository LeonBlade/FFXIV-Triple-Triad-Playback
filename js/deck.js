(function () {

	var deck = angular.module('deck', ['card']);

	deck.directive('deck', function () {

		return {
			restrict: 'E',
			templateUrl: 'template/deck.html',
			scope: { color: '@', cards: '@' },
			controller: ['$scope', function ($scope) {
				this.color = $scope.color;
				this.cards = $scope.cards.split(',');
			}],
			controllerAs: 'deck'
		};

	});

})();