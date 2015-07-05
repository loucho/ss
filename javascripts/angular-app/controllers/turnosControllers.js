var turnosControllers = angular.module('turnosControllers', []);

turnosControllers.controller('CapturaTurnoController', ['$scope', '$http', 'dialogs', 'Priority', 'ProcessType', 'SenderType', 'Area', 'Institution', 'IESPerson', 'Organization', 'Turn', 'Employee', 'FileType', '$upload', 'config', 'ngToast', 'Position', 'Subject', 'Responsible', 'Instance', 'Dependency', 'ResponseTime',
    function ($scope, $http, dialogs, Priority, ProcessType, SenderType, Area, Institution, IESPerson, Organization, Turn, Employee, FileType, $upload, config, ngToast, Position, Subject, Responsible, Instance, Dependency, ResponseTime) {
        $scope.priorities = Priority.query();
        $scope.processTypes = ProcessType.query();
        $scope.today = new Date();
        $scope.fileMask = config.fileMask;
        $scope.responseTimes = ResponseTime.query();
        $scope.senderTypes = SenderType.query();
        $scope.institutions = Institution.query();
        $scope.organizations = Organization.query();
        $scope.instances = Instance.query();
        $scope.areas = Area.query({idDependencia: [0, 1]});
        $scope.internalAreas = Area.query();
        $scope.files = [];
        $scope.subjects = Subject.query();
        $scope.turno = {remitente: {}, archivos: []};
        $scope.fileTypes = FileType.query({tipo: 1});

        $scope.openDatePicker = function ($event, variable) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope[variable] = true;
        };

        $scope.limpiaRemitente = function () {
            $scope.turno.remitente = {};
            $scope.selectedArea = null;
            $scope.selectedInstitution = null;
            $scope.selectedOrganization = null;
            $scope.selectedPosition = null;
            $scope.selectedInstance = null;
            $scope.selectedDependency = null;
        };

        $scope.updateInstitution = function () {
            $scope.turno.remitente.idInstitucion = $scope.selectedInstitution ? $scope.selectedInstitution.id : null;
            $scope.positions = $scope.selectedInstitution ? Position.query({idIES: $scope.turno.remitente.idInstitucion}) : [];
            $scope.selectedPosition = null;
            $scope.clearPerson();
            $scope.IESpeople = [];
        };

        $scope.setPosition = function () {
            $scope.IESpeople = $scope.selectedPosition ? IESPerson.query({
                idIES: $scope.turno.remitente.idInstitucion,
                idCargo: $scope.selectedPosition.id
            }) : [];
            $scope.clearPerson();
        };

        $scope.updateInstance = function () {
            $scope.turno.remitente.idInstancia = $scope.selectedInstance ? $scope.selectedInstance.id : null;
            $scope.dependencies = $scope.selectedInstance ? Dependency.query({idInstancia: $scope.turno.remitente.idInstancia}) : [];
            $scope.selectedDependency = null;
            $scope.clearPerson();
            $scope.responsibles = [];
        };

        $scope.setDependency = function () {
            $scope.turno.remitente.idArea = $scope.selectedDependency ? $scope.selectedDependency.id : null;
            $scope.responsibles = $scope.selectedDependency ? Responsible.query({
                idDependencia: $scope.selectedDependency.id
            }) : [];
            $scope.clearPerson();
        };

        $scope.updateArea = function () {
            $scope.turno.remitente.idArea = $scope.selectedArea ? $scope.selectedArea.id : null;
            $scope.employees = $scope.selectedArea ? Employee.query({idAreaOperativa: $scope.turno.remitente.idArea}) : [];
            $scope.clearPerson();
        };

        $scope.deleteFile = function (file) {
            var i = $scope.turno.archivos.indexOf(file);
            $scope.turno.archivos.splice(i, 1);
        };

        $scope.clearPerson = function () {
            $scope.turno.remitente.idPersona = null;
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

turnosControllers.controller('CorrigeTurnoController', ['$scope', '$http', 'dialogs', 'Priority', 'ProcessType', 'SenderType', 'Area', 'Institution', 'IESPerson', 'Organization', 'Turn', 'Employee', 'FileType', '$upload', 'config', 'ngToast', '$routeParams', '$q', 'Position', 'Subject', 'Instance', 'Dependency', 'Responsible',
    function ($scope, $http, dialogs, Priority, ProcessType, SenderType, Area, Institution, IESPerson, Organization, Turn, Employee, FileType, $upload, config, ngToast, $routeParams, $q, Position, Subject, Instance, Dependency, Responsible) {
        $scope.priorities = Priority.query();
        $scope.processTypes = ProcessType.query();
        $scope.subjects = Subject.query();
        $scope.today = new Date();
        $scope.fileMask = config.fileMask;
        $scope.senderTypes = SenderType.query();
        $scope.institutions = Institution.query();
        $scope.instances = Instance.query();
        $scope.organizations = Organization.query();
        $scope.areas = Area.query({idDependencia: [0, 1]});
        $scope.internalAreas = Area.query();
        $scope.files = [];
        $scope.fileTypes = FileType.query({tipo: 1});

        $q.all([
            $scope.priorities.$promise,
            $scope.processTypes.$promise,
            $scope.senderTypes.$promise,
            $scope.institutions.$promise,
            $scope.organizations.$promise,
            $scope.areas.$promise,
            $scope.internalAreas.$promise,
            $scope.fileTypes.$promise
        ]).then(function () {
            var original = Turn.get({year: $routeParams.anio, seq: $routeParams.id});
            original.$promise.then(function () {
                $scope.observaciones = original.observaciones;
                $scope.turno = {
                    anio: original.anio,
                    id: original.id,
                    fechaAlta: original.fechaAlta,
                    fechaRecepcion: original.fechaRecepcion,
                    fechaRecepcionDGESU: original.fechaRecepcionDGESU,
                    prioridad: original.prioridad.id,
                    archivos: original.archivos ? original.archivos : [],
                    tipoTramite: original.tipoTramite.id,
                    turnoDGESU: original.turnoDGESU,
                    numeroOficio: original.numeroOficio,
                    fechaOficio: original.fechaOficio,
                    tipoRemitente: original.remitente.idTipoRemitente,
                    asunto: original.descripcionAsunto,
                    idAsunto: original.asunto.id,
                    remitente: {
                        idInstitucion: original.remitente.idInstitucion ? original.remitente.idInstitucion : undefined,
                        idPersona: original.remitente.idPersona ? original.remitente.idPersona : undefined,
                        idInstancia: original.remitente.idInstancia ? original.remitente.idInstancia : undefined,
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
                if (original.remitente.idInstancia) {
                    $scope.selectedInstance = _.find($scope.instances, function (item) {
                        return item.id == original.remitente.idInstancia;
                    });
                    $scope.updateInstance();
                }
                if (original.remitente.idArea) {
                    $scope.selectedArea = _.find($scope.internalAreas, function (item) {
                        return item.id == original.remitente.idArea;
                    });
                    $scope.updateArea();
                }
            });
        });

        $scope.openDatePicker = function ($event, variable) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope[variable] = true;
        };

        $scope.limpiaRemitente = function () {
            $scope.turno.remitente = {};
            $scope.selectedArea = null;
            $scope.selectedInstitution = null;
            $scope.selectedOrganization = null;
            $scope.selectedPosition = null;
            $scope.selectedInstance = null;
            $scope.selectedDependency = null;
        };

        $scope.updateInstitution = function (clear) {
            $scope.turno.remitente.idInstitucion = $scope.selectedInstitution ? $scope.selectedInstitution.id : null;
            $scope.selectedPosition = null;
            $scope.positions = $scope.selectedInstitution ? Position.query({idIES: $scope.turno.remitente.idInstitucion}) : [];
            if (clear) {
                $scope.clearPerson();
                $scope.IESpeople = [];
            }
            else {
                $scope.positions.$promise.then(function () {
                    IESPerson.get({id: $scope.turno.remitente.idPersona}, function (person) {
                        $scope.selectedPosition = _.find($scope.positions, function (item) {
                            return item.id == person.cargoIes.id;
                        });
                        $scope.setPosition();
                    });
                });
            }
        };

        $scope.updateInstance = function (clear) {
            $scope.turno.remitente.idInstancia = $scope.selectedInstance ? $scope.selectedInstance.id : null;
            $scope.dependencies = $scope.selectedInstance ? Dependency.query({idInstancia: $scope.turno.remitente.idInstancia}) : [];
            $scope.selectedDependency = null;
            if (clear) {
                $scope.clearPerson();
                $scope.responsibles = [];
            }
            else {
                $scope.dependencies.$promise.then(function () {
                    $scope.selectedDependency = _.find($scope.dependencies, function (item) {
                        return item.id == $scope.turno.remitente.idArea;
                    });
                    $scope.setDependency(false);
                });
            }
        };

        $scope.setDependency = function (clear) {
            $scope.turno.remitente.idArea = $scope.selectedDependency ? $scope.selectedDependency.id : null;
            $scope.responsibles = $scope.selectedDependency ? Responsible.query({
                idDependencia: $scope.selectedDependency.id
            }) : [];
            if (clear) {
                $scope.clearPerson();
            }
            else {

            }
        };

        $scope.updateArea = function (clear) {
            $scope.turno.remitente.idArea = $scope.selectedArea ? $scope.selectedArea.id : null;
            $scope.employees = $scope.selectedArea ? Employee.query({idAreaOperativa: $scope.turno.remitente.idArea}) : [];
            if (clear)
                $scope.clearPerson();
        };

        $scope.deleteFile = function (file) {
            var i = $scope.turno.archivos.indexOf(file);
            $scope.turno.archivos.splice(i, 1);
        };

        $scope.clearPerson = function () {
            $scope.turno.remitente.idPersona = null;
        };

        $scope.setPosition = function (clear) {
            $scope.IESpeople = $scope.selectedPosition ? IESPerson.query({
                idIES: $scope.turno.remitente.idInstitucion,
                idCargo: $scope.selectedPosition.id
            }) : [];
            if (clear)
                $scope.clearPerson();
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

turnosControllers.controller('BuscaTurnoController', ['$scope', '$filter', '$http', 'dialogs', 'Organization', 'SenderType', 'Area', 'Institution', 'Position', 'Employee', 'Turn', 'Status', 'config',
    function ($scope, $filter, $http, dialogs, Organization, SenderType, Area, Institution, Position, Employee, Turn, Status, config) {
        $scope.senderTypes = SenderType.query();
        $scope.organizations = Organization.query();
        $scope.institutions = Institution.query();
        $scope.employees = Employee.query();
        $scope.stati = Status.query();
        $scope.areas = Area.query();
        $scope.today = new Date();
        $scope.baseUrl = config.apiUrl;
        $scope.query = {};
        $scope.maxSize = 5;
        $scope.itemsPerPage = 10;
        $scope.currentPage = 1;
        var options = {};

        $scope.pageChanged = function () {
            refreshContent(null, $scope.currentPage);
        };

        $scope.$on('event:status-changed', function () {
            $scope.pageChanged();
        });

        $scope.getElement = function (id) {
            if (id == 1)
                return 'Para trámite correspondiente';
            else
                return 'Para conocimiento y conservación';
        };

        $scope.getQuery = function () {
            return qs(getOptions());
        };

        function qs(obj) {
            var str = [];
            for (var p in obj) {
                var v = obj[p];
                if (v != undefined)
                    str.push((p) + "=" + encodeURIComponent(v));
            }
            return str.join("&");
        }

        $scope.getStatus = function (id) {
            var area = _.findWhere($scope.stati, {
                id: id
            });
            return area.descripcion;
        };

        $scope.search = function () {

            $scope.currentPage = 1;
            refreshContent(getOptions(), 1);
        };

        function getOptions() {
            $scope.query.capturaDesde = $filter('date')($scope.capturaDesde, 'yyyy-MM-dd');
            $scope.query.capturaHasta = $filter('date')($scope.capturaHasta, 'yyyy-MM-dd');
            $scope.query.recepcionDesde = $filter('date')($scope.recepcionDesde, 'yyyy-MM-dd');
            $scope.query.recepcionHasta = $filter('date')($scope.recepcionHasta, 'yyyy-MM-dd');
            $scope.query.cierreDesde = $filter('date')($scope.cierreDesde, 'yyyy-MM-dd');
            $scope.query.cierreHasta = $filter('date')($scope.cierreHasta, 'yyyy-MM-dd');
            return {
                capturaDesde: $scope.query.capturaDesde ? $scope.query.capturaDesde : undefined,
                capturaHasta: $scope.query.capturaHasta ? $scope.query.capturaHasta : undefined,
                recepcionDesde: $scope.query.recepcionDesde ? $scope.query.recepcionDesde : undefined,
                recepcionHasta: $scope.query.recepcionHasta ? $scope.query.recepcionHasta : undefined,
                cierreDesde: $scope.query.cierreDesde ? $scope.query.cierreDesde : undefined,
                cierreHasta: $scope.query.cierreHasta ? $scope.query.cierreHasta : undefined,
                anio: $scope.query.anio ? $scope.query.anio : undefined,
                id: $scope.query.id ? $scope.query.id : undefined,
                idAreaAsignada: $scope.query.idAreaAsignada ? $scope.query.idAreaAsignada : undefined,
                estatus: $scope.query.estatus ? [$scope.query.estatus] : undefined,
                dgesu: $scope.query.dgesu ? $scope.query.dgesu : undefined,
                idEmpleado: $scope.query.idEmpleado ? $scope.query.idEmpleado : undefined,
                tipoRemitente: $scope.query.tipoRemitente ? $scope.query.tipoRemitente : undefined,
                idInstitucion: $scope.query.idInstitucion ? $scope.query.idInstitucion : undefined,
                idArea: $scope.query.idArea ? $scope.query.idArea : undefined,
                idOrganismo: $scope.query.idOrganismo ? $scope.query.idOrganismo : undefined
            };
        }

        function refreshContent(query, page) {
            $scope.loading = true;
            if (query) {
                options = query;
            }
            options.limit = $scope.itemsPerPage;
            options.offset = (page - 1) * $scope.itemsPerPage;
            $scope.turns = Turn.query(options, function (data, headers) {
                $scope.loading = false;
                $scope.totalItems = headers('Total');
            });
        }

        $scope.openDatePicker = function ($event, variable) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope[variable] = true;
        };
    }
]);

turnosControllers.controller('rechazarDialogController', ['$scope', '$modalInstance', 'data', 'Turn', function ($scope, $modalInstance, data, Turn) {
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

turnosControllers.controller('cerrarDialogController', ['$scope', '$modalInstance', 'data', 'Turn', '$upload', 'config', 'FileType', 'ngToast', function ($scope, $modalInstance, data, Turn, $upload, config, FileType, ngToast) {
    $scope.turn = data;
    $scope.fileMask = config.fileMask;
    $scope.fileTypes = FileType.query({tipo: 2});

    $scope.deleteFile = function () {
        $scope.file = false;
    };

    $scope.$watch('files', function () {
        if ($scope.files) {
            var file = $scope.files[0];
            if (file.size > config.maxFileSize) {
                ngToast.create({
                    content: '<span class="glyphicon glyphicon-warning-sign"></span> Archivo demasiado grande: ' + file.name + " (" + file.size + " Kb)",
                    'class': 'warning'
                });
                return false;
            }
            $scope.upload = $upload.upload({
                url: config.apiUrl + "/archivo/upload",
                method: 'POST',
                file: file
            }).success(function (data, status, headers, config) {
                $scope.error = null;
                $scope.file = {
                    nombre: config.file.name,
                    nombreTemporal: data.nombreArchivoTemporal,
                    tipo: config.file.type,
                    size: config.file.size
                }
            }).error(function (error) {
                $scope.error = error;
            });
        }
    });

    $scope.ok = function (form) {
        $scope.submitted = true;
        if (!form.$valid || !$scope.file) {
            ngToast.create({
                content: '<span class="glyphicon glyphicon-exclamation-sign"></span> Es necesario agregar un archivo',
                'class': 'danger'
            });
            return false;
        }
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

turnosControllers.controller('archivosDialogController', ['$scope', '$modalInstance', 'data', 'Turn', 'FileType', 'config', function ($scope, $modalInstance, data, Turn, FileType, config) {
    $scope.files = Turn.files({year: data.anio, seq: data.id});
    $scope.turn = data;
    var fileTypes = FileType.query();

    $scope.getFileType = function (id) {
        var fileType = _.find(fileTypes, function (item) {
            return item.id == id;
        });
        return fileType.descripcion;
    };

    $scope.getFileTypeType = function (id) {
        var fileType = _.find(fileTypes, function (item) {
            return item.id == id;
        });
        return fileType.tipo == 1 ? 'ENTRADA' : 'SALIDA';
    };

    $scope.baseUrl = config.apiUrl;
    $scope.ok = function () {
        $modalInstance.dismiss('Closed');
    };
}]);

turnosControllers.controller('verDialogController', ['$scope', '$modalInstance', 'data', 'Area', 'Institution', 'IESPerson', 'Organization', 'Turn', 'Employee', 'config', 'Responsible', 'Dependency', 'Instance', function ($scope, $modalInstance, data, Area, Institution, IESPerson, Organization, Turn, Employee, config, Responsible, Dependency, Instance) {
    $scope.turn = Turn.get({year: data.anio, seq: data.id});
    $scope.baseUrl = config.apiUrl;

    $scope.turn.$promise.then(function (data) {
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
        if (data.remitente.idTipoRemitente == 5) {
            $scope.person = Responsible.get({id: data.remitente.idPersona});
            $scope.instance = Instance.get({id: data.remitente.idInstancia});
            $scope.dependency = Dependency.get({id: data.remitente.idArea});
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

turnosControllers.controller('atenderDialogController', ['$scope', '$modalInstance', 'data', 'Turn', 'ngToast', 'config', '$upload', 'FileType', function ($scope, $modalInstance, data, Turn, ngToast, config, $upload, FileType) {
    $scope.turn = data;
    $scope.fileMask = config.fileMask;
    $scope.turn.comments = Turn.comments({year: data.anio, seq: data.id});
    $scope.fileTypes = FileType.query({tipo: 2});

    $scope.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.dateOpen = true;
    };

    $scope.deleteFile = function () {
        $scope.file = false;
    };

    $scope.$watch('files', function () {
        if ($scope.files) {
            var file = $scope.files[0];
            if (file.size > config.maxFileSize) {
                ngToast.create({
                    content: '<span class="glyphicon glyphicon-warning-sign"></span> Archivo demasiado grande: ' + file.name + " (" + file.size + " Kb)",
                    'class': 'warning'
                });
                return false;
            }
            $scope.upload = $upload.upload({
                url: config.apiUrl + "/archivo/upload",
                method: 'POST',
                file: file
            }).success(function (data, status, headers, config) {
                $scope.error = null;
                $scope.file = {
                    nombre: config.file.name,
                    nombreTemporal: data.nombreArchivoTemporal,
                    tipo: config.file.type,
                    size: config.file.size
                }
            }).error(function (error) {
                $scope.error = error;
            });
        }
    });

    $scope.ok = function (form) {
        $scope.submitted = true;
        if (!form.$valid || !$scope.file) {
            ngToast.create({
                content: '<span class="glyphicon glyphicon-exclamation-sign"></span> Es necesario ingresar todos los datos requeridos',
                'class': 'danger'
            });
            return false;
        }
        var work = {
            observaciones: $scope.nota,
            archivo: $scope.file,
            folio: $scope.folio,
            fechaAtencion: $scope.fechaAtencion
        };
        var response = Turn.work({year: data.anio, seq: data.id}, work);
        response.$promise.then(function (message) {
            $modalInstance.close(message);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('Canceled');
    };
}]);

turnosControllers.controller('editarAtencionDialogController', ['$scope', '$modalInstance', 'data', 'Turn', 'ngToast', 'config', '$upload', 'FileType', function ($scope, $modalInstance, data, Turn, ngToast, config, $upload, FileType) {
    $scope.turn = data;
    $scope.fileMask = config.fileMask;
    $scope.turn.comments = Turn.comments({year: data.anio, seq: data.id});
    $scope.atencion = Turn.getWork({year: data.anio, seq: data.id});
    $scope.fileTypes = FileType.query({tipo: 2});

    $scope.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.dateOpen = true;
    };

    $scope.deleteFile = function () {
        $scope.atencion.archivo = false;
    };

    $scope.$watch('files', function () {
        if ($scope.files) {
            var file = $scope.files[0];
            if (file.size > config.maxFileSize) {
                ngToast.create({
                    content: '<span class="glyphicon glyphicon-warning-sign"></span> Archivo demasiado grande: ' + file.name + " (" + file.size + " Kb)",
                    'class': 'warning'
                });
                return false;
            }
            $scope.upload = $upload.upload({
                url: config.apiUrl + "/archivo/upload",
                method: 'POST',
                file: file
            }).success(function (data, status, headers, config) {
                $scope.error = null;
                $scope.atencion.archivo = {
                    nombre: config.file.name,
                    nombreTemporal: data.nombreArchivoTemporal,
                    tipo: config.file.type,
                    size: config.file.size
                }
            }).error(function (error) {
                $scope.error = error;
            });
        }
    });

    $scope.ok = function (form) {
        $scope.submitted = true;
        if (!form.$valid || !$scope.atencion.archivo) {
            ngToast.create({
                content: '<span class="glyphicon glyphicon-exclamation-sign"></span> Es necesario ingresar todos los datos requeridos',
                'class': 'danger'
            });
            return false;
        }
        var response = Turn.updateWork({year: data.anio, seq: data.id}, $scope.atencion);
        response.$promise.then(function (message) {
            $modalInstance.close(message);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('Canceled');
    };
}]);