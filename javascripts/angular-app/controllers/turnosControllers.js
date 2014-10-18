var turnosControllers = angular.module('turnosControllers', []);

turnosControllers.controller('CapturaTurnoController', ['$scope', '$http', 'dialogs', 'Priority', 'ProcessType',
    'SenderType', 'Area', 'Institution', 'Position', 'Person',
    function ($scope, $http, dialogs, Priority, ProcessType, SenderType, Area, Institution, Position, Person) {
        $scope.priorities = Priority.query();
        $scope.processTypes = ProcessType.query();
        $scope.today = new Date();
        $scope.turn = "1216-14";
        $scope.senderTypes = SenderType.query();
        $scope.institutions = Institution.query();
        $scope.positions = Position.query();
        $scope.people = Person.query();
        $scope.areas = Area.query();
        $scope.files = [{"file": ""}];
        $scope.turno = {areas: []};

        $scope.checkedArea = function (code) {
            return _.contains($scope.turno.areas, code);
        };

        $scope.toggleArea = function (code) {
            if (_.contains($scope.turno.areas, code)) {
                var i = $scope.turno.areas.indexOf(code);
                $scope.turno.areas.splice(i, 1);
            }
            else
                $scope.turno.areas.push(code);
        };

        $scope.addFile = function () {
            $scope.files.push({"file": ""});
        };

        $scope.deleteFile = function (file) {
            var i = $scope.files.indexOf(file);
            $scope.files.splice(i, 1);
        };

        $scope.getCode911 = function (institutionCode) {
            var institution = _.findWhere($scope.institutions, {
                code: institutionCode
            });
            return institution.code911;
        };
    }]);

turnosControllers.controller('AtiendeTurnoController', ['$scope', '$http', 'dialogs', 'Priority', 'ProcessType',
    'SenderType', 'Area', 'Institution', 'Position', 'Person', 'Turn',
    function ($scope, $http, dialogs, Priority, ProcessType, SenderType, Area, Institution, Position, Person, Turn) {
        $scope.priorities = Priority.query();
        $scope.processTypes = ProcessType.query();
        $scope.senderTypes = SenderType.query();
        $scope.institutions = Institution.query();
        $scope.positions = Position.query();
        $scope.people = Person.query();
        $scope.areas = Area.query();

        $scope.turns = Turn.query();

        $scope.getArea = function (id) {
            var area = _.findWhere($scope.areas, {
                code: id
            });
            return area.name;
        }

    }]);