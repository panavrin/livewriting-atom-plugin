module.exports = function(app){

app.controller("DocumentationController", ['$scope', function ($scope) {
  $scope.doc = "";
  $scope.display_doc = function(){
		if($scope.func_input == "playJSON"){
      console.log("reached");
			$scope.doc = "playJSON";
		} else if ($scope.func_input == "create"){
			$scope.doc = "create";
		} else if ($scope.func_input == "register"){
			$scope.doc = "register";
		} else if ($scope.func_input == "userInput"){
			$scope.doc = "userInput";
		} else if ($scope.func_input == "returnActionData"){
			$scope.doc = "returnActionData";
		}
  }
}]);
};
console.log("documentation_controller.js");
