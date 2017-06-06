module.exports = function(app){
  app.controller("ViewRecordingController", ['$scope','$window', function ($scope, $window) {
    const livewriting = require('livewriting');
    $scope.fileData = {};
    if(atom.workspace.getActiveTextEditor().getTitle() != "untitled"){
      var file_path = atom.workspace.getActiveTextEditor().getPath();
      var file_name = atom.workspace.getActiveTextEditor().getTitle();
      $scope.currentDirectoryPath = file_path.substring(0,file_path.length - file_name.length);
    } else {
      $scope.currentDirectoryPath = "";
    }
    $scope.selectedRecording = "";
    $scope.openFileListMessage = "Play";

    atom.workspace.getActivePane().onDidChangeActiveItem(function(object){
      console.log("reached");
      if(object.getPath().substring(0,object.getPath().lastIndexOf("/")) != $scope.currentDirectoryPath){
        $scope.fileData = {};
        $scope.currentDirectoryPath = object.getPath().substring(0,object.getPath().lastIndexOf("/"));
        $scope.readInFiles();
      }
    });

    $scope.addNewRecording = function(file_in_name,file_in_time){
      console.log("reached addNewRecording");
      if(file_in_name in $scope.fileData){
        $scope.fileData[file_in_name].push(file_in_time);
      } else {
        $scope.fileData[file_in_name] = [file_in_time];
      }
      console.log($scope.fileData);
    }

    $scope.expand = function(file_in){
      if($scope.selectedFile == file_in){
        $scope.selectedFile = null;
        $scope.openFileListMessage = "Select a file";
      } else {
        selectedFile = file_in;
        $scope.openFileListMessage = "Select a recording";
      }
    }

    $scope.readInFiles = function(){
      console.log("reached readInFiles");
      var Directory, File, lw_directory, files_in_directory;
      Directory = require('atom').Directory;
      File = require('atom').File;
      console.log($scope.currentDirectoryPath);
      lw_directory = new Directory($scope.currentDirectoryPath + "/.lw-recordings");
      console.log(lw_directory.getPath());
      if(lw_directory.exists()){
        files_in_directory = lw_directory.getEntriesSync();
        console.log(files_in_directory.length);
        console.log(files_in_directory);
        for(recordingFile of files_in_directory){
          console.log(recordingFile);
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
      return Object.keys($scope.fileData);
    }
  }]);
};
console.log("view_recording_controller.js");
