var turnosControllers = angular.module('turnosControllers', []);

turnosControllers.controller('CapturaTurnoController', ['$scope', '$http', 'dialogs', 'Priority', 'ProcessType',
    'SenderType', 'Area', 'Institution', 'Position', 'IESPerson', 'Organization', 'Turn',
    function ($scope, $http, dialogs, Priority, ProcessType, SenderType, Area, Institution, Position, IESPerson, Organization, Turn, Employee) {
        $scope.priorities = Priority.query();
        $scope.processTypes = ProcessType.query();
        $scope.today = new Date();
        $scope.turn = "1216-14";
        $scope.senderTypes = SenderType.query();
        $scope.institutions = Institution.query();
        $scope.positions = Position.query();
        $scope.organizations = Organization.query();
        $scope.areas = Area.query({idDependencia: [0, 1]});
        $scope.internalAreas = Area.query();
        $scope.files = [{"file": ""}];
        $scope.turno = {areas: [], remitente: {}};

        $scope.updateInstitution = function () {
            $scope.turno.remitente.idInstitucion = $scope.selectedInstitution.id;
            $scope.IESpeople = IESPerson.query({idIES: $scope.turno.remitente.idInstitucion});
            $scope.clearPerson();
        };

        $scope.updateArea = function () {
            $scope.turno.remitente.idInstitucion = $scope.selectedInstitution.id;
            $scope.IESpeople = IESPerson.query({idIES: $scope.turno.remitente.idInstitucion});
            $scope.clearPerson();
        };

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

        $scope.clearPerson = function(){
            $scope.turno.remitente.idPersona = null;
            $scope.position = "";
        };

        $scope.setPerson = function () {
            $scope.turno.remitente.idPersona = $scope.selectedPerson.id;
            $scope.position = $scope.selectedPerson.cargoIes.nombre;
        };

        $scope.getCode911 = function (institutionCode) {
            var institution = _.findWhere($scope.institutions, {
                id: institutionCode
            });
            return institution.clave911;
        };

        $scope.save = function () {
            console.log(JSON.stringify($scope.turno));
        };
    }]);

turnosControllers.controller('AtiendeTurnoController', ['$scope', '$http', 'dialogs', 'Priority', 'ProcessType',
    'SenderType', 'Area', 'Institution', 'Position', 'IESPerson', 'Turn',
    function ($scope, $http, dialogs, Priority, ProcessType, SenderType, Area, Institution, Position, IESPerson, Turn) {
        $scope.priorities = Priority.query();
        $scope.processTypes = ProcessType.query();
        $scope.senderTypes = SenderType.query();
        $scope.institutions = Institution.query();
        $scope.positions = Position.query();
        $scope.people = IESPerson.query();
        $scope.areas = Area.query();

        $scope.turns = Turn.query();

        $scope.getArea = function (id) {
            var area = _.findWhere($scope.areas, {
                code: id
            });
            return area.name;
        }

    }]);