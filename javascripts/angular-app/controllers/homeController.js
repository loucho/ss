var homeControllers = angular.module('homeControllers', []);

homeControllers.controller('HomeController', ['$scope', 'Turn', 'Status', 'Area', '$q', function ($scope, Turn, Status, Area, $q) {
    var areas = [$scope.currentUser.idArea];
    $scope.areas = Area.query({}, function () {
        getDependantAreas($scope.currentUser.idArea);
        function getDependantAreas(area) {
            _.forEach($scope.areas, function (item) {
                if (item.dependencia == area) {
                    areas.push(item.id);
                    getDependantAreas(item.id);
                }
            })
        }
    });
    $scope.stati = Status.query();

    $q.all([
        $scope.areas.$promise,
        $scope.stati.$promise
    ]).then(function () {
        loadDashboard();
    });

    $scope.ownChartConfig = {
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
            text: 'Desglose de turnos de esta Area'
        },
        loading: true,
        xAxis: {
            title: {text: 'Estatus'}
        },
        yAxis: {
            title: {text: 'Número de turnos'}
        }
    };

    $scope.dependantChartConfig = {
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
            text: 'Desglose de turnos de Areas dependientes'
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
        notClosed: true,
        dependants: true
    };

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

    function filterDependantNotClosed(turns) {
        $scope.dependantNotClosedTurns = _.filter(turns, function (item) {
            if (item.idEstatus == 6)
                return true;
        });
        $scope.loading.dependantNotClosed = false;
    }

    function filterAssigned(turns) {
        $scope.assignedTurns = _.filter(turns, function (item) {
            if (_.indexOf([3, 10], item.idEstatus) != -1 && item.asignacion && item.asignacion.empleado && item.asignacion.empleado.id == $scope.currentUser.idEmpleado)
                return true;
        });
        $scope.loading.assigned = false;
    }

    function loadOwnArea() {
        $scope.waitingTurns = [];
        $scope.notClosedTurns = [];
        $scope.assignedTurns = [];
        $scope.ownChartConfig.series = undefined;
        $scope.ownChartConfig.xAxis.categories = undefined;
        $scope.ownChartConfig.loading = true;
        $scope.loading.waiting = true;
        $scope.loading.assigned = true;
        $scope.loading.notClosed = true;

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

            $scope.ownChartConfig.series = [{
                data: conocimiento,
                name: 'Para conocimiento',
                color: '#ffb469'
            }, {
                data: tramite,
                name: 'Para trámite',
                color: '#69b4ff'
            }];
            $scope.ownChartConfig.xAxis.categories = categories;
            $scope.ownChartConfig.loading = false;
        });
    }

    function loadDependantAreas() {
        $scope.dependantTurns = [];
        $scope.dependantChartConfig.series = undefined;
        $scope.dependantChartConfig.xAxis.categories = undefined;
        $scope.dependantChartConfig.loading = true;
        $scope.loading.dependants = true;
        $scope.loading.dependantNotClosed = true;
        var chartTurns = Turn.query({
            estatus: [1, 3, 4, 6, 9, 10, 11],
            idAreaAsignada: areas
        }, function () {
            filterDependantNotClosed(chartTurns);
            $scope.dependantTurns = chartTurns;
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

            $scope.dependantChartConfig.series = [{
                data: conocimiento,
                name: 'Para conocimiento',
                color: '#ffb469'
            }, {
                data: tramite,
                name: 'Para trámite',
                color: '#69b4ff'
            }];
            $scope.dependantChartConfig.xAxis.categories = categories;
            $scope.dependantChartConfig.loading = false;
            $scope.loading.dependants = false;
        });
    }

    function loadDashboard() {
        loadOwnArea();
        loadDependantAreas();
    }
}]);