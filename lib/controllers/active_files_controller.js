module.exports = function(app){
  app.controller("ActiveFilesController", ['$scope','$window', function ($scope, $window) {
    const livewriting = require('livewriting');
    $scope.FileListData = [];
    $scope.isRecording = false;
    $scope.recordingMessage = "Record";
    $scope.recordingButtonMessage = "Record";
    $scope.selectedFile;
    $scope.isSelected = false;
    $scope.isExpanded = false;
    for (file of atom.workspace.getTextEditors()) {
      $scope.FileListData.push({
        name : file.getTitle(),
        checked : false,
        disabled : false,
        editor : file
      });
    }

    atom.workspace.onDidAddPaneItem(function(object){
      console.log("reached");
      $scope.FileListData.push({
        name : object['item'].getTitle(),
        checked : false,
        disabled : $scope.isRecording,
        editor : object['item']
      });
      $scope.$apply();
    })

    atom.workspace.onDidDestroyPaneItem(function(object){
      var name_to_delete = object['item'].getTitle();
      if($scope.isSelected){
        if(name_to_delete == $scope.selectedFile.name){
          if($scope.isRecording)
            $scope.stopRecording();
          else
            $scope.handle_radio_change($scope.selectedFile);
        }
      }
      var count = 0;
      for(file of $scope.FileListData) {
        if(file.name == name_to_delete)
          $scope.FileListData.splice(count,1);
        count++;
      }
      if($scope.FileListData.length == 0)
        $scope.isExpanded = false;
      $scope.$apply();
    })

    $scope.handle_radio_change = function(file_in){
      if($scope.selectedFile == file_in){
        $scope.selectedFile.checked = false;
        $scope.selectedFile = null;
        $scope.isSelected = false;
        $scope.recordingButtonMessage = "Record";
      } else {
        if($scope.selectedFile != null){
            $scope.selectedFile.checked = false;
        }
        $scope.selectedFile = file_in;
        $scope.selectedFile.checked = true;
        $scope.isSelected = true;
        $scope.recordingButtonMessage = "Record " + $scope.selectedFile.name;
      }
    }

    $scope.stopRecording = function(){
      if($window.confirm("Do you wish to save this recording?")){
        $scope.saveJSON();
      }
      for (file in $scope.FileListData)
        $scope.FileListData[file].disabled = false;
      $scope.recordingMessage = "Please select a file";
      $scope.recordingButtonMessage = "Record";
      $scope.selectedFile.checked = false;
      $scope.isRecording = false;
      $scope.isExpanded = false;
      $scope.isSelected = false;
      $scope.selectedFile = null;
    }

    $scope.startRecording = function(){
      for (file in $scope.FileListData) {
        $scope.FileListData[file].disabled = true;
      }
      if($scope.selectedFile.editor.livewriting == null){
        $scope.selectedFile.editor.livewriting = livewriting;
        // MAKE LIVEWRITING MAIN FUNCTION COMMAND -- NEED TO ADD WHEN I LEARN HOW TO
      }
      $scope.isExpanded = false;
      $scope.isRecording = true;
      $scope.recordingMessage = "Recording " + $scope.selectedFile.name;
      $scope.recordingButtonMessage = "Stop recording";
    }

    $scope.saveJSON = function(){
      var File, file_to_create, file_path, directory_to_create, dir_path, date;
      Directory = require('atom').Directory;
      file_path = $scope.selectedFile.editor.getPath();
      dir_path = file_path.substring(0,file_path.lastIndexOf("/"));
      directory_to_create = new Directory(dir_path + "/.lw-recordings");
      if(directory_to_create.exists() == false)
        directory_to_create.create();
      File = require('atom').File;
      file_to_create = new File(directory_to_create.getPath() + "/lw~" +
        $scope.selectedFile.name + "~" + (new Date()).getTime() + ".txt");
      file_to_create.create();
    }

    $scope.dropdown = function(){
      $scope.isExpanded = !$scope.isExpanded;
      if($scope.isExpanded)
        $scope.recordingMessage = "Please select a file";
      else
        $scope.recordingMessage = "Record";
    }

    $scope.record = function(){
      $scope.isRecording = !$scope.isRecording;
      if($scope.isRecording == false){
        $scope.stopRecording();
      } else {
        $scope.startRecording();
      }
    }

  }]);
};
console.log("active_files_controller.js");
