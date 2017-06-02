module.exports = function(app){
  app.controller("ActiveFilesController", ['$scope','$window', function ($scope, $window) {
    const livewriting = require('livewriting');
    $scope.FileListData = [];
    // Creates variables for state of recording
    $scope.isRecording = false;
    $scope.recordingMessage = "Please select a file";
    $scope.recordingButtonMessage = "Record";
    // For use when only recording one file at a time
    $scope.selectedFile;
    $scope.isSelected = false;
    $scope.isExpanded = false;

    // Creates initial list of active editors
    for (file of atom.workspace.getTextEditors()) {
      $scope.FileListData.push({
        name : file.getTitle(),
        checked : false,
        disabled : false,
        editor : file
      });
    }

    // Updates list of active text editors if a new file is opened
    atom.workspace.onDidAddPaneItem(function(object){
      $scope.FileListData.push({
        name : object['item'].getTitle(),
        checked : false,
        disabled : $scope.isRecording,
        editor : object['item']
      });
      $scope.$apply();
    })

    // Updates list of active text editors if a file is closed
    atom.workspace.onDidDestroyPaneItem(function(object){
      var name_to_delete = object['item'].getTitle();
      if($scope.isRecording){
        if(name_to_delete == $scope.selectedFile.name)
          $scope.stopRecording();
      }
      var count = 0;
      for(file of $scope.FileListData) {
        if(file.name == name_to_delete)
          $scope.FileListData.splice(count,1);
        count++;
      }
      $scope.$apply();
    })

    // Used when using a radio button and only recording one file at a time
    $scope.handle_radio_change = function(file_in){
      if($scope.selectedFile == file_in){
        $scope.selectedFile.checked = false;
        $scope.selectedFile = null;
        $scope.isSelected = false;
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
      // Checks if user wishes to save JSON file to directory
      if($window.confirm("Do you wish to save this recording?")){
        $scope.saveJSON();
      }
      for (file in $scope.FileListData)
        $scope.FileListData[file].disabled = false;
      // Call pause function on livewriting for selectedFile -- NEED TO ADD WHEN I LEARN HOW TO
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
      dir_path = file_path.substring(0,file_path.length - $scope.selectedFile.name.length);
      directory_to_create = new Directory(dir_path + "/.lw-recordings");
      if(directory_to_create.exists() == false)
        directory_to_create.create();
      File = require('atom').File;
      file_to_create = new File(directory_to_create.getPath() + "/lw-" +
        $scope.selectedFile.name + "-" + (new Date()).getTime() + ".txt");
      file_to_create.create();
    }

    // Dropdown button that opens a list of files that are open in the editor
    $scope.dropdown = function(){
      $scope.isExpanded = !$scope.isExpanded;
    }

    // Recording function for when one file is being recorded and radio button is being used
    // Contained withing the dropdown menu of files
    $scope.record_radio = function(){
      $scope.isRecording = !$scope.isRecording;
      if($scope.isRecording == false){
        $scope.stopRecording();
      } else {
        $scope.startRecording();
      }
    }

    // Recording function for when multiple files are being recorded and checkbox is being used
    $scope.record_checkbox = function(){
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
            if($scope.FileListData[file].editor.livewriting == null){
              $scope.FileListData[file].editor.livewriting = livewriting;
            }
          } else {
            if($scope.FileListData[file].editor.livewriting != null){
            }
          }
        }
      }
    }
  }]);
};
console.log("active_files_controller.js");
