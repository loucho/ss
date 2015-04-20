var homeControllers = angular.module('homeControllers', []);

homeControllers.controller('HomeController', ['$scope', 'Turn', 'Status', function ($scope, Turn, Status) {
    $scope.stati = Status.query();
    $scope.chartConfig = {
        options: {
            chart: {
                type: 'column'
            },
            tooltip: {
                style: {
                    padding: 10,
                    fontWeight: 'bold'
                }
            }
        },
        title: {
            text: 'Desglose de turnos'
        },
        loading: true,
        xAxis: {
            title: {text: 'Estatus'}
        },
        yAxis: {
            title: {text: 'Número de turnos'}
        }
    };
    $scope.loading = {
        waiting: true,
        assigned: true,
        notClosed: true
    };
    loadDashboard();

    $scope.$on('event:status-changed', function () {
        loadDashboard();
    });

    $scope.getStatus = function (id) {
        var area = _.findWhere($scope.stati, {
            id: id
        });
        return area.descripcion;
    };

    function filterWaiting(turns) {
        $scope.waitingTurns = _.filter(turns, function (item) {
            if (_.indexOf([4, 11, 3, 10, 1, 9], item.idEstatus) != -1 && !item.asignacion.empleado)
                return true;
        });
        $scope.loading.waiting = false;
    }

    function filterNotClosed(turns) {
        $scope.notClosedTurns = _.filter(turns, function (item) {
            if (item.idEstatus == 6 && item.asignacion && item.asignacion.empleado && item.asignacion.empleado.id == $scope.currentUser.idEmpleado)
                return true;
        });
        $scope.loading.notClosed = false;
    }

    function filterAssigned(turns) {
        $scope.assignedTurns = _.filter(turns, function (item) {
            if (_.indexOf([3, 10], item.idEstatus) != -1 && item.asignacion && item.asignacion.empleado && item.asignacion.empleado.id == $scope.currentUser.idEmpleado)
                return true;
        });
        $scope.loading.assigned = false;
    }

    function loadDashboard() {
        $scope.waitingTurns = [];
        $scope.notClosedTurns = [];
        $scope.assignedTurns = [];
        $scope.chartConfig.series = undefined;
        $scope.chartConfig.xAxis.categories = undefined;
        $scope.chartConfig.loading = true;
        $scope.loading = {
            waiting: true,
            assigned: true,
            notClosed: true
        };
        var chartTurns = Turn.query({
            estatus: [1, 3, 4, 6, 9, 10, 11],
            idAreaAsignada: $scope.currentUser.idArea
        }, function () {
            filterAssigned(chartTurns);
            filterNotClosed(chartTurns);
            filterWaiting(chartTurns);
            var count = _.countBy(chartTurns, function (item) {
                return item.idEstatus;
            });
            var tramite = [];
            var conocimiento = [];
            var categories = [];
            $scope.stati.forEach(function (status) {
                if (count[status.id]) {
                    var i = _.indexOf(categories, status.descripcion);
                    if (i == -1) {
                        categories.push(status.descripcion);
                        tramite.push(0);
                        conocimiento.push(0);
                        i = _.indexOf(categories, status.descripcion);
                    }
                    if (status.idElemento == 1) {
                        tramite[i] += count[status.id];
                    }
                    if (status.idElemento == 2) {
                        conocimiento[i] += count[status.id];
                    }
                }
            });

            $scope.chartConfig.series = [{
                data: conocimiento,
                name: 'Para conocimiento',
                color: '#ffb469'
            }, {
                data: tramite,
                name: 'Para trámite',
                color: '#69b4ff'
            }];
            $scope.chartConfig.xAxis.categories = categories;
            $scope.chartConfig.loading = false;
        });
    }
}]);