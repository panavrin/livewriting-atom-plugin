module.exports = function(app){
  app.controller("ViewRecordingController", ['$scope','$window', function ($scope, $window) {
    const livewriting = require('livewriting');
    $scope.fileData = {};
    $scope.currentDirectoryPath = "";
    $scope.selectedRecording = "";
    $scope.openFileListMessage = "Play";

    atom.workspace.onDidChangeActivePane(function(object){
      if(object.getPath().substring(0,object.getPath().lastIndexOf("/")) != $scope.currentDirectoryPath){
        fileData = {};
        $scope.currentDirectoryPath = object.getPath().substring(0,object.getPath().lastIndexOf("/"));
        $scope.readInFiles();
      }
    });

    $scope.addNewRecording = function(file_in_name,file_in_time){
      console.log("reached addNewRecording");
      if(file_in_name in fileData){
        $scope.fileData[file_in_name].push(file_in_time);
      } else {
        $scope.fileData[file_in_name] = [file_in_time];
      }
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
      lw_directory = new Directory($scope.currentDirectoryPath + "/.lw-recordings");
      if(lw_directory.exists()){
        files_in_directory = lw_directory.getEntriesSync();
        for(recordingFile in files_in_directory){
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
  }]);
};
console.log("view_recording_controller.js");
