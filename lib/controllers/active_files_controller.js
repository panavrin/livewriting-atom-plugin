module.exports = function(app){
  app.controller("ActiveFilesController", ['$scope', function ($scope) {
    const livewriting = require('livewriting');
    $scope.FileListData = [];
    for (file of atom.workspace.getTextEditors()) {
      console.log(file);
      $scope.FileListData.push({
        name : file.getTitle(),
        checked : false,
        disabled : false,
        editor : file
      });
    }
    atom.workspace.onDidAddPaneItem(function(object){
      $scope.FileListData.push({
        name : object['item'].getTitle(),
        checked : false,
        disabled : false,
        editor : object['item']
      });
      $scope.$apply();
    })
    atom.workspace.onDidDestroyPaneItem(function(object){
      var name_to_delete = object['item'].getTitle();
      var count = 0;
      for(file of $scope.FileListData) {
        if(file.name == name_to_delete){
          $scope.FileListData.splice(count,1);
        }
        count++;
      }
      $scope.$apply();
    })
    $scope.isRecording = false;
    $scope.recordingMessage = "";
    $scope.record = function(){
      $scope.isRecording = !$scope.isRecording;
      if($scope.isRecording){
        $scope.recordingMessage = "Recording now...";
      } else {
        $scope.recordingMessage = "";
      }
      for (file in $scope.FileListData) {
        if($scope.isRecording == true){
          $scope.FileListData[file].disabled = true;
        } else {
          $scope.FileListData[file].disabled = false;
          if($scope.FileListData[file].checked){
            if($scope.FileListData[file].livewriting == null){
              $scope.FileListData[file].editor.livewriting = livewriting;
            }
          } else {
            if($scope.FileListData[file].livewriting != null){
            }
          }
        }
      }
    }
  }]);
};
console.log("active_files_controller.js");
