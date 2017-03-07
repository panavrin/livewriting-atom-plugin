module.exports = function(app){

app.controller("ExampleController", ['$scope', function ($scope) {
  const directory = './..';
  const fs = require('fs');
  $scope.file_list = [];
  fs.readdir(directory, (err, files) => {
    files.forEach(file => {
        $scope.file_list.push(file);
    });
  })
  $scope.length = $scope.file_list.length;
}]);

};
console.log("example_controller.js");
