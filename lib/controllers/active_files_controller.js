module.exports = function(app){
  app.controller("ActiveFilesController", ['$scope', function ($scope) {
    const livewriting = require('livewriting');
    $scope.FileListData = [];

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
        disabled : false,
        editor : object['item']
      });
      $scope.$apply();
    })

    // Updates list of active text editors if a file is closed
    atom.workspace.onDidDestroyPaneItem(function(object){
      var name_to_delete = object['item'].getTitle();
      var count = 0;
      for(file of $scope.FileListData) {
        if(file.name == name_to_delete){
          // FOLLOWING FIVE LINES ARE WRONG -- fix
          //if($scope.selectedFile){
            //if(file.name == $scope.selectedFile.name){ // Added if the window with the editor
              //$scope.record_radio(); // being recorded is closed
            //}
          //}
          $scope.FileListData.splice(count,1);
        }
        count++;
      }
      $scope.$apply();
    })

    // Creates variables for state of recording
    $scope.isRecording = false;
    $scope.recordingMessage = "Please select a file";
    $scope.recordingButtonMessage = "Record";
    // For use when only recording one file at a time
    $scope.selectedFile;
    $scope.isSelected = false;
    $scope.isExpanded = false;

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

    // Dropdown button that opens a list of files that are open in the editor
    $scope.dropdown = function(){
      $scope.isExpanded = !$scope.isExpanded;
    }

    // Recording function for when one file is being recorded and radio button is being used
    // Contained withing the dropdown menu of files
    $scope.record_radio = function(){
      $scope.isRecording = !$scope.isRecording;
      if($scope.isRecording == false){
        for (file in $scope.FileListData) {
          $scope.FileListData[file].disabled = false;
        }
        // Call pause function on livewriting for selectedFile -- NEED TO ADD WHEN I LEARN HOW TO
        $scope.isExpanded = true;
        $scope.recordingMessage = "Please select a file";
        $scope.recordingButtonMessage = "Record";
        $scope.selectedFile.checked = false;
        $scope.isSelected = false;
        $scope.selectedFile = null;
      } else {
        for (file in $scope.FileListData) {
          $scope.FileListData[file].disabled = true;
        }
        if($scope.selectedFile.editor.livewriting == null){
          $scope.selectedFile.editor.livewriting = livewriting;
          // MAKE LIVEWRITING MAIN FUNCTION COMMAND -- NEED TO ADD WHEN I LEARN HOW TO
        }
        $scope.isExpanded = false;
        $scope.recordingMessage = "Recording " + $scope.selectedFile.name;
        $scope.recordingButtonMessage = "Stop recording";
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
