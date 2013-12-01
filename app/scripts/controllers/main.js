'use strict';

angular.module('nigelWebApp')
  .controller('MainCtrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.chat = "bti build info";
    $scope.output = [];

    var parser = function (message) {
        message = message.replace("search for ", "search with q as ");
        message = message.replace("jira ", "jira with args as ");
        var temp = message.toLowerCase(),
                results;
        temp = temp.split("with");
        if (temp[0]) {
                if (temp[1]) {
                        results = temp[0].split(' ').slice(0, -1).join('/');
                } else {
        results =
            temp[0]
                .replace("who ", "")
                .replace("what ", "")
                .replace("the ", "")
                // .replace("a ", "")
                .replace("an ", "")
                .replace("is ", "")
                .replace("on ", "")
                .replace(/[^a-zA-Z0-9-\s]+/g, "") // Replace any non word character with nothing
                .split(' ');
        if (temp[0].indexOf("who") === 0) {
            // Reverse the order of the arguments so
            // ie.  Who broke the build?
            results = results.reverse();
        }
        results = results.join('/');
                }
        }
        if (temp[1]) {
                temp = temp[1].split('and');
                temp.forEach(function (param, index) {
                        results += index ? '&' : '?';
                        var temp = param.split('as');
                        if (temp[0]) {
                                results += temp[0].trim();
                        }
                        if (temp[1]) {
                                results += '=' + temp[1].trim();
                        }
                });
        }
        return results || "";
    };

    $scope.post = function () {
        $scope.output.push({"user": true, "message": $scope.chat});
        $http.jsonp('http://localhost:3000/' + parser($scope.chat), {
            params: {
                "callback": "JSON_CALLBACK",
                "format": "plain"
            },
            method: "GET"
        }).then(function (res) {
            $scope.output.push({"user": false, "message": JSON.stringify(res.data).replace(new RegExp("\\\\n", 'g'), "\n").replace(new RegExp("\"", 'g'), "")});
        });
    };
  }]);
