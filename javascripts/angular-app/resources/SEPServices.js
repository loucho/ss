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
    return $resource(config.apiUrl + '/ies', {}, {});
}]);

SEPServices.factory('Organization', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/organismo', {}, {});
}]);

SEPServices.factory('Position', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/cargo', {}, {});
}]);

SEPServices.factory('IESPerson', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/directorio-instituciones', {}, {});
}]);

SEPServices.factory('Area', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/area-interna', {}, {});
}]);

SEPServices.factory('Turn', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/turno', {}, {});
}]);