'use strict';

/**
 * Class ImportHistory
 * @param sessions sessions to load.
 * @param deleteAll Remove all the sessions, before import else replace.
 */
function ImportHistory(stories, deleteAll) {
    this.stories = stories;
    this.deleteAll = deleteAll;
}

/**
 * load the session.
*/ 
ImportHistory.prototype.load = function() {
  var i = 0;
  try {

    if (this.deleteAll) {
      // Remove all History
      dbDeleteAllHistory();
    }

    for(i = 0; i < this.stories.length;i++) {
      var session =  new Session();
      session.beginSession = new Date(this.stories[i].beginSession);
      session.endSession = new Date(this.stories[i].endSession);
      session.name = this.stories[i].nameSession;
      session.idSession = this.stories[i].idSession;
      session.exercises = this.stories[i].exercises;

      dbStoreHistory(session);
    }
  } catch(e) {
    console.log(e);
  }
};

/**
 * storagename
 * listFiles element to load.
 */

ImportHistory.prototype.loadListFiles = function(storagename, listFiles) {

  if (typeof navigator.getDeviceStorage === "function") {
    var files = navigator.getDeviceStorage(storagename);

	var cursor = files.enumerate();
    var done = false;
	cursor.onsuccess = function () {
      try {
	    var file = this.result;
	    if (file !== null &&  file !== undefined) {
          var fileName = file.name;
          fileName = "sdcard/" + fileName;

          var posSlash = fileName.lastIndexOf('/');
         
          if (posSlash != -1 && fileName.substring(posSlash + 1).startsWith("st-histo") && fileName.endsWith(".json")) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.setAttribute("id", file.name);
            a.href = "#";
            
            var p0 = document.createElement("p");
            p0.innerHTML = file.name;
            a.appendChild(p0);
            
            li.appendChild(a);
			listFiles.appendChild(li);
            
			done = false;
          }
	    }
	    else {
		  done = true;
	    }
        
	    if (!done) {
		  cursor.continue();
	    }
      } catch(e) {
        console.log(e);
      }
	};
    
    cursor.onerror = function() {
      console.warn( this.error);
    };   
  }
};

// List Files.
var listFilesHistory = document.getElementById('list-filesHistory');

/*
 * Import sessions from file.
 */
listFilesHistory.onclick = function(e) {

  var parent = e.target.innerHTML;
  var sdcard = navigator.getDeviceStorage('sdcard');
  var request = sdcard.get(parent);

  request.onsuccess = function () {
    var file = this.result;

    try {
      var reader = new FileReader();
      
      reader.onload = function(e) {
        var sessions = JSON.parse(reader.result);
        
        // Write sessions
        if (window.confirm(navigator.mozL10n.get("confirmImportHistory"))) {
          var chkReplaceAll = document.getElementById('chk-replaceAllHistory');
          var importHistory = new ImportHistory(sessions, chkReplaceAll.checked);
          importHistory.load();
          window.alert(navigator.mozL10n.get("ImportHistoryFinish"));

          document.querySelector('#pnl_import-history').className = 'right';
          document.querySelector('[data-position="current"]').className = 'current';
        }
      };
      reader.readAsText(file, 'utf-8');
    }  catch (e){
      console.log(e);
    }
  };

  request.onerror = function () {
    console.warn( this.error);
  };

};
    
/**
 * Load the import files.
 */
function loadListFilesHistory(storagename) {
  try {
    // Remove all elements.
    removeAllItems(listFilesHistory);
    
    if (typeof navigator.getDeviceStorage === "function") {        
      var importHistory = new ImportHistory();
      importHistory.loadListFiles('sdcard', listFilesHistory);
    } else {
      window.alert("getDeviceStorage not a function");
    }
  } catch (e) {
    window.alert(e);
  }
}
