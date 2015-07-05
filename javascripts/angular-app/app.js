var app = angular.module('app', ['ngRoute', 'ngAnimate', 'turnosControllers', 'SEPServices', 'ui.bootstrap',
    'angular-loading-bar', 'dialogs.main', 'config', 'userController', 'angularFileUpload', 'AuthenticationService',
    'applicationController', 'ngCookies', 'http-auth-interceptor', 'ngToast', 'homeControllers', 'highcharts-ng', 'ui.utils',
    'loginController']);

app.config(['$routeProvider', 'cfpLoadingBarProvider', function ($routeProvider, cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    $routeProvider.when('/turnos/captura', {
        templateUrl: 'partials/turnos/captura.html',
        controller: 'CapturaTurnoController',
        access: {
            isPublic: false
        }
    }).when('/turnos/busqueda', {
        templateUrl: 'partials/turnos/busqueda.html',
        controller: 'BuscaTurnoController',
        access: {
            isPublic: false
        }
    }).when('/turnos/correccion/:anio/:id', {
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
    }).when('/', {
        templateUrl: 'partials/home/dashboard.html',
        controller: 'HomeController',
        access: {
            isPublic: false
        }
    }).otherwise({
        redirectTo: '/'
    });
}]);

app.run(['$rootScope', '$location', '$cookieStore', '$http', function ($rootScope, $location, $cookieStore, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = $rootScope.globals.currentUser.token;
    }
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (!$rootScope.globals || !$rootScope.globals.currentUser) {
            if ((!next.access || !next.access.isPublic)) {
                $location.path('/login');
            }
        }
    });
}]);