var websiteControllers = angular.module('websiteControllers', []);

// Managing the websites list
websiteControllers.controller('WebsiteListController', ['$scope', 'Website', 'Board', 'SiteType', 'TestDomains', '$http', 'dialogs', function ($scope, Website, Board, SiteType, TestDomains, $http, dialogs) {

    $scope.query = {};
    $scope.query.showDemos = true;
    $scope.query.currentPage = 1;
    $scope.query.itemsPerPage = 10;

    $scope.types = SiteType.query();
    $scope.boards = Board.query();
    $scope.testDomains = TestDomains.query();

    $scope.numbers = [
        {value: 10, name: '10'},
        {value: 20, name: '20'},
        {value: 30, name: '30'},
        {value: 40, name: '40'},
        {value: 50, name: '50'},
        {value: 10000, name: 'ALLTHESITES!!'}
    ];
    $scope.maxSize = 10;
    $scope.currentPage = 1;

    $scope.login = function (website, agent) {
        var options = {
            website: website,
            realtor: agent,
            testDomains: $scope.testDomains
        };
        dialogs.create('/partials/websites/login-dialog.html', 'loginController', options, {size: 'lg', keyboard: true, windowClass: 'my-class'});
    };

    $scope.clearCache = function (websiteId) {
        $http.get('/website_clear_cache.php', {params: {'website_id': websiteId}})
            .success(function (data) {
                if (data.website_id)
                    alert("Cache cleared for website #" + data.website_id);
                else
                    alert("Failed: Probably bad website id. I'm not really sure.");
            }).error(function () {
                alert("Failed: error on http request");
            });
    };

    $scope.pageChanged = function () {
        refreshContent($scope.query, $scope.currentPage);
    };

    /**
     * TODO: write an interceptor instead of this
     * @returns {Number}
     */
    $scope.isLoading = function () {
        return $http.pendingRequests.length;
    };

    $scope.$watchCollection('query', function () {
        $scope.currentPage = 1;
        refreshContent($scope.query, 1);
    });

    /**
     * This function is invoked when the list needs to be refreshed (query or page changes)
     * @param query
     * @param page
     */
    function refreshContent(query, page) {
        $scope.websites = Website.query({
            search: query.search,
            type: query.type,
            board: query.board,
            showDisabled: (query.showDisabled) ? 'true' : undefined,
            hideDemos: (query.showDemos) ? undefined : 1,
            limit: query.itemsPerPage,
            offset: (page - 1) * query.itemsPerPage
        });
        $scope.websites.$promise.then(function (result) {
            $scope.totalItems = result.total;
        });
    }
}]);

websiteControllers.controller('loginController', function ($scope, $modalInstance, data) {

    $scope.data = data;

    $scope.cancel = function () {
        $modalInstance.dismiss('Canceled');
    };
});