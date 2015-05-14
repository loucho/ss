var config = angular.module('config', []);

config.constant('config', {
    apiUrl: "http://127.0.0.1:8080/SIIFI",
    fileMask: "image/*,application/pdf",
    maxFileSize: 20000000
});