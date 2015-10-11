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
}

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
	    if (file != null ) {

          var fileName = file.name;
          fileName = "sdcard/" + fileName;
          
          // if (fileName.startsWith("st") && fileName.endsWith(".json")) {
          var posSlash = fileName.lastIndexOf('/');

          if (posSlash != -1 && fileName.substring(posSlash + 1).startsWith("st") && fileName.endsWith(".json")) {
          //if (file.type == "application/json") {
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
        window.alert(e);
      }
	}
    
    cursor.onerror = function() {
      console.warn( this.error);
    }    
  }
}

   
    
