/**
 * Class Export
 */
function Export(fileName) {
  this.fileName = fileName.trim();
  this.isPresent = false;
}

Export.prototype.build = function () {
  var sdcard = navigator.getDeviceStorage("sdcard");
  var self = this;
  
  var request = sdcard.get(this.getFullName());
  try {
    request.onsuccess = function () {
      window.alert(navigator.mozL10n.get("idAlertFileExist"));
    };
    
    request.onerror = function () {
      self.generate();
    };
  } catch(e) {
    console.log(e);
  }
};

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
  };
};

/**
 * Add all the exercises on the sessions.
 */ 
Export.prototype.exportExercises = function(sessions) {

  var objectStore = db.transaction("exercice").objectStore("exercice");
  var self = this;
  objectStore.openCursor().onsuccess = function(event) {
    try {
      var cursor = event.target.result;
      if (cursor) {
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
};

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
  };
  
  // An error typically occur if a file with the same name already exist
  request.onerror = function () {
    window.alert('Unable to write the file: ' + this.error);
  };
  
};

Export.prototype.getFullName = function() {
  return "st-" + this.fileName + ".json";
};

/**
 * Generate the backup file.
 */
function exportSessions() {
    
  var chkSessionExport = document.getElementById('chk-sessionExport');
  
  var fileName = document.getElementById('fileName');
  
  if (fileName.value.length === 0) {
    window.alert(navigator.mozL10n.get("idAlertNoFileName"));
    return;
  }
  
  if (chkSessionExport.checked ) {
    var backup = new Export(fileName.value);
    
    backup.build();

  }
}

// History

function ExportHistory(fileName) {
  this.fileName = fileName.trim();
  this.isPresent = false;
}

ExportHistory.prototype.build = function () {

  var sdcard = navigator.getDeviceStorage("sdcard");
  var self = this;
  
  var request = sdcard.get(this.getFullName());
  try {
    request.onsuccess = function () {
      window.alert(navigator.mozL10n.get("idAlertFileExist"));
    };
    
    request.onerror = function () {
      self.generate();
    };
  } catch(e) {
    console.log(e);
  }
};

ExportHistory.prototype.generate = function () {

  var objectStore = db.transaction("history").objectStore("history");
  var sessions = new Array();
  var self = this;
  objectStore.openCursor().onsuccess = function(event) {
    try {
      var cursor = event.target.result;
      if (cursor) {
        sessions.push(cursor.value);
        cursor.continue();
      }
      else {
        // End of session, adding exercise.
        self.write(sessions);
      }
    } catch (e) {
      console.log(e);
    }
  };
  
  objectStore.openCursor().onerror = function() {
    console.lg("exportSessions Error");
  };
};


/**
 * Write all the sessions on the sdcard.
*/
ExportHistory.prototype.write = function(sessions) {
  var date = new Date(Date.now());

  var json = JSON.stringify(sessions);

  var sdcard = navigator.getDeviceStorage("sdcard");
  var file   = new Blob([json], {type: "text/plain"});
  
  var request = sdcard.addNamed(file, this.getFullName());
  
  request.onsuccess = function () {
    var name = this.result;
    window.alert('File "' + name + '" successfully wrote on the sdcard storage area');
  };
  
  // An error typically occur if a file with the same name already exist
  request.onerror = function () {
    window.alert('Unable to write the file: ' + this.error);
  };
  
};

ExportHistory.prototype.getFullName = function() {
  return "st-histo" + this.fileName + ".json";
};

/**
 * Generate the history of the sessions.
 */
function exportHistory() {
 
  var fileName = document.getElementById('fileNameHistory');
  
  if (fileName.value.length === 0) {
    window.alert(navigator.mozL10n.get("idAlertNoFileName"));
    return;
  }
   
  var backup = new ExportHistory(fileName.value);
    
  backup.build();
}