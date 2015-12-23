(function () {
    'use strict';

    var moduleID = 'FeedApp';
    var servID = 'FeedService';

    angular
        .module(moduleID)
        .service(servID, FeedService);

    FeedService.$inject = ['$http'];
    function FeedService($http) {

        this.getSubs = getSubs;
        this.fetchData = fetchData;
        this.lookupRSS = lookupRSS;
        
        ////////////////
        function getSubs() {
            return $http.get('subscriptions.json');
        }

        function fetchData(cnt, url) {
            return $http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&num=' + cnt + '&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
        
        //to search in a url if it has rss link
        function lookupRSS(cnt, url) {
            return $http.jsonp('https://ajax.googleapis.com/ajax/services/feed/lookup?v=2.0&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
    }
})();