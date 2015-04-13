var appControllers = angular.module('applicationController', []);

appControllers.controller('ApplicationController', function ($scope, AuthenticationService, $rootScope, authService, dialogs, datepickerPopupConfig, paginationConfig, ngToast) {
    $scope.currentUser = ($rootScope.globals && $rootScope.globals.currentUser) ? $rootScope.globals.currentUser : null;
    $scope.isAuthorized = AuthenticationService.isAuthorized;

    datepickerPopupConfig.currentText = 'Hoy';
    datepickerPopupConfig.clearText = 'Limpiar';
    datepickerPopupConfig.closeText = 'Cerrar';
    datepickerPopupConfig.datepickerPopup = 'dd/MM/yyyy';

    paginationConfig.previousText = "Anterior";
    paginationConfig.nextText = "Siguiente";
    paginationConfig.lastText = "Último";
    paginationConfig.firstText = "Primero";

    $scope.reject = function (turno) {
        var dlg = dialogs.create('partials/dialogs/rechazar.html', 'rechazarDialogController', turno, {
            size: 'lg',
            backdrop: 'static',
            windowClass: 'loginModal'
        });
        dlg.result.then(function (message) {
            ngToast.create({content: message.mensaje, 'class': (message.codigo == 200) ? 'success' : 'danger'});
        }, function () {
            ngToast.create({content: 'Cancelar Rechazo', 'class': 'danger'});
        });
    };

    $scope.close = function (turno) {
        var dlg = dialogs.create('partials/dialogs/cerrar.html', 'cerrarDialogController', turno, {
            size: 'lg',
            backdrop: 'static',
            windowClass: 'loginModal'
        });
        dlg.result.then(function (message) {
            ngToast.create({content: message.mensaje, 'class': (message.codigo == 200) ? 'success' : 'danger'});
        }, function () {
            ngToast.create({content: 'Cancelar Cierre', 'class': 'danger'});
        });
    };

    $scope.assign = function (turno) {
        var dlg = dialogs.create('partials/dialogs/asignar.html', 'asignarDialogController', turno, {
            size: 'lg',
            backdrop: 'static',
            windowClass: 'loginModal'
        });
        dlg.result.then(function (message) {
            ngToast.create({content: message.mensaje, 'class': (message.codigo == 200) ? 'success' : 'danger'});
        }, function () {
            ngToast.create({content: 'Cancelar Asignación', 'class': 'danger'});
        });
    };

    $scope.work = function (turno) {
        var dlg = dialogs.create('partials/dialogs/atender.html', 'atenderDialogController', turno, {
            size: 'lg',
            backdrop: 'static',
            windowClass: 'loginModal'
        });
        dlg.result.then(function (message) {
            ngToast.create({content: message.mensaje, 'class': (message.codigo == 200) ? 'success' : 'danger'});
        }, function () {
            ngToast.create({content: 'Cancelar Atención', 'class': 'danger'});
        });
    };

    $scope.editWork = function (turno) {
        var dlg = dialogs.create('partials/dialogs/editar-atencion.html', 'editarAtencionDialogController', turno, {
            size: 'lg',
            backdrop: 'static',
            windowClass: 'loginModal'
        });
        dlg.result.then(function (message) {
            ngToast.create({content: message.mensaje, 'class': (message.codigo == 200) ? 'success' : 'danger'});
        }, function () {
            ngToast.create({content: 'Cancelar Edicion de Atención', 'class': 'danger'});
        });
    };

    $scope.view = function (turno) {
        dialogs.create('partials/dialogs/ver.html', 'verDialogController', turno, {
            size: 'lg',
            backdrop: 'static',
            windowClass: 'loginModal'
        });
    };

    $scope.files = function (turno) {
        dialogs.create('partials/dialogs/archivos.html', 'archivosDialogController', turno, {
            size: 'lg',
            backdrop: 'static',
            windowClass: 'loginModal'
        });
    };

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