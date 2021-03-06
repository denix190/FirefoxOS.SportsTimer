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
      db = DBOpenRequest.result;
      displayListSessions();

      // Load parameters.
      
      loadParameters();
    };

    DBOpenRequest.onupgradeneeded = function(event) {
      console.log("onupgradeneeded");
      var thisDB = event.target.result;

      thisDB.onerror = function(event) {
        console.log("Error loading database" + event);
      };

      if (thisDB.objectStoreNames.contains("exercice")) {
        thisDB.deleteObjectStore("exercice");
        var objectStore = thisDB.createObjectStore("exercice", { keyPath : "id", autoIncrement: true });
        var nameIndex = objectStore.createIndex("by_name", "name", {unique: false});
        var sessionIndex = objectStore.createIndex("BySession", "idSession" , {unique: false});
      } else {
        var objectStore = thisDB.createObjectStore("exercice", { keyPath : "id", autoIncrement: true });
        var nameIndex = objectStore.createIndex("by_name", "name", {unique: false});
        var sessionIndex = objectStore.createIndex("BySession", "idSession" , {unique: false});                
      }
      console.log("onupgradeneeded 1");
      if (thisDB.objectStoreNames.contains("sessions")) {
        thisDB.deleteObjectStore("sessions");
        var objectStore = thisDB.createObjectStore("sessions", { keyPath : "idSession" , autoIncrement: true });
        var nameIndex = objectStore.createIndex("by_name", "name", {unique: false});
      } else {
        var objectStore = thisDB.createObjectStore("sessions", { keyPath : "idSession" , autoIncrement: true });
        var nameIndex = objectStore.createIndex("by_name", "name", {unique: false});                
      }

      
      // Programs.
      if (thisDB.objectStoreNames.contains("programs")) {
        thisDB.deleteObjectStore("programs");
      }

       console.log("onupgradeneeded 2");
      // Calendar.
      if (thisDB.objectStoreNames.contains("calendar")) {
        console.log("onupgradeneeded 21");
        thisDB.deleteObjectStore("calendar");
        var objectStore = thisDB.createObjectStore("calendar", { keyPath : "idCalendar" , autoIncrement: true });
        objectStore.createIndex("dateSession", "dSession", {unique:false});
         console.log("onupgradeneeded 211");
      } else {
         console.log("onupgradeneeded 22");
        var objectStore = thisDB.createObjectStore("calendar", { keyPath : "idCalendar" , autoIncrement: true });
        objectStore.createIndex("dateSession", "dSession", {unique:false});
      }

       console.log("onupgradeneeded 3");
      // History of the sessions
      if (!thisDB.objectStoreNames.contains("history")) {
        var objectStore = thisDB.createObjectStore("history", { keyPath : "idHistory" , autoIncrement: true });
        objectStore.createIndex("dateHistory", "beginSession", {unique:false});
      } else {
         var objectStore = thisDB.createObjectStore("history", { keyPath : "idHistory" , autoIncrement: true });
        objectStore.createIndex("dateHistory", "beginSession", {unique:false});
      }

       console.log("onupgradeneeded 4");
      // Parameters.
      if (thisDB.objectStoreNames.contains("parameters")) {
        thisDB.deleteObjectStore("parameters");
      }
      var objectStore = thisDB.createObjectStore("parameters", { keyPath : "id",  autoIncrement: true}  ); 

    };
  } catch(e) {
    console.log(e);
  }
}

/**
 * Delete one session.
 */
function dbDeleteSession(idSession) {
  // Delete exercices for the session.

  deleteExercisesBySession(idSession);
  
  var transaction = db.transaction(["sessions"],"readwrite");
  var store = transaction.objectStore("sessions");
  try {
    var request = store.delete(idSession); 
  } catch(e) {
    console.log("Delete Error" + e); 
  }
}

/**
 * Delete list of sessions.
 */
function dbDeleteSessions(listSessions) {
  // Delete exercices for the session.
  for (var i = 0; i  < listSessions.length;i++) {
    deleteExercisesBySession(listSessions[i]);
  }
  
  var transaction = db.transaction(["sessions"],"readwrite");
  var store = transaction.objectStore("sessions");
  try {
    for (var i = 0; i  < listSessions.length;i++) {
      var request = store.delete(listSessions[i]); 
    }
  } catch(e) {
    console.log("Delete Error" + e); 
  }
}

/**
 * Delete exercices for one session.
 */ 
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
  };

  pItem.onerror = function() {
    console.lg("Deletion Exercice");
  };
}

/**
 * Add a new session.
 */
function dbAddSession(sessionData) {
  try {

    var transaction = db.transaction(["sessions"],"readwrite");
    var store = transaction.objectStore("sessions");

    //Define a new sessionRecord
    var sessionRecord = {
      name: sessionData.name,
      desc: sessionData.desc,
      chainExercises : sessionData.chainExercises,
      delayBetweenExercises: sessionData.delayBetweenExercises,
      created:new Date()
    };
    
    var request = store.add(sessionRecord);
    
    request.onerror = function(e) {
      console.log("Error SportsTimer", e.target.error.name);
    };
    
    request.onsuccess = function(event) {
      // id of the sessions.
      var idSession = event.target.result;
      var j = 0;
      var exercises = sessionData.exercises;
      for(j = 0; j < exercises.length;j++) {
        // Add exercices for the sessions.
        dbAddExercise(exercises[j], idSession);
      }
    };
  } catch(e) {
    console.log(e);
  }
} 

/**
 * Update session.
 */
function dbUpdateSession(sessionData) {
  try {

    var transaction = db.transaction(["sessions"],"readwrite");
    var store = transaction.objectStore("sessions");

    var sessionRecord = {
      name: sessionData.name,
      desc: sessionData.desc,
      created:new Date(),
      delayBetweenExercises: sessionData.delayBetweenExercises,
      idSession : sessionData.id
    };
    
    var request = store.put(sessionRecord);
    
    request.onerror = function(e) {
      console.log("Error SportsTimer", e.target.error.name);
    };
    
    request.onsuccess = function(event) {
      
      dataChange(id);
    };

  } catch(e) {
    console.log(e);
  }
}

/**
 * Add a new Exercise.
 */
function dbAddExercise(exercice, idSession) {
  try {
    
    var transaction = db.transaction(["exercice"],"readwrite");
    var store = transaction.objectStore("exercice");
    
    //Define a new exerciceRecord
    var exerciceRecord = {
      name: exercice.name,
      duration: exercice.duration,
      breakTime: exercice.breakTime,
      nbRetry: exercice.nbRetry,
      desc: exercice.descEx,
      imagePath: exercice.imagePath,
      idSession : idSession,
      created:new Date()
    };

    /* */
    var request = store.add(exerciceRecord);
    
    request.onerror = function(e) {
      console.log("Error Adding exercice", e.target.error.name);
    };
    
    request.onsuccess = function(event) {
      
    };
    
  } catch(e) {
    console.log(e);
  }
}

/**
 * Delete all sessions.
 */

function dbDeleteAllSessions() {

  var objectStore = db.transaction(["sessions"],"readwrite").objectStore("sessions");
  
  try {
    objectStore.openCursor().onsuccess =  function(event) {
      try {
        var cursor = event.target.result;
        
        if (cursor) {
          deleteExercisesBySession(cursor.value.idSession);
          cursor.delete();
          cursor.continue();
        }
      } catch(e) {
        console.log(e);
      }
    };
  } catch(e) {
    console.log("Delete Error" + e); 
  }
}

function dbDeleteSessions(listSessions) {

  var i = 0;
  for (i = 0; i < listSessions.length;i++) {
    dbDeleteSessionByName(listSessions[i]);
  }
}

function dbDeleteSessionByName(sessionName) {

  var objectStore = db.transaction(["sessions"],"readwrite").objectStore("sessions");
  var index = objectStore.index("by_name");
  var pItem = index.openCursor(IDBKeyRange.only(sessionName)); 
  
  pItem.onsuccess = function() {
    try {
      var cursor = pItem.result;
      if (cursor) {
        deleteExercisesBySession(cursor.value.idSession);
        cursor.delete();
        cursor.continue();
      } else {
        // 
      }
    }  catch (e) {
      console.log(e);
    }
  };

  pItem.onerror = function() {
    console.lg("Deletion Exercice");
  };

}

function dbDeleteCalendar(id) {
  try {
    var transaction = db.transaction(["calendar"],"readwrite");
    var store = transaction.objectStore("calendar");
    console.log(id);
    var request = store.delete(id);
  } catch(e) {
    console.log(e);
  }

}

/**
 * Update/Add a day in the calendar.
 */
function dbStoreCalendar(doe, callbackRet) {
  try {
    console.log("dbStoreCalendar" + doe.idCalendar);
    
    var transaction = db.transaction(["calendar"],"readwrite");
    var store = transaction.objectStore("calendar");

    if (doe.idCalendar == -1) {
      //Define a new Calendar.
      var doeRecord = {
        dSession: doe.day,
        idSession: doe.idSession,
        executed: doe.executed,
        created:new Date()
      };

      /* */
      var request = store.add(doeRecord);
      request.onerror = function(e) {
        console.log("Error program" + e.target.error.name);
      };
      
      request.onsuccess = function(event) {
        try {
          var idCalendar = event.target.result;
          doe.idCalendar = idCalendar;
          callbackRet();
        } catch(e) {
          console.log(e);
        }
      };
    } else {
    
      var doeRecord = {
        dSession: doe.day,
        idSession: doe.idSession,
        executed: doe.executed,
        created:new Date(),
        idCalendar: doe.idCalendar  
      };
      var request = store.put(doeRecord);
      request.onerror = function(e) {
        console.log("Error SportsTimer", e.target.error.name);
      };
      
      request.onsuccess = function(event) {
        callbackRet();
      };
    }
  } catch(e) {
    console.log(e);
  }
}

/**
 * Load the data the session in the panel.
 */
function dbLoadCalendar( idCalendar, callback )  {
  var transaction = db.transaction(["calendar"]);
  var objectStore = transaction.objectStore("calendar", 'readonly');
  
  var request = objectStore.get(parseInt(idCalendar));
  
  request.onerror = function(event) {
    console.log("Not found for Id: " + id);
  };
  
  request.onsuccess = function(evt) {
    var doe = new DayOfExercice();

    doe.idSession = request.result.idSession;
    doe.executed = request.result.executed;
    doe.day = request.result.dSession;
    doe.idCalendar = request.result.idCalendar;
    console.log(doe);
    callback( doe);
    
   // idSession.value = id;
  };
}


/**
 * Make a DayOfExercice to executed for the idCalendar.
 * @param idCalendar.
 */
function dbExecuteCalendar( idCalendar)  {
  try {
    var transaction = db.transaction(["calendar"], 'readwrite');
    var objectStore = transaction.objectStore("calendar");

    var request = objectStore.get(parseInt(idCalendar));
  
    request.onerror = function(event) {
      console.log("Not found for Id: " + id);
    };
    
    request.onsuccess = function(evt) {
      try {
        var doe = request.result;
        doe.executed = true;
        
        var requestUpdate = objectStore.put(doe);
        
        requestUpdate.onerror = function(event) {
          console.log("Update error for idCalendar:" + idCalendar);
        };
        requestUpdate.onsuccess = function(event) {
          console.log("Update success for idCalendar:" + idCalendar);
        };
      } catch(e) {
        console.log(e);
      }
    };
  } catch(e) {
    console.log(e);
  }
}



/**
 * Delete a day of history.
 */
function dbDeleteHistory(idHistory) {

  var transaction = db.transaction(["history"],"readwrite");
  var store = transaction.objectStore("history");
  try {
    var request = store.delete(idHistory);; 
  } catch(e) {
    console.log("Delete Error" + e); 
  }
}

/**
 * Delete all History Session.
 */

function dbDeleteAllHistory() {

  var objectStore = db.transaction(["history"],"readwrite").objectStore("history");
  
  try {
    objectStore.openCursor().onsuccess =  function(event) {
      try {
        var cursor = event.target.result;

        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      } catch(e) {
        console.log(e);
      }
    };
  } catch(e) {
    console.log("Delete Error" + e); 
  }
}
