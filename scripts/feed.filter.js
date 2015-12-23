(function () {
    'use strict';

    var moduleID = 'FeedApp';
    var filID = 'customDate';

    angular
        .module(moduleID)
        .filter(filID, Filter);

    Filter.$inject = ['$filter'];
    function Filter($filter) {
        return function (value, format) {
            return $filter('date')(new Date(value), format);
        };
    }
})();