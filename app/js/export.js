/**
 * Class Export
 */
function Export(fileName) {
    this.fileName = fileName;
    this.isPresent = false;
}

Export.prototype.build = function () {
    var sdcard = navigator.getDeviceStorage("sdcard");
    var self = this;

    var request = sdcard.get(this.getFullName());
    try {
        request.onsuccess = function () {
            window.alert(navigator.mozL10n.get("idAlertFileExist"));
        }
        
        request.onerror = function () {
            self.generate();
        }
    } catch(e) {
        console.log(e);
    }
}

Export.prototype.generate = function () {
    var objectStore = db.transaction("sessions").objectStore("sessions");
    var sessions = new Array();
    var self = this;
    objectStore.openCursor().onsuccess = function(event) {
        try {
            var cursor = event.target.result;
            if (cursor) {
                // Add properties exercises to the session.
                var session = cursor.value;
                session["exercises"] = new Array();

                sessions.push(cursor.value);
                cursor.continue();
            }
            else {
                // End of session, adding exercise.
                self.exportExercises(sessions);
            }
        } catch (e) {
            console.log(e);
        }
    };

    objectStore.openCursor().onerror = function() {
        console.lg("exportSessions Error");
    }
}

/**
 * Add all the exercises on the sessions.
 */ 
Export.prototype.exportExercises = function(sessions) {
    console.log("exportExercises" );
    var objectStore = db.transaction("exercice").objectStore("exercice");
    var self = this;
    objectStore.openCursor().onsuccess = function(event) {
        try {
            var cursor = event.target.result;
            if (cursor) {
                console.log("cursor idSession " + cursor.value.idSession);
                var i = 0;
                for ( i = 0; i < sessions.length;i++) {
                    var session = sessions[i];
                    if (session.idSession == cursor.value.idSession) {
                        session.exercises.push(cursor.value);
                        break;
                    }
                } 

                cursor.continue();
            }
            else {
                var sessionJson = JSON.stringify(sessions);
                self.writeSessions(sessionJson);
            }
        } catch (e) {
            console.log(e);
        }
    };
}

/**
 * Write all the sessions on the sdcard.
*/
Export.prototype.writeSessions = function(sessions) {
    var date = new Date(Date.now());

    var sdcard = navigator.getDeviceStorage("sdcard");
    var file   = new Blob([sessions], {type: "text/plain"});
    
    var request = sdcard.addNamed(file, this.getFullName());

    request.onsuccess = function () {
        var name = this.result;
        window.alert('File "' + name + '" successfully wrote on the sdcard storage area');
    }
    
    // An error typically occur if a file with the same name already exist
    request.onerror = function () {
        window.alert('Unable to write the file: ' + this.error);
    }

}

Export.prototype.getFullName = function() {
    return "st-" + this.fileName + ".json";
    
}
