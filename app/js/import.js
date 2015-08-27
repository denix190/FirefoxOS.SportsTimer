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

    if (this.deleteAll) {
        // Remove all session and exercises.
        dbDeleteAllSessions();
    } else {
        // Remove all session already present;
    }
    var listSession = new Array();

    for(i = 0; i < this.sessions.length;i++) {
        // Delete all sessions.
        dbAddSession(this.sessions[i]);
    }
}

/**
 * storagename
 * listFiles element to load.
 */

ImportSession.prototype.loadListFiles = function(storagename, listFiles) {
    var files = navigator.getDeviceStorage(storagename);
	var cursor = files.enumerate();
    var done = false;
	cursor.onsuccess = function () {
		var file = this.result;
		if (file != null ) {
            try {
                var fileName = file.name;

                if (fileName.startsWith("st") && fileName.endsWith(".json")) {
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
            } catch(e) {
                console.log(e);
            }
		}
		else {
			done = true;
		}
        
		if (!done) {
			cursor.continue();
		}
	}
}

   
    
