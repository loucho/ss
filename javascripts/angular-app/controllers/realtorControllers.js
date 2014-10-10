var realtorControllers = angular.module('realtorControllers', []);

/**
 * Controller to search Realtors
 */
realtorControllers.controller('RealtorController', ['$scope', 'Realtor', 'Board', '$http', function ($scope, Realtor, Board, $http) {

    $scope.query = {};
    $scope.boards = Board.query();

    $scope.submit = function () {
        if ($scope.query.board && ($scope.query.id || $scope.query.firstName || $scope.query.lastName))
            refreshContent($scope.query);
    };

    $scope.clearName = function () {
        $scope.query.firstName = $scope.query.lastName = "";
    };

    $scope.clearId = function () {
        $scope.query.id = "";
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
        $scope.response = Realtor.query({
            id: query.id != "" ? query.id : null,
            firstName: query.firstName != "" ? query.firstName : null,
            lastName: query.lastName != "" ? query.lastName : null,
            board: query.board
        });
    }
}]);