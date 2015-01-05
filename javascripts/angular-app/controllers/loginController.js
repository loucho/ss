var loginController = angular.module('loginController', []);

loginController.controller('LoginController', ['$scope', '$location', 'AuthenticationService', function ($scope, $location, AuthenticationService) {
    // reset login status
    AuthenticationService.ClearCredentials();

    $scope.login = function () {
        $scope.dataLoading = true;
        AuthenticationService.Login($scope.username, $scope.password)
            .success(function (data, status, headers) {
                AuthenticationService.SetCredentials(data, headers('authorization'));
                $scope.setCurrentUser(data);
                $location.path('/');
            })
            .error(function (data) {
                $scope.error = data.mensaje;
                $scope.dataLoading = false;
            });
    };
}]);