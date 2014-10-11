var app = angular.module('app', ['ngRoute', 'ngAnimate', 'turnosControllers', 'SEPServices', 'jQueryDirectives',
    'ui.bootstrap', 'angular-loading-bar', 'dialogs.main', 'dialogs.default-translations', 'config']);

app.config(['$routeProvider', 'cfpLoadingBarProvider', function ($routeProvider, cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    $routeProvider.when('/turnos/captura', {
        templateUrl: '/partials/turnos/captura.html',
        controller: 'CapturaTurnoController'
    }).when('/turnos/atencion', {
        templateUrl: '/partials/turnos/atencion.html',
        controller: 'AtiendeTurnoController'
    }).when('/turnos/correccion', {
        templateUrl: '/partials/turnos/correccion.html',
        controller: 'CorrigeTurnoController'
    }).otherwise({
        redirectTo: '/turnos/captura'
    });
}]);
