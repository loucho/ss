var turnosControllers = angular.module('turnosControllers', []);

// Managing the websites list
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

        $scope.addFile = function () {
            $scope.files.push({"file": ""});
        };

        $scope.deleteFile = function (file) {
            var i = $scope.files.indexOf(file);
            $scope.files.splice(i, 1);
        };
    }]);