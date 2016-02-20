'use strict';

// History

function dbStoreHistory(session) {
 try {
    var transaction = db.transaction(["history"],"readwrite");
    var store = transaction.objectStore("history");

   //Define a new History
   var historyRecord = {
     beginSession: session.beginSession,
     endSession: session.endSession,
     idSession: session.idSession,
     nameSession: session.name,
     exercises: session.exercises,
     created:new Date()
   };

   /* */
   var request = store.add(historyRecord);
   request.onerror = function(e) {
     console.log("Error program" + e.target.error.name);
   };
   
   request.onsuccess = function(event) {
     try {
       // callbackRet();
     } catch(e) {
       console.log(e);
     }
   };
  } catch(e) {
    console.log(e);
  }
  
}