'use strict';

/**
 * Class ImportSession
 * @param sessions sessions to load.
 * @param deleteAll Remove all the sessions, before import else replace.
 */
function ImportSession(sessions, deleteAll) {
    this.sessions = sessions;
    this.deleteAll = deleteAll;
}

/**
 * load the session.
*/ 
ImportSession.prototype.load = function() {
  var i = 0;
  try {
    if (this.deleteAll) {
      // Remove all session and exercises.
      dbDeleteAllSessions();
    } else {
      // Remove all session already present;
      var listSessions = new Array();
      for(i = 0; i < this.sessions.length;i++) {
        listSessions.push(this.sessions[i].name);
      }
      dbDeleteSessions(listSessions);
    }
   
    for(i = 0; i < this.sessions.length;i++) {
      // Delete all sessions.
      dbAddSession(this.sessions[i]);
    }
  } catch(e) {
    console.log(e);
  }
};

/**
 * storagename
 * listFiles element to load.
 */

ImportSession.prototype.loadListFiles = function(storagename, listFiles) {

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

          if (posSlash != -1 && fileName.substring(posSlash + 1).startsWith("st") && fileName.endsWith(".json")) {
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

//////////////////////////////////////////////////////////

/**
 * Class ImportImage
 */
function ImportImage() {

}

/**
 * load the Image.
*/ 
/*ImportSession.prototype.load = function() {
  var i = 0;
  try {
    if (this.deleteAll) {
      // Remove all session and exercises.
      dbDeleteAllSessions();
    } else {
      // Remove all session already present;
      var listSessions = new Array();
      for(i = 0; i < this.sessions.length;i++) {
        listSessions.push(this.sessions[i].name);
      }
      dbDeleteSessions(listSessions);
    }
   
    for(i = 0; i < this.sessions.length;i++) {
      // Delete all sessions.
      dbAddSession(this.sessions[i]);
    }
  } catch(e) {
    console.log(e);
  }
}; */

/**
 * storagename
 * listFiles element to load.
 */

ImportImage.prototype.loadListFiles = function(storagename, listFiles) {

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

          if (posSlash != -1 && fileName.endsWith(".png")) {
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
var listFiles = document.getElementById('list-files');

var listFilesImage = document.getElementById('list-filesImage');

/*
 * Import sessions from file.
 */
listFiles.onclick = function(e) {

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
        if (window.confirm(navigator.mozL10n.get("confirmImportSession"))) {
          var chkReplaceAll = document.getElementById('chk-replaceAll');
          var importSession = new ImportSession(sessions, chkReplaceAll.checked);
          importSession.load();
          window.alert(navigator.mozL10n.get("ImportSessionFinish"));
          dataChange(0);

          document.querySelector('#pnl_import').className = 'right';
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
function loadListFiles(storagename) {
  try {
    // Remove all elements.
    removeAllItems(document.getElementById("list-files"));
    
    if (typeof navigator.getDeviceStorage === "function") {        
      var importSession = new ImportSession();
      importSession.loadListFiles('sdcard', listFiles);
    } else {
      window.alert("getDeviceStorage not a function");
    }
  } catch (e) {
    window.alert(e);
  }
}


/**
 * Load the import Images.
 */
function loadListImages(storagename) {
  try {
    // Remove all elements.
    removeAllItems(document.getElementById("list-filesImage"));
    
    if (typeof navigator.getDeviceStorage === "function") {        
      var importImage = new ImportImage();
      importImage.loadListFiles('sdcard', listFilesImage);
    } else {
      window.alert("getDeviceStorage not a function");
    }
  } catch (e) {
    window.alert(e);
  }
}