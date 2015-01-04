var loginController = angular.module('loginController', []);

loginController.controller('LoginController', ['$scope', '$rootScope', '$location', 'AuthService', function ($scope, $rootScope, $location, AuthService) {
    // reset login status
    AuthService.ClearCredentials();

    $scope.login = function () {
        $scope.dataLoading = true;
        AuthService.Login($scope.username, $scope.password)
            .success(function (data, status, headers) {
                AuthService.SetCredentials(data, headers('authorization'));
                $scope.setCurrentUser(data);
                $location.path('/');
            })
            .error(function (data) {
                $scope.error = data.mensaje;
                $scope.dataLoading = false;
            });
    };
}]);