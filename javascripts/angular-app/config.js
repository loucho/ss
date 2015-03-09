var config = angular.module('config', []);

config.constant('config', {
    apiUrl: "http://192.168.15.177:8080/SIIFI",
    fileMask: "image/*,application/pdf",
    maxFileSize: 20000000
});