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
    }]);