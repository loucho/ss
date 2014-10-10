var redmanServices = angular.module('redmanServices', ['ngResource', 'config']);

redmanServices.factory('Website', ['$resource', 'config', function ($resource, config) {
    return $resource(config.officeToolsHost + '/api/websites/', {}, {
        query: {
            method: 'GET'
        }
    });
}]);

redmanServices.factory('Board', ['$resource', 'config', function ($resource, config) {
    return $resource(config.officeToolsHost + '/api/websites/boards/', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
}]);

redmanServices.factory('SiteType', ['$resource', 'config', function ($resource, config) {
    return $resource(config.officeToolsHost + '/api/websites/types/', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
}]);

redmanServices.factory('TestDomains', ['$resource', 'config', function ($resource, config) {
    return $resource(config.officeToolsHost + '/api/websites/test-domains/', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
}]);

redmanServices.factory('Realtor', ['$resource', 'config', function ($resource, config) {
    return $resource(config.retsToolsHost + '/api/agent-info/:board/:id', {}, {
        query: {
            method: 'GET',
            isArray: false
        }
    });
}]);

redmanServices.factory('Listing', ['$resource', 'config', function ($resource, config) {
    return $resource(config.retsToolsHost + '/api/listing-info/:board/:mls', {}, {
        query: {
            method: 'GET',
            isArray: false
        }
    });
}]);