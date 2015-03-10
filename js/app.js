(function () {

	var app = angular.module('app', ['card', 'deck', 'ngDrag']);

	app.controller('AppController', ['$scope', function ($scope) {
		
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
					a[i] = Math.floor(Math.random() * max + 1);
				$scope.randomArr = a;
			}
			return $scope.randomArr;
		};

		// space drop function
		$('board').on('ngDrop', 'space', function (event, elem) {
			// reset the background
			$(elem).parent().removeClass('blue').removeClass('red');

			// make sure this is a card
			if ($(elem).is('card')) {
				// get color of the element
				var color = $(elem).attr('color');
				// set the background color to match the card's color
				$(this).removeClass('blue').removeClass('red').addClass(color);

				// allow the drop to happen
				return true;
			}
			return false;
		});

		// this is fired after the drop has completed for processing
		$('board').on('ngPostDrop', 'space', function (event, elem) {
			// flip other cards on drop
			flipCards(elem);
		});

		// TODO: remove
		$('body').on('dblclick', 'card', function (event) {
			var card = $(event.target);
			card.isolateScope().flipCard();
		});

		// flip cards of adjacent cards to the card passed in
		function flipCards(card, combo) {
			console.log('flip');
			// card color
			var color = $(card).attr('color');
			// get the space of this card
			var space = $(card).parent();
			// get the board
			var board = space.parents('board');
			// get the spaces of the board
			var spaces = board.children().get();
			// get this card's object
			var card_obj = $(card).isolateScope().card;

			// get position of this card
			var position = board.children().index(space);

			// get adjacent cards indecies
			var top = (position + 1 > 3) ? spaces[position - 3] : null;
			var left = (((position + 1) % 3) - 1) ? spaces[position - 1] : null;
			var bottom = (position + 1 <= 6) ? spaces[position + 3] : null;
			var right = (((position + 1) % 3)) ? spaces[position + 1]: null;

			// get the card elements
			var top_card = top && $('card', top).length && $('card', top) || null;
			var left_card = left && $('card', left).length && $('card', left) || null;
			var bottom_card = bottom && $('card', bottom).length && $('card', bottom) || null;
			var right_card = right && $('card', right).length && $('card', right) || null;

			// get adjacent card numbers
			var top_value = (top_card) ? top_card.isolateScope().card.bottom : 0;
			var left_value = (left_card) ? left_card.isolateScope().card.right : 0;
			var bottom_value = (bottom_card) ? bottom_card.isolateScope().card.top : 0;
			var right_value = (right_card) ? right_card.isolateScope().card.left : 0;

			// an or statement that will return if there's more than one card adjacent
			var cardExist = top_value || left_value || bottom_value || right_value;

			// calculate individual outcomes and account for potential rules
			// RULES
			var same = true;
			var plus = true;

			// SAME RULE
			if (same && cardExist) {
				// keep track of how many same matches
				var count = 0;
				// calculate matches
				var top_flip = top_card && card_obj.top == top_value && count++;
				var left_flip = left_card && card_obj.left == left_value && count++;
				var bottom_flip = bottom_card && card_obj.bottom == bottom_value && count++;
				var right_flip = right_card && card_obj.right == right_value && count++;
				// if we matched more than one
				if (count > 1) {
					var top_change = top_flip && top_card.isolateScope().flipCard("x", color);
					var left_change = left_flip && left_card.isolateScope().flipCard("y", color);
					var bottom_change = bottom_flip && bottom_card.isolateScope().flipCard("x", color);
					var right_change = right_flip && right_card.isolateScope().flipCard("y", color);
					// wait for combo flipping
					setTimeout(function () {
						top_change && flipCards(top_card, true);
						left_change && flipCards(left_card, true);
						bottom_change && flipCards(bottom_card, true);
						right_change && flipCards(right_card, true);
					}, 1000);
				}
			}

			// PLUS RULE
			if (plus && cardExist && false) {
				// calculate sums
				var sums = {};
				sums.top = top_card && parseInt(card_obj.top) + parseInt(top_value) || 0;
				sums.left = left_card && parseInt(card_obj.left) + parseInt(left_value) || 0;
				sums.bottom = bottom_card && parseInt(card_obj.bottom) + parseInt(bottom_value) || 0;
				sums.right = right_card && parseInt(card_obj.right) + parseInt(right_value) || 0;

				var keys = Object.keys(sums).sort(function (a, b) { return sums[a] - sums[b] });

				var matches = [];
				var lastSum = 0;
				for (key in keys) {
					var i = keys[key];
					var j = matches.length - 1;
					if (sums[i] && sums[i] == lastSum)
						matches[j].which.push(i);
					else {
						sums[i] && matches.push({ sum: sums[i], which: [i] });
						matches[j] && matches[j].which.length < 2 && matches.pop();
					}
					lastSum = sums[i];
				}
				// one final pop
				j = matches.length - 1;
				matches[j] && matches[j].which.length < 2 && matches.pop();

				setTimeout(function () {
					top_change && flipCards(top_card, true);
					left_change && flipCards(left_card, true);
					bottom_change && flipCards(bottom_card, true);
					right_change && flipCards(right_card, true);
				}, 1000);
			}

			// normal flip
			var top_win = top_card && card_obj.top > top_value && top_card.isolateScope().flipCard("x", color);
			var left_win = left_card && card_obj.left > left_value && left_card.isolateScope().flipCard("y", color);
			var bottom_win = bottom_card && card_obj.bottom > bottom_value && bottom_card.isolateScope().flipCard("x", color);
			var right_win = right_card && card_obj.right > right_value && right_card.isolateScope().flipCard("y", color);

			// do more flipping if we are comboing
			if (combo && (top_win || left_win || bottom_win || right_win)) {
				setTimeout(function () {
					top_win && flipCards(top_card, true);
					left_win && flipCards(left_card, true);
					bottom_win && flipCards(bottom_card, true);
					right_win && flipCards(right_card, true);
				}, 1000);
			}
		}

	}]);

})();
