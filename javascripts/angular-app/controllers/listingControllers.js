var listingControllers = angular.module('listingControllers', []);

/**
 * Controller to search Realtors
 */
listingControllers.controller('ListingController', ['$scope', 'Listing', 'Board', '$http', function ($scope, Listing, Board, $http) {

    $scope.query = {};
    $scope.boards = Board.query();

    $scope.submit = function () {
        if ($scope.query.board && $scope.query.mls)
            refreshContent($scope.query);
    };

    /**
     * TODO: write an interceptor instead of this
     * @returns {Number}
     */
    $scope.isLoading = function () {
        return $http.pendingRequests.length;
    };

    /**
     * This function is invoked when the list needs to be refreshed (query or page changes)
     * @param query
     */
    function refreshContent(query) {
        $scope.response = Listing.query({
            mls: query.mls,
            "include-raw": (query.raw) ? 'true' : undefined,
            board: query.board
        });
    }
}]);