var app = angular.module('app', ['ngRoute', 'ngAnimate', 'websiteControllers', 'redmanServices', 'jQueryDirectives',
    'ui.bootstrap', 'angular-loading-bar', 'dialogs.main', 'dialogs.default-translations', 'config',
    'realtorControllers', 'listingControllers']);

app.config(['$routeProvider', 'cfpLoadingBarProvider', function ($routeProvider, cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    $routeProvider.when('/websites/list', {
        templateUrl: '/partials/websites/list.html',
        controller: 'WebsiteListController'
    }).when('/realtor/search', {
        templateUrl: '/partials/realtors/search.html',
        controller: 'RealtorController'
    }).when('/listing/search', {
        templateUrl: '/partials/listings/search.html',
        controller: 'ListingController'
    }).otherwise({
        redirectTo: '/websites/list'
    });
}]);
