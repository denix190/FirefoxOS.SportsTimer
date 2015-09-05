'use strict';

var note = null;
var lock = null;

var durationCounter;
var breakTimeCounter;
var nbRetryCounter;
              
var durationEx;
var breakTimeEx;
var nbRetryEx;

var typeCounter;
var typeCounterPause;
var flagSound = true;
var flagStart = false;

var chronoDisplay = document.getElementById('chronoDisplay');
var breakTimeDisplay = document.getElementById('breakTimeDisplay');
var nbRetryDisplay = document.getElementById('nbRetryDisplay');

var session = new Session();
var chronos = new Chronos();

// Display the panel adding a Exercise.
document.querySelector('#btn-go-add-ex').addEventListener('click', function () {

    document.getElementById('nameEx').value = "";
    document.getElementById('nbRetry').value = "1";
    document.getElementById('descEx').value = "";
    document.getElementById('duration').value = "60";
    document.getElementById('breakTime').value = "60";
    
    document.querySelector('#addExercise').className = 'current';
    document.querySelector('#listExercise').className = 'right';
});

document.querySelector('#btn-go-add-ex-back').addEventListener('click', function () {
    document.querySelector('#addExercise').className = 'right';
    document.querySelector('#listExercise').className = 'current';
});

document.querySelector('#btn-go-list-ex-back').addEventListener('click', function () {
    document.querySelector('#listExercise').className = 'right';
    document.querySelector('#updSession').className = 'current';
});


document.querySelector('#btn-go-upd-ex-back').addEventListener('click', function () {
    document.querySelector('#updExercise').className = 'right';
    document.querySelector('#listExercise').className = 'current';
});



// Display the panel updating a Session.
document.querySelector('#btn-go-add-session').addEventListener('click', function () {
  try {
    var idSession = document.getElementById('idSession');
    idSession.value = "-1";

    // Desactivate the button "AddExercises"
    document.getElementById('btn-add-sesEx').disabled = true;
    document.getElementById('btn-del-ses').disabled = true;

    document.getElementById('nameSession').value = "";
    document.getElementById('descSession').value = "";
    
    document.querySelector('#updSession').className = 'current';
    // document.querySelector('#listSessions').className = 'right';
    document.querySelector('[data-position="current"]').className = 'left';
  } catch(e) {
    console.log(e);
  }
});

document.querySelector('#btn-go-upd-session-back').addEventListener('click', function () {
  var idSession = document.getElementById('idSession');

  var id = parseInt(idSession.value);
  if (id == -1) {
    document.querySelector('#updSession').className = 'right';
    //document.querySelector('#listSessions').className = 'current';
    document.querySelector('[data-position="current"]').className = 'current';
  } else {
    document.querySelector('#updSession').className = 'right';
    document.querySelector('#currentSession').className = 'current';
  }

});

// Display the panel Parameters.
document.querySelector('#btn-go-param-ex').addEventListener('click', function () {
    document.querySelector('#pnl_parameters').className = 'current';
    document.querySelector('[data-position="current"]').className = 'left';
});

document.querySelector('#btn-go-params-ex-back').addEventListener('click', function () {
   document.querySelector('#pnl_parameters').className = 'right';
   document.querySelector('[data-position="current"]').className = 'current';
});

// Export
document.querySelector('#btn-go-export').addEventListener('click', function () {
    document.querySelector('#pnl_export').className = 'current';
    document.querySelector('[data-position="current"]').className = 'left';
});

document.querySelector('#btn-go-export-back').addEventListener('click', function () {
   document.querySelector('#pnl_export').className = 'right';
   document.querySelector('[data-position="current"]').className = 'current';
});

// Import
document.querySelector('#btn-go-import').addEventListener('click', function () {
    loadListFiles('sdcard'); 
    document.querySelector('#pnl_import').className = 'current';
    document.querySelector('[data-position="current"]').className = 'left';
});

document.querySelector('#btn-go-import-back').addEventListener('click', function () {
   document.querySelector('#pnl_import').className = 'right';
   document.querySelector('[data-position="current"]').className = 'current';
});

// Display the panel About.
document.querySelector('#btn-go-about-ex').addEventListener('click', function () {
    document.querySelector('#pnl_about').className = 'current';
    document.querySelector('[data-position="current"]').className = 'left';
});

// Hide panel About
document.querySelector('#btn-go-about-ex-back').addEventListener('click', function () {
   document.querySelector('#pnl_about').className = 'right';
   document.querySelector('[data-position="current"]').className = 'current';
});


// Display the panel List session.
document.querySelector('#btn-go-sessions').addEventListener('click', function () {
    document.querySelector('#listSessions').className = 'current';
    document.querySelector('[data-position="current"]').className = 'left';
    displayListSessions();
});

// Hide panel List sessions.
document.querySelector('#btn-go-current-session-back').addEventListener('click', function () {
   document.querySelector('#currentSession').className = 'right';
   document.querySelector('[data-position="current"]').className = 'current';
});


// Button Event.

// Exercise
document.querySelector('#btn-previous-ex').addEventListener('click', previousEx);
document.querySelector('#btn-next-ex').addEventListener('click', nextEx);
document.querySelector('#btn-start-ex').addEventListener('click', startEx);
document.querySelector('#btn-pause-ex').addEventListener('click', pauseEx);
document.querySelector('#btn-cancel-ex').addEventListener('click', cancelEx);

// Session
document.querySelector('#btn-start-ses').addEventListener('click', startSes);
document.querySelector('#btn-pause-ses').addEventListener('click', pauseSes);
document.querySelector('#btn-cancel-ses').addEventListener('click', cancelSes);

// Store new exercise.
document.querySelector('#btn-add-ex').addEventListener('click', storeEx);

// Update an exercise.
document.querySelector('#btn-upd-ex').addEventListener('click', updateEx);

document.querySelector('#btn-del-ex').addEventListener('click', deleteExercises);

document.querySelector('#chk-sound').addEventListener('change', checkSoundHandler);

// Update an Session.
document.querySelector('#btn-upd-session').addEventListener('click', updateSession);

// Display an Session.
document.querySelector('#btn-go-upd-session').addEventListener('click', displaySession);

// Configuration Exercises to Session
document.querySelector('#btn-add-sesEx').addEventListener('click', addExercisesToSession);

document.querySelector('#btn-del-ses').addEventListener('click', deleteSession);

document.querySelector('#btn-export').addEventListener('click', exportSessions);

// document.querySelector('#btn-import').addEventListener('click', importSessions);

// List Exercises.
var listItemEx = document.getElementById('list-items-ex');

// List Session.
var listItemSes = document.getElementById('list-items-ses');

// List Files.
var listFiles = document.getElementById('list-files');

/**
 * Activate the sound.
 */
function checkSoundHandler(event) {
    flagSound = event.originalTarget.checked;
    saveParameters(db, 1, flagSound);
}

/*
 * Import sessions from file.
*/
listFiles.onclick = function(e) {

    var parent = e.target.innerHTML;
    console.log(parent);

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
                }
            }
            
            reader.readAsText(file, 'utf-8');
        }  catch (e){
            console.log(e);
        }
    }

    request.onerror = function () {
        console.warn( this.error);
    }

}


listItemEx.onclick = function(e) {
    var collEnfants = e.target.parentNode.childNodes;
    var i = 0;
    for (i = 0; i < collEnfants.length; i++)  {

       if (collEnfants[i].tagName === 'A'){

            try {
                document.querySelector('#updExercise').className = 'current';
                document.querySelector('[data-position="current"]').className = 'left';
        
                document.querySelector('#listExercise').className = 'left';

                var transaction = db.transaction(["exercice"]);
                var objectStore = transaction.objectStore("exercice", 'readonly');
                
                var id = parseInt(collEnfants[i].id);
                var request = objectStore.get(id);

                request.onerror = function(event) {
                    console.log("Not found for Id: " + id);
                };

                request.onsuccess = function(evt) {
                    
                    var value = evt.target.result;
                    var name = document.getElementById('nameExUpd');
                    var desc = document.getElementById('descExUpd');
                    var nbRetry = document.getElementById('nbRetryUpd');
                    var breakTime = document.getElementById('breakTimeUpd');
                    var duration = document.getElementById('durationUpd');
                    var idUpd = document.getElementById('idUpd');
                    
                    name.value = request.result.name;
                    nbRetry.value = request.result.nbRetry;
                    breakTime.value = request.result.breakTime;
                    duration.value = request.result.duration;
                    desc.value = request.result.desc;
                    
                    idUpd.value = id;
                };
            } catch (ex) {
                console.log(ex);
            }
        }
    }
}

/**
 * Select a session and display.
 */
listItemSes.onclick = function(e) {

  document.getElementById('btn-add-sesEx').disabled = false;
  console.log(e.target.parentNode);

    var collEnfants = e.target.parentNode.childNodes;
    var i = 0;
    for (i = 0; i < collEnfants.length; i++)  {

       if (collEnfants[i].tagName === 'P') {
            try {
                document.querySelector('#currentSession').className = 'current';
                document.querySelector('[data-position="current"]').className = 'left';
        
                // document.querySelector('#listSessions').className = 'left';

                // var transaction = db.transaction(["sessions"]);
                // var objectStore = transaction.objectStore("sessions", 'readonly');
                
                var id = parseInt(e.target.parentNode.id);

              var idSession = document.getElementById('idSession');
              idSession.value = id;
                var title = document.getElementById('idTitleSession');
                title.innerHTML = collEnfants[i].innerHTML;
                listSessionEx(id);
                // var request = objectStore.get(id);

                // request.onerror = function(event) {
                //     console.log("Not found for Id: " + id);
                // };

                // request.onsuccess = function(evt) {
                    
                //     // var value = evt.target.result;
                //     // var name = document.getElementById('nameSession');
                //     // var desc = document.getElementById('descSession');
                //     // var nbRetry = document.getElementById('nbRetryUpd');
                //     // var breakTime = document.getElementById('breakTimeUpd');
                //     // var duration = document.getElementById('durationUpd');
                //     try {
                //         var idSession = request.result.idSession;
                //         console.log(idSession);
          
                //     } catch (e) {
                //         console.log(e);
                //     }
                //     // name.value = request.result.name;
                //     // desc.value = request.result.desc;                    
                //     // idSession.value = id;
                // };
              break;
            } catch (ex) {
                console.log(ex);
            }
        }
    }
}

function startSes() {
    session.startSes();
}

function pauseSes() {
    session.pauseSes();
}

function cancelSes() {
    session.cancelSes();
}

/**
 * Display 
 */
function displaySession() {
  try {
    document.querySelector('#currentSession').className = 'left';
    document.querySelector('#updSession').className = 'current'; 
 
    var transaction = db.transaction(["sessions"]);
    var objectStore = transaction.objectStore("sessions", 'readonly');
    
    var idSession = document.getElementById('idSession');
    var id = idSession.value;
    var request = objectStore.get(parseInt(id));

    request.onerror = function(event) {
      console.log("Not found for Id: " + id);
    };

    request.onsuccess = function(evt) {
                          
      var value = evt.target.result;
      var name = document.getElementById('nameSession');
      var desc = document.getElementById('descSession');
      var nbRetry = document.getElementById('nbRetryUpd');
      var breakTime = document.getElementById('breakTimeUpd');
      var duration = document.getElementById('durationUpd');
      try {
        var idSession = request.result.idSession;
      } catch (e) {
        console.log(e);
      }
      name.value = request.result.name;
      desc.value = request.result.desc;                    
      idSession.value = id;
    };
  } catch (ex) {
    console.log(ex);
  }


}

/**
 * Add a new Exercise.
 */
function storeEx() {
    try {
        var durationId = document.getElementById("duration");
        var breakTimeId = document.getElementById("breakTime");         
        var nbRetryId = document.getElementById("nbRetry");
        var nameId = document.getElementById("nameEx");
        var descId = document.getElementById("descEx");
        var idSession = document.getElementById('idSession');
        
        var duration = durationId.value;
        var breakTime = breakTimeId.value;
        var nbRetry = nbRetryId.value;
        var nameEx = nameId.value;
        var descEx = descId.value;

        if (nameEx.length == 0) {
            window.alert(navigator.mozL10n.get("idAlertNoName"));
            return;
        }

        var transaction = db.transaction(["exercice"],"readwrite");
        var store = transaction.objectStore("exercice");
        
        //Define a new exerciceRecord
        var exerciceRecord = {
            name: nameEx,
            duration: duration,
            breakTime: breakTime,
            nbRetry: nbRetry,
            desc: descEx,
            idSession : parseInt(idSession.value),
            created:new Date()
        }

        /* */
        var request = store.add(exerciceRecord);
 
        request.onerror = function(e) {
            console.log("Error exercice", e.target.error.name);
        }
        
        request.onsuccess = function(event) {
            dataChange(parseInt(idSession.value));
        }
  
        document.querySelector('#addExercise').className = 'right';
        document.querySelector('#listExercise').className = 'current';
    } catch(e) {
        console.log(e);
    }
}    

/**
 * Update Exercise.
 */
function updateEx() {
    try {
        var nameId = document.getElementById('nameExUpd');
        var nbRetryId = document.getElementById('nbRetryUpd');
        var breakTimeId = document.getElementById('breakTimeUpd');
        var durationId = document.getElementById('durationUpd');
        var idUpd = document.getElementById('idUpd');
        var descIdUpd = document.getElementById("descExUpd");
        var idSession = document.getElementById('idSession');
        
        var duration = durationId.value;
        var breakTime = breakTimeId.value;
        var nbRetry = nbRetryId.value;
        var nameEx = nameId.value;
        var descEx = descIdUpd.value;
        var id = parseInt(idUpd.value);

        var transaction = db.transaction(["exercice"],"readwrite");
        var store = transaction.objectStore("exercice");
        
        // Define a the sequence.
        var exerciceRecord = {
            id: id,
            name: nameEx,
            duration: duration,
            breakTime: breakTime,
            nbRetry: nbRetry,
            desc: descEx,
            idSession :parseInt(idSession.value),
            created:new Date()
        }
        
        var request = store.put(exerciceRecord);
 
        request.onerror = function(e) {
            console.log("Error exercice", e.target.error.name);
        }
        
        request.onsuccess = function(event) {
            displayListUpdateExercise(parseInt(idSession.value));
        }
  
        document.querySelector('#updExercise').className = 'right';
        document.querySelector('#listExercise').className = 'current';

    } catch(e) {
        console.log(e);
    }
}    

/**
* Initialize the list of Exercises.
*/
function displayListExercise() {
    loadParameters(1);
 
    try {
        var objectStore = db.transaction("exercice").objectStore("exercice");
        var index = objectStore.index("by_name");
        var listEx = document.getElementById("list-ex");

        removeAllItems(listEx);

        var request = index.openCursor(null, 'next');

        request.onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                var li = document.createElement("li");
                var a = document.createElement("a");
                var opt = document.createElement('option');
                
                opt.appendChild(
                    document.createTextNode(cursor.value.name
                                            + " (" + cursor.value.duration
                                            + " -  " + cursor.value.breakTime + ")"
                                            + "*" + cursor.value.nbRetry) );
                
                opt.value = cursor.value.duration
                    + "," + cursor.value.breakTime
                    + "," + cursor.value.nbRetry;
                listEx.appendChild(opt);
                cursor.continue();
            }
            else {
                // alert();ert("No more entries!");
            }
        };
    } catch (e) {
        console.log(e);
    }
}

/**
 * Display the list of exercises for update.
*/
function displayListUpdateExercise(idSession) {
    var objectStore = db.transaction("exercice").objectStore("exercice");
    var listEx = document.getElementById("list-items-ex");

    removeAllItems(listEx);

    var index = objectStore.index("BySession");
    var id = parseInt(idSession);
    var request = index.openCursor(IDBKeyRange.only(id));
    
    request.onsuccess = function(event) {
        try {
            var cursor = event.target.result;
            if (cursor) {
                addExercise(listEx, cursor);
                cursor.continue();
            }
            else {
                // alert("No more entries!");
            }
        } catch (e) {
            console.log(e);
        }
    };

    request.onerror = function(e) {
        console.log("listExercise ", e);
    }
}

/**
 * Add an exercise to the list.
*/ 
function addExercise(list, cursor) {
    var li = document.createElement("li");
    
    var a = document.createElement("a");
    a.setAttribute("id", cursor.value.id);
    a.text = cursor.value.name
        + " (" + cursor.value.duration
        + " -  " + cursor.value.breakTime + ")"
        + "x" + cursor.value.nbRetry;
    a.href = "#";
    
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "checkBoxEx";
    checkbox.value = cursor.value.id;
    checkbox.id = "checkBoxEx";
    
    var spanl = document.createElement("span");
    var spanr = document.createElement("span");
    
    var label = document.createElement("label");
    label.className = "pack-checkbox";
    label.appendChild(checkbox);
    var spanlbl = document.createElement("span");
    label.appendChild(spanlbl);
    
    spanr.className = "rightCheckbox";
    spanl.className = "left";
    
    spanl.appendChild(label);
    spanr.appendChild(a);
    
    li.appendChild(spanl);
    li.appendChild(spanr);
    
    list.appendChild(li);    
}




function pauseEx() {

    if (flagStart) {
        if ( typeCounter == STATE_EX_EFFORT || typeCounter == STATE_EX_RECOVERY) {
            typeCounterPause = typeCounter;
            typeCounter = STATE_EX_PAUSE;
            chronos.stop();
        } else  {
            chronos.start();
            typeCounter = typeCounterPause;
        }
    }
}

function previousEx() {
    var listEx = document.getElementById('list-session-ex');
    var x = listEx.selectedIndex;

    if (x > 0 ) {
        listEx.selectedIndex = x - 1;
    }
}

function nextEx() {
    var listEx = document.getElementById('list-session-ex');
    
    var x = listEx.selectedIndex;

    if ((x+1) < listEx.childElementCount ) {
        listEx.selectedIndex = x + 1;
    }

}

function startEx() {

    if (!flagStart) {
        durationCounter =  0;
        breakTimeCounter = 0;
        nbRetryCounter = 1;

        typeCounter = STATE_EX_EFFORT;
        
        var listEx = document.getElementById('list-session-ex');

        var x = listEx.selectedIndex;
        if (x != -1) {
            var sequence;
            sequence = listEx.options[x].value;
            var name = listEx.options[x].text;
            var res = sequence.split(",");
        
            durationEx = parseInt(res[0]) + 1;
            breakTimeEx = parseInt(res[1]);
            nbRetryEx = parseInt(res[2]);
            
            var effortDiv = document.getElementById('effortDiv');
            effortDiv.style.color = '#F97C17';

            chronos.start();
            flagStart = true;
            try {
                var exercise = new Exercise(name, durationEx, breakTimeEx, nbRetryEx);
                session.startExercise(exercise);
            } catch(e) {
                console.log(e);
            }
        }
    } else {
        if (typeCounter == STATE_EX_PAUSE) {
            chronos.start();
            typeCounter = typeCounterPause;
        }
    }
}


/**
 *
 * Play the sound if activate.
 */
function playSound(sound) {
    if (flagSound) {
        document.getElementById(sound).play();
    }
}

function display() {
  
    if (nbRetryCounter > nbRetryEx) {
        playSound('finalSound');
        session.stopExercise();
        endExercise();
        chronos.stop();

        try {   
            window.navigator.vibrate(1000);
        } catch(e) {
            window.alert(e);
        }
        return;
    }
    
    // Duration
    if (typeCounter == STATE_EX_EFFORT) {
        nbRetryDisplay.textContent = nbRetryCounter + "/" +nbRetryEx;
        durationCounter++;
        
        if (durationCounter == 1) {
            var effortDiv = document.getElementById('effortDiv');
            effortDiv.style.color = '#F97C17';
            playSound('beepBeginSound');
        }

        if ((durationEx - durationCounter) == 10) {
            var effortDiv = document.getElementById('effortDiv');
            effortDiv.style.color = 'red';
        }
        
        if (durationCounter >= durationEx) {
            playSound('beepEndSound');

            breakTimeCounter = 0;
            typeCounter = STATE_EX_RECOVERY;
        }
        var nbSec = durationEx - durationCounter;
        displaySecond(chronoDisplay, nbSec);
    }

    // Recovery
    if (typeCounter == STATE_EX_RECOVERY) {
        breakTimeCounter++;
        if (breakTimeCounter >= breakTimeEx) {       
            nbRetryCounter++;
            if (nbRetryCounter <= nbRetryEx) {
                nbRetryDisplay.textContent = nbRetryCounter + "/" + nbRetryEx;
            }
            typeCounter = STATE_EX_EFFORT;
            durationCounter = 0;
            displaySecond(breakTimeDisplay, 0);
        } else {
            var nbSec =  breakTimeEx - breakTimeCounter;
            displaySecond(breakTimeDisplay, nbSec);
        }
        
        if ((breakTimeEx - breakTimeCounter) == 5) {
            // 
            playSound('5SecSound');
        }
    }
}

function displaySecond(display, nbSec) {
    var seconds = new String(nbSec % 60);
    var minutes = new String(Math.floor(nbSec / 60));
    var hours = Math.floor(nbSec / 3600);
    
    if (seconds.length < 2) {
        seconds = '0' + seconds;
    }
    if (minutes.length < 2) {
        minutes = '0' + minutes;
    }

    if (hours == 0) {
        display.textContent = minutes + ":" + seconds;
    } else {
        display.textContent = new String(hours) + ":" + minutes + ":" + seconds;
    }
}

function endExercise() {
    flagStart = false;
}

function cancelEx() {
    chronos.stop();
    
    chronoDisplay.textContent = "00:00";
    breakTimeDisplay.textContent = "00:00";
    nbRetryDisplay.textContent = "0/0";
    endExercise();
}



/**
* Delete exercises.
*/
function deleteExercises() {
    if (window.confirm(navigator.mozL10n.get("confirmDeleteExercice"))) { 
        var list = document.getElementById('list-items-ex');
        var chk = list.getElementsByTagName('input');
        
        var transaction = db.transaction(["exercice"],"readwrite");
        var store = transaction.objectStore("exercice");
        
        for (var i = 0; i  < chk.length;i++) {
            if (chk[i].checked == true) {
                var request = store.delete(parseInt(chk[i].value)); 
            }
        }
        var idSession = document.getElementById('idSession');
        
        dataChange(parseInt(idSession.value));
    }
}

function saveParameters(dbObj, id, value) {
    try {
        var transaction = dbObj.transaction(["parameters"],"readwrite");
        var store = transaction.objectStore("parameters");
        
        //Define a new exerciceRecord
        var parametersRecord = {
            id: id, 
            value: value,
            created:new Date()
        }
        
        var request = store.put(parametersRecord);
        
        request.onerror = function(e) {
            console.log("Error parameterRecord", e.target.error.name);
        }
        
        request.onsuccess = function(event) {
            console.log("parameters add");
        }
    } catch(e) {
        console.log(e);
    }
}


function loadParameters(id) {
    try {
        var transaction = db.transaction(["parameters"],"readwrite");
        var store = transaction.objectStore("parameters");

        var request = store.get(id);
    
        request.onerror = function(e) {
            console.log("Error parameterRecord", e.target.error.name);
        }
        
        request.onsuccess = function(event) {
            try {
                console.log("parameters value: " + request.result.value);
                flagSound = request.result.value;
                var chk = document.getElementById("chk-sound");
                chk.checked = flagSound;
            } catch(e) {
                console.log(e);
            }
        }

    } catch(e) {
        console.log(e);
    }
}

/**
 * 
*/
function Chronos() {
    this.timer;
    this.lock;
    this.isLock;
}

Chronos.prototype.start = function() {
    this.timer = window.setInterval(display, 1000);
    this.lock = window.navigator.requestWakeLock("screen");
    this.isLock = true;
}

Chronos.prototype.stop = function() {
    this.timer = window.clearInterval(this.timer);
    try {
        if (this.lock !== null && this.lock !== undefined && this.isLock == true) {
            this.lock.unlock();
            this.isLock = false;
        }
    } catch (e) {
        if (e.result =! 2152923147) {
            alert(e);
            console.log(e);
        }
    }
}


function displaySessionSecond() {
    session.addSessionSec();
    displaySecond(document.getElementById('chronoSession'), session.getSessionSec());
}

/**
 * Update session.
 */
function updateSession() {
    try {

        var nameId = document.getElementById("nameSession");
        var descId = document.getElementById("descSession");
        var idSession = document.getElementById('idSession');
        
        var nameSes = nameId.value;
        var descSes = descId.value;
        var id = parseInt(idSession.value);

        if (nameSes.length == 0) {
            window.alert(navigator.mozL10n.get("idAlertNoName"));
            return;
        }

        var transaction = db.transaction(["sessions"],"readwrite");
        var store = transaction.objectStore("sessions");

        if (id == -1) {
            //Define a new sessionRecord
            var sessionRecord = {
                name: nameSes,
                desc: descSes,
                created:new Date()
            }
            
            var request = store.add(sessionRecord);
            
            request.onerror = function(e) {
                console.log("Error SportsTimer", e.target.error.name);
            }
            
            request.onsuccess = function(event) {
              document.getElementById('idSession').value = event.target.result;
              document.getElementById('btn-add-sesEx').disabled = false;

              displayListSessions();
              listSessions();
              document.querySelector('#updSession').className = 'right';
              document.querySelector('[data-position="current"]').className = 'current';
            }
        } else {
          // Update session
            var sessionRecord = {
                name: nameSes,
                desc: descSes,
                created:new Date(),
                idSession : id
            }
            
            var request = store.put(sessionRecord);
            
            request.onerror = function(e) {
                console.log("Error SportsTimer", e.target.error.name);
            }
            
            request.onsuccess = function(event) {
              dataChange(id);
              var title = document.getElementById('idTitleSession');
              title.innerHTML = nameSes;
              document.querySelector('#updSession').className = 'right';
              document.querySelector('#currentSession').className = 'current';
            }

        }
    
    } catch(e) {
        console.log(e);
    }
} 

/**
 * Load the list of sessions for the main page.
 */ 
function listSessions() {
    // var objectStore = db.transaction("sessions").objectStore("sessions");
    // var listSes = document.getElementById("list-session");
    
    // removeAllItems(listSes);

    // objectStore.openCursor().onsuccess = function(event) {
    //     var cursor = event.target.result;
    //     if (cursor) {
    //         var li = document.createElement("li");
    //         var a = document.createElement("a");
    //         var opt = document.createElement('option');
                
    //         opt.appendChild(
    //             document.createTextNode(cursor.value.name));
                
    //         opt.value = cursor.value.idSession;
            
    //         listSes.appendChild(opt);
    //         cursor.continue();
    //     }
    //     else {
    //         // Initialize the list of Exercises for the first Session.
    //         //changeSessionEx(null);
    //     }
    // };
}
/*
function changeSessionEx(event) {

    var listEx = document.getElementById('list-session');
    var x = listEx.selectedIndex;
    if (x != -1) {
        listSessionEx(listEx.options[x].value);
    }
}
*/

/** 
 * Load the list of exercise for a Session 
*/ 
function listSessionEx(idSession) {
    var objectStore = db.transaction("exercice").objectStore("exercice");
    var listEx = document.getElementById("list-session-ex");

    removeAllItems(listEx);
 
    var index = objectStore.index("BySession");
    var id = parseInt(idSession);
    var request = index.openCursor(IDBKeyRange.only(id));
    
    request.onsuccess = function(event) {
        try {
            var cursor = event.target.result;
            if (cursor) {
                var li = document.createElement("li");
                var a = document.createElement("a");
                var opt = document.createElement('option');
                
                opt.appendChild(
                    document.createTextNode(cursor.value.name
                                            + " (" + cursor.value.duration
                                            + " -  " + cursor.value.breakTime + ")"
                                            + "x" + cursor.value.nbRetry) );
                
                opt.value = cursor.value.duration
                    + "," + cursor.value.breakTime
                    + "," + cursor.value.nbRetry;
                listEx.appendChild(opt);
                cursor.continue();
            }
            else {
                // alert("No more entries!");
            }
        } catch (e) {
            console.log(e);
        }
    };

    request.onerror = function(e) {
        console.log("listExercise ", e);
    }
}

/**
 * Display the list of Sessions.
*/
function displayListSessions() {
    var objectStore = db.transaction("sessions").objectStore("sessions");
    var listSes = document.getElementById("list-items-ses");

    removeAllItems(listSes);

    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            addSession(listSes, cursor);
            cursor.continue();
        }
        else {
            // alert("No more entries!");
        }
    };
}

/**
 * Add an Session to the list.
*/ 
function addSession(list, cursor) {
  var li = document.createElement("li");
  
  var a = document.createElement("a");
  a.setAttribute("id", cursor.value.idSession);
  // a.text = cursor.value.name;
  a.href = "#";

  var p0 = document.createElement("p");
  p0.innerHTML = cursor.value.name;
  a.appendChild(p0);

  var p1 = document.createElement("p");
  p1.innerHTML = cursor.value.desc;
  a.appendChild(p1);
    
    // var checkbox = document.createElement('input');
    // checkbox.type = "checkbox";
    // checkbox.name = "checkBoxEx";
    // checkbox.value = cursor.value.idSession;
    // checkbox.id = "checkBoxEx";
    
    //var spanl = document.createElement("span");
    //var spanr = document.createElement("span");
    
    // var label = document.createElement("label");
    // label.className = "pack-checkbox";
    // label.appendChild(checkbox);
    // var spanlbl = document.createElement("span");
    // label.appendChild(spanlbl);
    
    //spanl.className = "rightCheckbox";
    //spanr.className = "left";
    
    //spanl.appendChild(a);
    //spanr.appendChild(label);
    
    li.appendChild(a);
  //li.appendChild(spanr);

    list.appendChild(li);    
}

// Add Exercises to Session.
function addExercisesToSession() {
    document.querySelector('#listExercise').className = 'current';
    document.querySelector('#updSession').className = 'right';

    var idSession = document.getElementById('idSession');
    displayListUpdateExercise(idSession.value);
}

function deleteSession() {
    if (window.confirm(navigator.mozL10n.get("confirmDeleteSession"))) {
      var idSession = document.getElementById('idSession');
      var id  = parseInt(idSession.value);

      // Delete session and exercises.
      dbDeleteSession(id);

      document.querySelector('#updSession').className = 'right';
      document.querySelector('[data-position="current"]').className = 'current';

      listSessions();
      displayListSessions();
    }
}

function deleteSessions() {
    if (window.confirm(navigator.mozL10n.get("confirmDeleteSession"))) { 
        var list = document.getElementById('list-items-ses');
        var chk = list.getElementsByTagName('input');

        // List of session to delete
        var listSession = new Array();

        for (var i = 0; i  < chk.length;i++) {
            if (chk[i].checked == true) {
                listSession.push(parseInt(chk[i].value));
            }
        }
        // Delete session and exercises.
        dbDeleteSessions(listSession);
        
        listSessions();
        displayListSessions();
    }
}



/**
 * Actualize the list, after modification of session/exercice.
*/
function dataChange(idSession) {
    listSessions();
    displayListUpdateExercise(idSession);
    displayListSessions();
    listSessionEx(idSession);

    /*var listEx = document.getElementById('list-session');
    var x = listEx.selectedIndex;
    if (x != -1) { 
        var sequence;
        sequence = listEx.options[x].value;
        
        if (idSession == sequence) {
            listSessionEx(sequence);
        }
    } */
}

function removeAllItems(list) {
    // remove all element in the list.
	while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

function loadListFiles(storagename) {

    // Remove all elements.
    removeAllItems(document.getElementById("list-files"));
    
    
	var files = navigator.getDeviceStorage(storagename);
	var cursor = files.enumerate();
    var listFiles = document.getElementById('list-files');

    var importSession = new ImportSession();
    importSession.loadListFiles('sdcard', listFiles);
}

function exportSessions() {
    
    var chkSessionExport = document.getElementById('chk-sessionExport');
    //  var chkDataExport = document.getElementById('chk-dataExport');

    var fileName = document.getElementById('fileName');

    if (fileName.value.length == 0) {
        window.alert(navigator.mozL10n.get("idAlertNoFileName"));
        return;
    }

    if (chkSessionExport.checked ) {
        var backup = new Export(fileName.value);

        backup.build();

        // dbExportSessions(fileName.value);
        // window.alert(navigator.mozL10n.get("alertExportNoCheck"));
        // return;
    }
}

function importSessions() {

 //   listContents('sdcard'); 
}


