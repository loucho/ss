var appControllers = angular.module('applicationController', []);

appControllers.controller('ApplicationController', function ($scope, AuthService, $rootScope) {
    $scope.currentUser = ($rootScope.globals && $rootScope.globals.currentUser) ? $rootScope.globals.currentUser : null;
    $scope.isAuthorized = AuthService.isAuthorized;

    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
    };

    $scope.logout = function () {
        $scope.currentUser = null;
        AuthService.ClearCredentials();
    }
})
;