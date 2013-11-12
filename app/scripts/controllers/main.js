'use strict';

angular.module('nigelWebApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.chat = "bti build info";
    $scope.output = [];

    var parser = function (message) {
            var temp = message.toLowerCase(),
                    results;
            temp = temp.split("with");
            if (temp[0]) {
                    if (temp[1]) {
                            results = temp[0].split(' ').slice(0, -1).join('/');
                    } else {
                            results = temp[0].split(' ').join('/');
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
            return results;
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
