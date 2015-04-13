var homeControllers = angular.module('homeControllers', []);

homeControllers.controller('HomeController', ['$scope', 'Turn', 'Status', function ($scope, Turn, Status) {
    $scope.stati = Status.query();
    $scope.loading = {
        waiting: true,
        assigned: true,
        notClosed: true
    };

    $scope.notClosedTurns = Turn.query(
        {
            estatus: [6],
            idAreaAsignada: $scope.currentUser.idArea,
            idEmpleado: $scope.currentUser.idEmpleado
        }, function () {
            $scope.loading.notClosed = false;
        });

    $scope.getStatus = function (id) {
        var area = _.findWhere($scope.stati, {
            id: id
        });
        return area.descripcion;
    };

    var turns = Turn.query({estatus: [4, 11, 3, 10], idAreaAsignada: $scope.currentUser.idArea}, function () {
        $scope.waitingTurns = _.filter(turns, function (item) {
            if (!item.asignacion.empleado)
                return true;
        });
        $scope.loading.waiting = false;
    });

    $scope.assignedTurns = Turn.query(
        {
            estatus: [3, 10],
            idAreaAsignada: $scope.currentUser.idArea,
            idEmpleado: $scope.currentUser.idEmpleado
        }, function () {
            $scope.loading.assigned = false;
        });
}]);