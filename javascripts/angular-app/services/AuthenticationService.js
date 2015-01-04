'use strict';

var authService = angular.module('AuthenticationService', []);

authService.factory('AuthService', ['$http', '$cookieStore', '$rootScope', 'config',
    function ($http, $cookieStore, $rootScope, config) {
        var service = {};

        service.Login = function (username, password) {
            return $http.get(config.apiUrl + '/login?nombreUsuario=' + username + '&contrasenia=' + password);
        };

        service.SetCredentials = function (user, token) {
            user.token = token;
            $rootScope.globals = {
                currentUser: user
            };
            $http.defaults.headers.common['Authorization'] = token;
            $cookieStore.put('globals', $rootScope.globals);
        };

        service.ClearCredentials = function () {
            delete $rootScope.globals;
            $cookieStore.remove('globals');
            $http.defaults.headers.common['Authorization'] = null;
        };

        return service;
    }]);