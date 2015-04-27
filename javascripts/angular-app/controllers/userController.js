var userController = angular.module('userController', []);

userController.controller('ChangePasswordController', ['$rootScope', '$scope', '$modalInstance', 'data', 'User', 'AuthenticationService', function ($rootScope, $scope, $modalInstance, data, User, AuthenticationService) {
    $scope.user = {
        username: data.username,
        password: '',
        confirmPassword: ''
    };

    $scope.updatePassword = function () {
        $scope.dataLoading = true;
        User.update({id: data.id}, $scope.user, function (data) {
            var user = $rootScope.globals.currentUser;
            user.username = $scope.user.username;
            AuthenticationService.SetCredentials(user, user.token);
            $modalInstance.close(data);
        }, function (response) {
            $scope.dataLoading = false;
            $scope.error = response.data.mensaje;
        });
    };
}]);