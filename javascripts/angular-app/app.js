var app = angular.module('app', ['ngRoute', 'ngAnimate', 'turnosControllers', 'SEPServices', 'jQueryDirectives',
    'ui.bootstrap', 'angular-loading-bar', 'dialogs.main', 'dialogs.default-translations', 'config', 'loginController',
    'AuthenticationService', 'applicationController', 'ngCookies']);

app.config(['$routeProvider', 'cfpLoadingBarProvider', function ($routeProvider, cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    $routeProvider.when('/turnos/captura', {
        templateUrl: 'partials/turnos/captura.html',
        controller: 'CapturaTurnoController',
        access: {
            isPublic: false
        }
    }).when('/turnos/atencion', {
        templateUrl: 'partials/turnos/atencion.html',
        controller: 'AtiendeTurnoController',
        access: {
            isPublic: false
        }
    }).when('/turnos/correccion', {
        templateUrl: 'partials/turnos/correccion.html',
        controller: 'CorrigeTurnoController',
        access: {
            isPublic: false
        }
    }).when('/login', {
        templateUrl: 'partials/login/login.html',
        controller: 'LoginController',
        access: {
            isPublic: true
        }
    }).otherwise({
        redirectTo: '/turnos/captura'
    });
}]);

app.run(['$rootScope', '$location', '$cookieStore', '$http', function ($rootScope, $location, $cookieStore, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = $rootScope.globals.currentUser.token;
    }
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        // redirect to login page if not logged in
        if ((next.access && !next.access.isPublic) && (!$rootScope.globals || !$rootScope.globals.currentUser)) {
            $location.path('/login');
        }
    });
}]);