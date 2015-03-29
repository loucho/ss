var SEPServices = angular.module('SEPServices', ['ngResource', 'config']);

SEPServices.factory('Priority', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/prioridad', {}, {});
}]);

SEPServices.factory('ProcessType', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/tipo-tramite', {}, {});
}]);

SEPServices.factory('SenderType', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/tipo-remitente', {}, {});
}]);

SEPServices.factory('Institution', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/ies/:id', {}, {});
}]);

SEPServices.factory('Organization', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/organismo/:id', {}, {});
}]);

SEPServices.factory('Position', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/cargo', {}, {});
}]);

SEPServices.factory('ResponseTime', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/tiempo-respuesta', {}, {});
}]);

SEPServices.factory('FileType', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/tipo-archivo', {}, {});
}]);

SEPServices.factory('IESPerson', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/directorio-instituciones/:id', {}, {});
}]);

SEPServices.factory('Employee', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/empleado/:id', {}, {});
}]);

SEPServices.factory('Area', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/area-interna/:id', {}, {});
}]);

SEPServices.factory('Status', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/estatus/:id', {}, {});
}]);

SEPServices.factory('Turn', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/turno/:year/:seq/:action', {}, {
        close: {
            method: 'POST',
            params: {action: 'cerrar'}
        },
        reject: {
            method: 'POST',
            params: {action: 'rechazar'}
        },
        assign: {
            method: 'POST',
            params: {action: 'asignar'}
        },
        update: {
            method: 'PUT'
        },
        files: {
            method: 'GET',
            isArray: true,
            params: {action: 'archivos'}
        },
        comments: {
            method: 'GET',
            isArray: true,
            params: {action: 'observaciones'}
        },
        work: {
            method: 'POST',
            params: {action: 'atencion'}
        },
        getWork: {
            method: 'GET',
            params: {action: 'atencion'}
        },
        updateWork: {
            method: 'PUT',
            params: {action: 'atencion'}
        },
        acknowledge: {
            method: 'POST',
            params: {action: 'enterar'}
        }
    });
}]);