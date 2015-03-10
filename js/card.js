(function () {

	var card = angular.module('card', []);

	card.directive('card', function () {
		return {
			restrict: 'E',
			templateUrl: function (elem, attr) { return (attr.thumb) ? 'template/card_t.html' : 'template/card.html' },
			scope: { which: '@', color: '@' },
			controller: ['$http', '$scope', '$interval', function ($http, $scope, $interval) {
				// create instance of controller for the template instance
				var ctrl = this;

				$scope.changeColor = function (color) {
					// if we didn't pass in a specific value then just get the current from scope and swap it
					if (color == undefined) 
						color = ($scope.color == "blue") ? "red" : "blue";
					// set the new color in the scope
					$scope.color = color;
					// set this element's color attribute to the new color
					$('#card-'+this.$parent.$id).attr('color', color);
					// return the new color
					return color;
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
				};

				// flip card
				$scope.flipCard = function (axis, color) {
					// grab the card element we want to flip
					var element = $('#card-'+this.$parent.$id);

					// test to see if it's already the color we are flipping to if a color is passed in
					if (color && element.attr('color') == color)
						return false; // return false we didn't change

					// proper flip class
					var flipClass = "flip" + axis.toUpperCase();
					console.log("flip class", flipClass);

					// set animation speed and timing function and also start the flip
					element.addClass(flipClass);

					// start interval for the initial flip durration
					var flipped = false;
					// set up the flip timer
					$interval(function () {
						// half way through the flip
						if (!flipped) {
							// change color of the card
							element.isolateScope().changeColor();
							flipped = true;
						}
						else {
							// remove flip class now that we've finished the full flip
							element.removeClass(flipClass);
							// call the space drop to reset the background color
							element.parent().trigger('ngDrop', [element]);
						}
					}, 325, 2);

					// return true that we did change
					return true;
				};

				// transfer the data into the card object to the controller to be used in the template
				$scope.changeCard($scope.which);
			}],
			controllerAs: "card",
		};
	});

})();
