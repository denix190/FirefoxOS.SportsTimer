'use strict';

var db;

init();

// Initialize
function init() {
    try {
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
        // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
        // Let us open our database
        var DBOpenRequest = window.indexedDB.open(dbName, dbVersion);

        // these two event handlers act on the database being opened successfully, or not
        DBOpenRequest.onerror = function(event) {
            console.log(event);
        };

        DBOpenRequest.onsuccess = function(event) {
            console.log ("Database initialised.");
            db = DBOpenRequest.result;
            listSessions();
        };

        DBOpenRequest.onupgradeneeded = function(event) {
            var thisDB = event.target.result;

            thisDB.onerror = function(event) {
                console.log("Error loading database" + event);
            };

            if (thisDB.objectStoreNames.contains("exercice")) {
                 thisDB.deleteObjectStore("exercice");
            }
            
            var objectStore = thisDB.createObjectStore("exercice", { keyPath : "id", autoIncrement: true });
            var nameIndex = objectStore.createIndex("by_name", "name", {unique: false});
            var sessionIndex = objectStore.createIndex("BySession", "idSession" , {unique: false});
            

            if (!thisDB.objectStoreNames.contains("sessions")) {
                var objectStore = thisDB.createObjectStore("sessions", { keyPath : "idSession" , autoIncrement: true });
            }
 
            if (!thisDB.objectStoreNames.contains("parameters")) {
                var objectStore = thisDB.createObjectStore("parameters", { keyPath : "id"}  );    
                saveParameters( thisDB, 1, true);
            }
        };
    } catch(e) {
       console.log(e);
    }
}

function dbDeleteSession(listSessions) {
    // Delete exercices for the session.
        for (var i = 0; i  < listSessions.length;i++) {
            if (chk[i].checked == true) {
                deleteExercisesBySession(listSessions[i]);
            }
        }
        
        var transaction = db.transaction(["sessions"],"readwrite");
        var store = transaction.objectStore("sessions");
        try {
            for (var i = 0; i  < listSessions.length;i++) {
                if (chk[i].checked == true) {
                    var request = store.delete(listSessions[i]); 
                }
            }
        } catch(e) {
            console.log("Delete Error" + e); 
        }
}

function deleteExercisesBySession(idSession) {
    var objectStore = db.transaction("exercice","readwrite").objectStore("exercice");
    var index = objectStore.index("BySession");
    var pItem = index.openCursor(IDBKeyRange.only(idSession)); 
    
    pItem.onsuccess = function() {
        try {
            var cursor = pItem.result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            } else {
               // 
            }
        }  catch (e) {
            console.log(e);
        }
    }

    pItem.onerror = function() {
        console.lg("Deletion Exercice");
    }
}

/**
 * Export all the sessions.
*/ 
function dbExportSessions(bSession, bData) {
    var objectStore = db.transaction("sessions").objectStore("sessions");
    var sessions = new Array();
    
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
                exportExercises(sessions);
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
function exportExercises(sessions) {
    console.log("exportExercises" );
    var objectStore = db.transaction("exercice").objectStore("exercice");

    objectStore.openCursor().onsuccess = function(event) {
        try {
            var cursor = event.target.result;
            if (cursor) {
                console.log("cursor push idSession " + cursor.value.idSession);
                var i = 0;
                for ( i = 0; i < sessions.length;i++) {
                    var session = sessions[i];
                    if (session.idSession == cursor.value.idSession) {
                        session.exercises.push(cursor.value);
                        break;
                    }
                } 
 
                // exercices.push(cursor.value.idSession);
                cursor.continue();
            }
            else {
                var sessionJson = JSON.stringify(sessions);
                writeSessions(sessionJson);

                
                console.log("noCursor");
               
                // sessions["exercices"] = exercices;
                console.log(sessions);
            }
        } catch (e) {
            console.log(e);
        }
    };
}

/**
 * Write all the sessions on the sdcard.
*/
function writeSessions(sessions) {
    var date = new Date(Date.now());

    var sdcard = navigator.getDeviceStorage("sdcard");
    var file   = new Blob([sessions], {type: "text/plain"});
    
    var request = sdcard.addNamed(file, "st-" + date.toShortString() + ".txt");

    request.onsuccess = function () {
        var name = this.result;
        window.alert('File "' + name + '" successfully wrote on the sdcard storage area');
    }
    
    // An error typically occur if a file with the same name already exist
    request.onerror = function () {
        window.alert('Unable to write the file: ' + this.error);
    }
    

}

if ( !Date.prototype.toShortString ) {
  ( function() {
    
    function pad(number) {
      if ( number < 10 ) {
        return '0' + number;
      }
      return number;
    }
 
    Date.prototype.toShortString = function() {
      return this.getUTCFullYear() +
        '-' + pad( this.getUTCMonth() + 1 ) +
        '-' + pad( this.getUTCDate() ) +
        'T' + pad( this.getUTCHours() ) +
        ':' + pad( this.getUTCMinutes() ) +
        ':' + pad( this.getUTCSeconds() );
    };
  
  }() );
}

