var jQueryDirectives = angular.module('jQueryDirectives', []);

jQueryDirectives.directive('gentleSelect', function(){
    return {
        priority: 1001,
        // Restrict it to be an attribute in this case
        restrict: 'A',
        // responsible for registering DOM listeners as well as updating the DOM
        link: function(scope, element, attrs){
            $(element).gentleSelect();
        }
    };
});
