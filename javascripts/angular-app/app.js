var app = angular.module('app', ['ngRoute', 'ngAnimate', 'turnosControllers', 'SEPServices', 'jQueryDirectives',
    'ui.bootstrap', 'angular-loading-bar', 'dialogs.main', 'dialogs.default-translations', 'config', 'loginController',
    'AuthenticationService', 'applicationController', 'ngCookies']);

app.config(['$routeProvider', 'cfpLoadingBarProvider', function ($routeProvider, cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    $routeProvider.when('/turnos/captura', {
        templateUrl: 'partials/turnos/captura.html',
        controller: 'CapturaTurnoController'
    }).when('/turnos/atencion', {
        templateUrl: 'partials/turnos/atencion.html',
        controller: 'AtiendeTurnoController'
    }).when('/turnos/correccion', {
        templateUrl: 'partials/turnos/correccion.html',
        controller: 'CorrigeTurnoController'
    }).when('/login', {
        templateUrl: 'partials/login/login.html',
        controller: 'LoginController'
    }).otherwise({
        redirectTo: '/turnos/captura'
    });
}]);


app.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && (!$rootScope.globals || !$rootScope.globals.currentUser)) {
                $location.path('/login');
            }
        });
    }]);