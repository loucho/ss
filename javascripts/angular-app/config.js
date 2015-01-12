var config = angular.module('config', []);

config.constant('config', {
    apiUrl: "http://localhost:8080/SIIFI",
    fileMask: "image/*,application/pdf",
    maxFileSize: 20000000
});