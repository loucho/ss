var appControllers = angular.module('applicationController', []);

appControllers.controller('ApplicationController', function ($scope, AuthenticationService, $rootScope, authService, dialogs, datepickerPopupConfig) {
    $scope.currentUser = ($rootScope.globals && $rootScope.globals.currentUser) ? $rootScope.globals.currentUser : null;
    $scope.isAuthorized = AuthenticationService.isAuthorized;

    datepickerPopupConfig.currentText = 'Hoy';
    datepickerPopupConfig.clearText = 'Limpiar';
    datepickerPopupConfig.closeText = 'Cerrar';
    datepickerPopupConfig.datepickerPopup = 'dd/MM/yyyy';

    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
    };

    $scope.logout = function () {
        $scope.currentUser = null;
        AuthenticationService.ClearCredentials();
    };

    $scope.$on('event:auth-loginRequired', function () {
        console.log('Auth Required');
        if (!$scope.loginModalOpen) {
            $scope.loginModalOpen = true;
            var dlg = dialogs.create('partials/dialogs/login.html', 'loginDialogController', {}, {
                size: 'lg',
                keyboard: false,
                backdrop: 'static',
                windowClass: 'loginModal'
            });
            dlg.result.then(function (user) {
                $scope.setCurrentUser(user);
                $scope.loginModalOpen = false;
            });
        }
    });
    $scope.$on('event:auth-loginConfirmed', function () {
        console.log('Auth Confirmed');
    });
});


appControllers.controller('loginDialogController', ['$scope', '$modalInstance', 'AuthenticationService', 'authService', function ($scope, $modalInstance, AuthenticationService, authService) {
    // reset login status
    AuthenticationService.ClearCredentials();

    $scope.login = function () {
        $scope.dataLoading = true;
        AuthenticationService.Login($scope.username, $scope.password)
            .success(function (data, status, headers) {
                AuthenticationService.SetCredentials(data, headers('authorization'));
                authService.loginConfirmed(data, function (config) {
                    config.headers.Authorization = headers('authorization');
                    return config;
                });
                $modalInstance.close(data);
            })
            .error(function (data) {
                $scope.error = data.mensaje;
                $scope.dataLoading = false;
            });
    };
}]);