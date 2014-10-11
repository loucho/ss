var SEPServices = angular.module('SEPServices', ['ngResource', 'config']);

SEPServices.factory('Website', ['$resource', 'config', function ($resource, config) {
    return $resource(config.officeToolsHost + '/api/websites/', {}, {
        query: {
            method: 'GET'
        }
    });
}]);

SEPServices.factory('Board', ['$resource', 'config', function ($resource, config) {
    return $resource(config.officeToolsHost + '/api/websites/boards/', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
}]);

SEPServices.factory('SiteType', ['$resource', 'config', function ($resource, config) {
    return $resource(config.officeToolsHost + '/api/websites/types/', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
}]);

SEPServices.factory('TestDomains', ['$resource', 'config', function ($resource, config) {
    return $resource(config.officeToolsHost + '/api/websites/test-domains/', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
}]);

SEPServices.factory('Realtor', ['$resource', 'config', function ($resource, config) {
    return $resource(config.retsToolsHost + '/api/agent-info/:board/:id', {}, {
        query: {
            method: 'GET',
            isArray: false
        }
    });
}]);

SEPServices.factory('Listing', ['$resource', 'config', function ($resource, config) {
    return $resource(config.retsToolsHost + '/api/listing-info/:board/:mls', {}, {
        query: {
            method: 'GET',
            isArray: false
        }
    });
}]);