(function () {

	// drag module
	var ngDrag = angular.module('ngDrag', []);

	var prop = { props: ['dataTransfer'] };
	jQuery.event.fixHooks.dragstart = prop;
	jQuery.event.fixHooks.drop = prop;

	// drag attribute binding dragstart to the element and making it draggable
	ngDrag.directive('ngDrag', function () {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				// set draggable to true
				elem.attr('draggable', 'true');

				// on dragstart we want to set the id of the element to the event for reference on drop
				elem.on('dragstart', function (event) {
					event.dataTransfer.setData('text', event.target.id);
					event.dataTransfer.dropEffect = "move";
				});
			}
		};
	});

	// binds a drag stop to allow for draggable elements to be placed in the element
	ngDrag.directive('ngDrop', function ($q) {
		return {
			rectrict: 'A',
			link: function (scope, elem, attrs) {
				// allows to be dragged over
				elem.on('dragover', function (event) {
					event.preventDefault();
				});

				// the drop event itself
				elem.on('drop', function (event) {
					// prevent anything funky from happening
					event.preventDefault();

					// get the id from the dropped element
					var data = event.dataTransfer.getData('text');
					// try to get an element from this data
					var dragElem = document.getElementById(data);
					// just deny if we can't find an element
					if (!dragElem) return;

					// get reference to this drop target element
					var dropElem = angular.element(event.target);

					// create the trigger and check to see if it returns true
					var trigger = dropElem.trigger('ngDrop', [dragElem]);
					if (trigger === undefined || trigger) {
						event.target.appendChild(dragElem);
					}
				});
			}
		};
	});

})();