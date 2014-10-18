var SEPServices = angular.module('SEPServices', ['ngResource', 'config']);

SEPServices.factory('Priority', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/priorities.json', {}, {});
}]);

SEPServices.factory('ProcessType', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/process-types.json', {}, {});
}]);

SEPServices.factory('SenderType', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/sender-types.json', {}, {});
}]);

SEPServices.factory('Institution', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/institutions.json', {}, {});
}]);

SEPServices.factory('Position', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/positions.json', {}, {});
}]);

SEPServices.factory('Person', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/people.json', {}, {});
}]);

SEPServices.factory('Area', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/areas.json', {}, {});
}]);

SEPServices.factory('Turn', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl + '/turns.json', {}, {});
}]);