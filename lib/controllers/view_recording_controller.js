module.exports = function(app){
  app.controller("ViewRecordingController", ['$scope','$window', function ($scope, $window) {
    const livewriting = require('livewriting');
    const Directory = require('atom').Directory;
    const File = require('atom').File;
    $scope.fileData = new Map();
    if(atom.workspace.getActiveTextEditor() &&
       atom.workspace.getActiveTextEditor().getPath() != undefined){
      var file_path = atom.workspace.getActiveTextEditor().getPath();
      var file_name = atom.workspace.getActiveTextEditor().getTitle();
      $scope.currentDirectoryPath = file_path.substring(0,file_path.length - file_name.length);
    } else {
      $scope.currentDirectoryPath = undefined;
    }
    $scope.selectedFile = undefined;
    $scope.selectedRecording = undefined;
    $scope.openFileListMessage = "Play";
    $scope.isExpanded = false;
    $scope.isSelected = false;
    $scope.recordingButtonMessage = undefined;

    atom.workspace.getActivePane().onDidChangeActiveItem(function(object){
      if(atom.workspace.isTextEditor(object) &&
         object.getPath() != undefined){
        if(object.getPath().substring(0,object.getPath().lastIndexOf("/")) != $scope.currentDirectoryPath){
          $scope.fileData.clear();
          $scope.currentDirectoryPath = object.getPath().substring(0,object.getPath().lastIndexOf("/"));
          $scope.openFileListMessage = "Play";
          $scope.isExpanded = false;
          $scope.isSelected = false;
          $scope.selectedFile = undefined;
          $scope.selectedRecording = undefined;
          $scope.$apply();
        }
      }
    });

    $scope.addNewRecording = function(file_in_name,file_in_time){
      if($scope.fileData.has(file_in_name))
        $scope.fileData.get(file_in_name).push(file_in_time);
      else
        $scope.fileData.set(file_in_name,[file_in_time]);
    }

    $scope.readInFiles = function(){
      var lw_directory, files_in_directory;
      lw_directory = new Directory($scope.currentDirectoryPath + "/.lw-recordings");
      if(lw_directory.exists()){
        files_in_directory = lw_directory.getEntriesSync();
        for(recordingFile of files_in_directory){
          if(recordingFile.isFile() != true){
            $window.alert("You have a directory inside your recording folder, " +
                          "please refrain from creating anything within this folder");
          } else {
            var full = recordingFile.getBaseName();
            var index1 = full.indexOf("~");
            var index2 = full.lastIndexOf("~");
            var recordingFile_name = full.substring(index1+1,index2);
            var recordingFile_time = full.substring(index2+1,full.lastIndexOf("."));
            $scope.addNewRecording(recordingFile_name,recordingFile_time);
          }
        }
      }
    }

    $scope.returnKeys = function(){
      return Array.from($scope.fileData.keys());;
    }

    $scope.convertDate = function(timestamp){
      var d = (new Date(parseInt(timestamp,10)));
      return d.toDateString() + " " + d.toTimeString().substring(0,8);
    }

    $scope.dropdown = function(){
      $scope.isExpanded = !$scope.isExpanded;
      $scope.isSelected = false;
      $scope.selectedFile = undefined;
      $scope.selectedRecording = undefined;
      if($scope.isExpanded)
        $scope.openFileListMessage = "Select a file";
      else
        $scope.openFileListMessage = "Play";
      if($scope.fileData.size == 0)
        $scope.readInFiles();
    }

    $scope.handle_radio_file_change = function(fileName_in){
      if($scope.selectedFile == fileName_in){
        $scope.selectedFile = undefined;
        $scope.isSelected = false;
        $scope.selectedRecording = undefined;
        $scope.openFileListMessage = "Select a file";
      } else {
        $scope.selectedFile = fileName_in;
        $scope.selectedRecording = undefined;
        $scope.openFileListMessage = "Select a recording";
      }
    }

    $scope.handle_radio_recording_change = function(recordingName_in){
      if($scope.selectedRecording == recordingName_in){
        $scope.selectedRecording = undefined;
        $scope.isSelected = false;
        $scope.recordingButtonMessage = "";
      } else {
        $scope.selectedRecording = recordingName_in;
        $scope.isSelected = true;
        $scope.recordingButtonMessage = "Play " + $scope.selectedFile;
      }
    }

    $scope.play = function(){
      var fileToPlay = new File($scope.currentDirectoryPath + "/" + $scope.selectedFile);
      fileToPlay.editor = atom.workspace.open(fileToPlay.getPath());
      fileToPlay.editor.livewriting = livewriting;
      fileToPlay.editor.livewriting("create", "atom",{}, "");
      fileToPlay.editor.livewriting("playJson", recordingFile.read());
    }
  }]);
};
console.log("view_recording_controller.js");
