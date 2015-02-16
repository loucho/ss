var turnosControllers = angular.module('turnosControllers', []);

turnosControllers.controller('CapturaTurnoController', ['$scope', '$http', 'dialogs', 'Priority', 'ProcessType', 'SenderType', 'Area', 'Institution', 'IESPerson', 'Organization', 'Turn', 'Employee', 'FileType', '$upload', 'config', 'ngToast',
    function ($scope, $http, dialogs, Priority, ProcessType, SenderType, Area, Institution, IESPerson, Organization, Turn, Employee, FileType, $upload, config, ngToast) {
        $scope.priorities = Priority.query();
        $scope.processTypes = ProcessType.query();
        $scope.today = new Date();
        $scope.fileMask = config.fileMask;
        $scope.senderTypes = SenderType.query();
        $scope.institutions = Institution.query();
        $scope.organizations = Organization.query();
        $scope.areas = Area.query({idDependencia: [0, 1]});
        $scope.internalAreas = Area.query();
        $scope.files = [];
        $scope.turno = {remitente: {}, archivos: []};
        $scope.fileTypes = FileType.query({tipo: 1});

        $scope.openReceptionDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.receptionDateOpen = true;
        };

        $scope.openDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.dateOpen = true;
        };

        $scope.updateInstitution = function () {
            $scope.turno.remitente.idInstitucion = $scope.selectedInstitution.id;
            $scope.IESpeople = IESPerson.query({idIES: $scope.turno.remitente.idInstitucion});
            $scope.clearPerson();
        };

        $scope.updateArea = function () {
            $scope.turno.remitente.idArea = $scope.selectedArea.id;
            $scope.employees = Employee.query({idAreaOperativa: $scope.turno.remitente.idArea});
            $scope.clearPerson();
        };

        $scope.deleteFile = function (file) {
            var i = $scope.turno.archivos.indexOf(file);
            $scope.turno.archivos.splice(i, 1);
        };

        $scope.clearPerson = function () {
            $scope.turno.remitente.idPersona = null;
            $scope.position = "";
        };

        $scope.setPerson = function () {
            $scope.turno.remitente.idPersona = $scope.selectedPerson.id;
            if ($scope.turno.tipoRemitente == 1)
                $scope.position = $scope.selectedPerson.cargoIes.nombre;
        };

        $scope.getCode911 = function (institutionCode) {
            var institution = _.findWhere($scope.institutions, {
                id: institutionCode
            });
            return institution.clave911;
        };

        $scope.save = function (form) {
            $scope.submitted = true;
            if (!form.$valid || $scope.turno.archivos.length == 0) {
                ngToast.create({
                    content: '<span class="glyphicon glyphicon-exclamation-sign"></span> Es necesario ingresar todos los datos requeridos',
                    'class': 'danger'
                });
                return false;
            }
            console.log(JSON.stringify($scope.turno));
            Turn.save({}, $scope.turno, function (data) {
                ngToast.create({
                    content: '<span class="glyphicon glyphicon-ok"></span> Turno guardado correctamente',
                    'class': 'success'
                });
            }, function (error) {
                ngToast.create({
                    content: '<span class="glyphicon glyphicon-exclamation-sign"></span> Ocurrio un error al guardar los datos =(',
                    'class': 'danger'
                });
            });
        };

        $scope.$watch('files', function () {
            for (var i = 0; i < $scope.files.length; i++) {
                var file = $scope.files[i];
                if (file.size > config.maxFileSize) {
                    ngToast.create({
                        content: '<span class="glyphicon glyphicon-warning-sign"></span> Archivo demasiado grande: ' + file.name + " (" + file.size + " Kb)",
                        'class': 'warning'
                    });
                    continue;
                }
                if (_.find($scope.turno.archivos, function (item) {
                        return item.nombre == file.name;
                    })) {
                    ngToast.create({
                        content: '<span class="glyphicon glyphicon-warning-sign"></span> Archivo ya existe: ' + file.name,
                        'class': 'warning'
                    });
                    continue;
                }
                $scope.upload = $upload.upload({
                    url: config.apiUrl + "/archivo/upload",
                    method: 'POST',
                    file: file
                }).success(function (data, status, headers, config) {
                    var newFile = {
                        nombre: config.file.name,
                        nombreTemporal: data.nombreArchivoTemporal,
                        tipo: config.file.type,
                        size: config.file.size
                    };
                    $scope.turno.archivos.push(newFile);
                }).error(function (error) {
                    console.log(error);
                });
            }
        });
    }]);

turnosControllers.controller('CorrigeTurnoController', ['$scope', '$http', 'dialogs', 'Priority', 'ProcessType', 'SenderType', 'Area', 'Institution', 'IESPerson', 'Organization', 'Turn', 'Employee', 'FileType', '$upload', 'config', 'ngToast', '$routeParams',
    function ($scope, $http, dialogs, Priority, ProcessType, SenderType, Area, Institution, IESPerson, Organization, Turn, Employee, FileType, $upload, config, ngToast, $routeParams) {
        $scope.priorities = Priority.query();
        $scope.processTypes = ProcessType.query();
        $scope.fileMask = config.fileMask;
        $scope.senderTypes = SenderType.query();
        $scope.institutions = Institution.query();
        $scope.organizations = Organization.query();
        $scope.areas = Area.query({idDependencia: [0, 1]});
        $scope.internalAreas = Area.query();
        $scope.files = [];
        $scope.fileTypes = FileType.query({tipo: 1});
        var original = Turn.get({year: $routeParams.anio, seq: $routeParams.id});

        original.$promise.then(function () {
            $scope.turno = {
                anio: original.anio,
                id: original.id,
                fechaAlta: original.fechaAlta,
                fechaRecepcion: original.fechaRecepcion,
                prioridad: original.prioridad.id,
                archivos: original.archivos ? original.archivos : [],
                tipoTramite: original.tipoTramite.id,
                turnoDGESU: original.turnoDGESU,
                numeroOficio: original.numeroOficio,
                fechaOficio: original.fechaOficio,
                tipoRemitente: original.remitente.idTipoRemitente,
                asunto: original.asunto,
                observaciones: original.observaciones,
                remitente: {
                    idInstitucion: original.remitente.idInstitucion ? original.remitente.idInstitucion : undefined,
                    idPersona: original.remitente.idPersona ? original.remitente.idPersona : undefined,
                    idOrganismo: original.remitente.idOrganismo ? original.remitente.idOrganismo : undefined,
                    cargo: original.remitente.cargo ? original.remitente.cargo : undefined,
                    nombre: original.remitente.nombre ? original.remitente.nombre : undefined,
                    idArea: original.remitente.idArea ? original.remitente.idArea : undefined,
                    institucion: original.remitente.institucion ? original.remitente.institucion : undefined
                }
            };
            if (original.remitente.idOrganismo) {
                $scope.selectedOrganization = _.find($scope.organizations, function (item) {
                    return item.id == original.remitente.idOrganismo;
                });
            }
            if (original.remitente.idInstitucion) {
                $scope.selectedInstitution = _.find($scope.institutions, function (item) {
                    return item.id == original.remitente.idInstitucion;
                });
                $scope.updateInstitution();
            }
            if (original.remitente.idArea) {
                $scope.selectedArea = _.find($scope.internalAreas, function (item) {
                    return item.id == original.remitente.idArea;
                });
                $scope.updateArea();
            }
        });

        $scope.openReceptionDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.receptionDateOpen = true;
        };

        $scope.openDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.dateOpen = true;
        };

        $scope.updateInstitution = function (clear) {
            $scope.turno.remitente.idInstitucion = $scope.selectedInstitution.id;
            $scope.IESpeople = IESPerson.query({idIES: $scope.turno.remitente.idInstitucion});
            if (clear)
                $scope.clearPerson();
            else {
                $scope.IESpeople.$promise.then(function () {
                    $scope.selectedPerson = _.find($scope.IESpeople, function (item) {
                        return item.id == $scope.turno.remitente.idPersona;
                    });
                    $scope.setPerson();
                });
            }
        };

        $scope.updateArea = function (clear) {
            $scope.turno.remitente.idArea = $scope.selectedArea.id;
            $scope.employees = Employee.query({idAreaOperativa: $scope.turno.remitente.idArea});
            if (clear)
                $scope.clearPerson();
            else {
                $scope.employees.$promise.then(function () {
                    $scope.selectedPerson = _.find($scope.employees, function (item) {
                        return item.id == $scope.turno.remitente.idPersona;
                    });
                    $scope.setPerson();
                });
            }
        };

        $scope.deleteFile = function (file) {
            var i = $scope.turno.archivos.indexOf(file);
            $scope.turno.archivos.splice(i, 1);
        };

        $scope.clearPerson = function () {
            $scope.turno.remitente.idPersona = null;
            $scope.position = "";
        };

        $scope.setPerson = function () {
            $scope.turno.remitente.idPersona = $scope.selectedPerson.id;
            if ($scope.turno.tipoRemitente == 1)
                $scope.position = $scope.selectedPerson.cargoIes.nombre;
        };

        $scope.getCode911 = function (institutionCode) {
            var institution = _.findWhere($scope.institutions, {
                id: institutionCode
            });
            return institution.clave911;
        };

        $scope.save = function (form) {
            $scope.submitted = true;
            if (!form.$valid || $scope.turno.archivos.length == 0) {
                ngToast.create({
                    content: '<span class="glyphicon glyphicon-exclamation-sign"></span> Es necesario ingresar todos los datos requeridos',
                    'class': 'danger'
                });
                return false;
            }
            console.log(JSON.stringify($scope.turno));
            Turn.update({year: $scope.turno.anio, seq: $scope.turno.id}, $scope.turno, function (data) {
                ngToast.create({
                    content: '<span class="glyphicon glyphicon-ok"></span> Turno actualizado correctamente',
                    'class': 'success'
                });
            }, function (error) {
                ngToast.create({
                    content: '<span class="glyphicon glyphicon-exclamation-sign"></span> Ocurrio un error al guardar los datos =(',
                    'class': 'danger'
                });
            });
        };

        $scope.$watch('files', function () {
            for (var i = 0; i < $scope.files.length; i++) {
                var file = $scope.files[i];
                if (file.size > config.maxFileSize) {
                    ngToast.create({
                        content: '<span class="glyphicon glyphicon-warning-sign"></span> Archivo demasiado grande: ' + file.name + " (" + file.size + " Kb)",
                        'class': 'warning'
                    });
                    continue;
                }
                if (_.find($scope.turno.archivos, function (item) {
                        return item.nombre == file.name;
                    })) {
                    ngToast.create({
                        content: '<span class="glyphicon glyphicon-warning-sign"></span> Archivo ya existe: ' + file.name,
                        'class': 'warning'
                    });
                    continue;
                }
                $scope.upload = $upload.upload({
                    url: config.apiUrl + "/archivo/upload",
                    method: 'POST',
                    file: file
                }).success(function (data, status, headers, config) {
                    var newFile = {
                        nombre: config.file.name,
                        nombreTemporal: data.nombreArchivoTemporal,
                        tipo: config.file.type,
                        size: config.file.size
                    };
                    $scope.turno.archivos.push(newFile);
                }).error(function (error) {
                    console.log(error);
                });
            }
        });
    }]);

turnosControllers.controller('BuscaTurnoController', ['$scope', '$filter', '$http', 'dialogs', 'Organization', 'SenderType', 'Area', 'Institution', 'Position', 'Employee', 'Turn', 'Status', 'ngToast',
    function ($scope, $filter, $http, dialogs, Organization, SenderType, Area, Institution, Position, Employee, Turn, Status, ngToast) {
        $scope.senderTypes = SenderType.query();
        $scope.organizations = Organization.query();
        $scope.institutions = Institution.query();
        $scope.employees = Employee.query();
        $scope.stati = Status.query();
        $scope.areas = Area.query();
        $scope.today = new Date();
        $scope.query = {};

        $scope.getStatus = function (id) {
            var area = _.findWhere($scope.stati, {
                id: id
            });
            return area.descripcion;
        };

        $scope.search = function () {
            $scope.query.capturaDesde = $filter('date')($scope.capturaDesde, 'yyyy-MM-dd');
            $scope.query.capturaHasta = $filter('date')($scope.capturaHasta, 'yyyy-MM-dd');
            $scope.query.recepcionDesde = $filter('date')($scope.recepcionDesde, 'yyyy-MM-dd');
            $scope.query.recepcionHasta = $filter('date')($scope.recepcionHasta, 'yyyy-MM-dd');
            $scope.query.cierreDesde = $filter('date')($scope.cierreDesde, 'yyyy-MM-dd');
            $scope.query.cierreHasta = $filter('date')($scope.cierreHasta, 'yyyy-MM-dd');
            $scope.turns = Turn.query($scope.query);
        };

        $scope.openDatePicker = function ($event, variable) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope[variable] = true;
        };

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
    }]);

turnosControllers.controller('rechazarDialogController', ['$scope', '$modalInstance', 'data', 'Turn', function ($scope, $modalInstance, data, Turn) {
    $scope.turn = data;

    $scope.ok = function () {
        var response = Turn.close({
            anio: data.anio,
            idTurno: data.id,
            observaciones: $scope.nota
        });
        response.$promise.then(function (message) {
            $modalInstance.close(message);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('Canceled');
    };
}]);

turnosControllers.controller('cerrarDialogController', ['$scope', '$modalInstance', 'data', 'Turn', function ($scope, $modalInstance, data, Turn) {
    $scope.turn = data;

    $scope.ok = function () {
        var response = Turn.reject({
            anio: data.anio,
            idTurno: data.id,
            observaciones: $scope.nota
        });
        response.$promise.then(function (message) {
            $modalInstance.close(message);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('Canceled');
    };
}]);

turnosControllers.controller('archivosDialogController', ['$scope', '$modalInstance', 'data', 'Turn', 'FileType', 'config', function ($scope, $modalInstance, data, Turn, FileType, config) {
    $scope.files = Turn.files({year: data.anio, seq: data.id});
    var fileTypes = FileType.query();
    $scope.getFileType = function (id) {
        var fileType = _.find(fileTypes, function (item) {
            return item.id == id;
        });
        return fileType.descripcion;
    };
    $scope.baseUrl = config.apiUrl;
    $scope.ok = function () {
        $modalInstance.dismiss('Closed');
    };
}]);

turnosControllers.controller('verDialogController', ['$scope', '$modalInstance', 'data', 'Area', 'Institution', 'IESPerson', 'Organization', 'Turn', 'Employee', function ($scope, $modalInstance, data, Area, Institution, IESPerson, Organization, Turn, Employee) {
    $scope.turn = Turn.get({year: data.anio, seq: data.id});

    $scope.turn.$promise.then(function (data) {
        console.log(data.remitente);
        if (data.remitente.idTipoRemitente == 1) {
            $scope.person = IESPerson.get({id: data.remitente.idPersona});
            $scope.institution = Institution.get({id: data.remitente.idInstitucion});
        }
        if (data.remitente.idTipoRemitente == 2) {
            $scope.organization = Organization.get({id: data.remitente.idOrganismo});
        }
        if (data.remitente.idTipoRemitente == 3) {
            $scope.person = Employee.get({id: data.remitente.idPersona});
            $scope.area = Area.get({id: data.remitente.idArea});
        }
    });

    $scope.ok = function () {
        $modalInstance.dismiss('Closed');
    };
}]);

turnosControllers.controller('asignarDialogController', ['$scope', '$modalInstance', 'data', 'Turn', 'Area', 'Employee', 'ResponseTime', 'ngToast', function ($scope, $modalInstance, data, Turn, Area, Employee, ResponseTime, ngToast) {
    $scope.turn = data;
    $scope.areas = Area.query({idDependencia: [data.asignacion.areaOperativa.id]});
    $scope.employees = Employee.query({idAreaOperativa: data.asignacion.areaOperativa.id});
    $scope.responseTimes = ResponseTime.query();

    $scope.ok = function (form) {
        $scope.submitted = true;
        if (!form.$valid) {
            ngToast.create({
                content: '<span class="glyphicon glyphicon-exclamation-sign"></span> Es necesario ingresar todos los datos requeridos',
                'class': 'danger'
            });
            return false;
        }
        var response = Turn.assign({
            anio: data.anio,
            idTurno: data.id,
            observaciones: $scope.nota,
            idTiempoRespuesta: $scope.idTiempo,
            idAreaOperativa: ($scope.type == 1) ? $scope.idAreaOperativa : data.asignacion.areaOperativa.id,
            idEmpleado: $scope.idEmpleado
        });
        response.$promise.then(function (message) {
            $modalInstance.close(message);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('Canceled');
    };
}]);