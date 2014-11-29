var SEPServices = angular.module('SEPServices', ['ngResource', 'config']);

SEPServices.factory('Priority', ['$resource', 'config', function ($resource, config) {
    return $resource(config.fakeUrl + '/priorities.json', {}, {});
}]);

SEPServices.factory('ProcessType', ['$resource', 'config', function ($resource, config) {
    return $resource(config.fakeUrl + '/process-types.json', {}, {});
}]);

SEPServices.factory('SenderType', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/tipo-remitente', {}, {});
}]);

SEPServices.factory('Institution', ['$resource', 'config', function ($resource, config) {
    return $resource(config.fakeUrl + '/institutions.json', {}, {});
}]);

SEPServices.factory('Position', ['$resource', 'config', function ($resource, config) {
    return $resource(config.fakeUrl + '/positions.json', {}, {});
}]);

SEPServices.factory('Person', ['$resource', 'config', function ($resource, config) {
    return $resource(config.fakeUrl + '/people.json', {}, {});
}]);

SEPServices.factory('Area', ['$resource', 'config', function ($resource, config) {
    return $resource(config.fakeUrl + '/areas.json', {}, {});
}]);

SEPServices.factory('Turn', ['$resource', 'config', function ($resource, config) {
    return $resource(config.fakeUrl + '/turns.json', {}, {});
}]);