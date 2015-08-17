'use strict';

// Constantes.
const STATE_EX_EFFORT = 1;
const STATE_EX_RECOVERY = 2;
const STATE_EX_PAUSE = 3;
const dbName = "exerciceData";
const dbVersion = 20;

var note = null;

var db;
var timer;

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

// Display the panel adding a Exercise.
document.querySelector('#btn-go-add-ex').addEventListener('click', function () {
    document.querySelector('#addExercise').className = 'current';
    document.querySelector('#listExercise').className = 'right';
});

document.querySelector('#btn-go-add-ex-back').addEventListener('click', function () {
    document.querySelector('#addExercise').className = 'right';
    document.querySelector('#listExercise').className = 'current';
});

// Display the panel updating Exercises.
document.querySelector('#btn-go-list-ex').addEventListener('click', function () {

    document.querySelector('#listExercise').className = 'current';
    document.querySelector('[data-position="current"]').className = 'left';
    displayListUpdateExercise(1);
});

document.querySelector('#btn-go-list-ex-back').addEventListener('click', function () {
  document.querySelector('#listExercise').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
});


document.querySelector('#btn-go-upd-ex-back').addEventListener('click', function () {
    document.querySelector('#updExercise').className = 'right';
    document.querySelector('#listExercise').className = 'current';
    // document.querySelector('[data-position="current"]').className = 'current';
});


document.querySelector('#btn-go-params-ex-back').addEventListener('click', function () {
   document.querySelector('#pnl_parameters').className = 'right';
   document.querySelector('[data-position="current"]').className = 'current';
});


// Display the panel updating a Session.
document.querySelector('#btn-go-add-session').addEventListener('click', function () {
    var idSession = document.getElementById('idSession');
    idSession.value = "-1";
    document.querySelector('#updSession').className = 'current';
    document.querySelector('#listSessions').className = 'right';
});

document.querySelector('#btn-go-upd-session-back').addEventListener('click', function () {
    document.querySelector('#updSession').className = 'right';
    document.querySelector('#listSessions').className = 'current';
});

// Display the panel Parameters.
document.querySelector('#btn-go-param-ex').addEventListener('click', function () {
    document.querySelector('#pnl_parameters').className = 'current';
    document.querySelector('[data-position="current"]').className = 'left';
    displayListUpdateExercise(1);
});

// Display the panel About.
document.querySelector('#btn-go-about-ex').addEventListener('click', function () {
    document.querySelector('#pnl_about').className = 'current';
    document.querySelector('[data-position="current"]').className = 'left';
    displayListUpdateExercise(1);
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
document.querySelector('#btn-go-sessions-back').addEventListener('click', function () {
   document.querySelector('#listSessions').className = 'right';
   document.querySelector('[data-position="current"]').className = 'current';
});


// Button Event.

// Exercise
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

// Configuration Exercises to Session
document.querySelector('#btn-add-sesEx').addEventListener('click', addExercisesToSession);

// List Exercises.
var listItemEx = document.getElementById('list-items-ex');

// List Session.
var listItemSes = document.getElementById('list-items-ses');

init();

/**
 * Activate the sound.
 */
function checkSoundHandler(event) {
    flagSound = event.originalTarget.checked;
    saveParameters(db, 1, flagSound);
    console.log("flagSound :" + flagSound);
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

listItemSes.onclick = function(e) {
    
    var collEnfants = e.target.parentNode.childNodes;
    var i = 0;
    for (i = 0; i < collEnfants.length; i++)  {

       if (collEnfants[i].tagName === 'A'){

            try {
                document.querySelector('#updSession').className = 'current';
                document.querySelector('[data-position="current"]').className = 'left';
        
                document.querySelector('#listSessions').className = 'left';

                var transaction = db.transaction(["sessions"]);
                var objectStore = transaction.objectStore("sessions", 'readonly');
                
                var id = parseInt(collEnfants[i].id);
                var request = objectStore.get(id);

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
                    var idSession = document.getElementById('idSession');
                    
                    name.value = request.result.name;
                    desc.value = request.result.desc;                    
                    idSession.value = id;
                };
            } catch (ex) {
                console.log(ex);
            }
        }
    }
}


// Initialize
function init() {
    try {
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
        // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
        console.log("DBOpenRequest");
        // Let us open our database
        var DBOpenRequest = window.indexedDB.open(dbName, dbVersion);

        // these two event handlers act on the database being opened successfully, or not
        DBOpenRequest.onerror = function(event) {
            console.log(event);
        };

        DBOpenRequest.onsuccess = function(event) {
            console.log ("Database initialised.");
            db = DBOpenRequest.result;
            // displayListExercise();
            listSessions();
        };

        DBOpenRequest.onupgradeneeded = function(event) {
            console.log("onupgradeneeded");
            var thisDB = event.target.result;

            thisDB.onerror = function(event) {
                console.log("Error loading database" + event);
            };

            console.log ("exercice");
            if (thisDB.objectStoreNames.contains("exercice")) {
                 thisDB.deleteObjectStore("exercice");
            }
            
            var objectStore = thisDB.createObjectStore("exercice", { keyPath : "id", autoIncrement: true });
            var nameIndex = objectStore.createIndex("by_name", "name", {unique: false});
            var sessionIndex = objectStore.createIndex("BySession", "idSession" , {unique: false});
            

            if (!thisDB.objectStoreNames.contains("sessions")) {
                var objectStore = thisDB.createObjectStore("sessions", { keyPath : "idSession" , autoIncrement: true });
            }
            
        console.log ("parameters");
            if (!thisDB.objectStoreNames.contains("parameters")) {
                var objectStore = thisDB.createObjectStore("parameters", { keyPath : "id"}  );    
                saveParameters( thisDB, 1, true);
            }
        };
    } catch(e) {
       console.log(e);
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
        console.log("nameEx:" + nameEx +  " idSession " + idSession.value)

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
            console.log("sequence add");
            displayListUpdateExercise(parseInt(idSession.value));
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
           console.log("updateEx ok id:" + id);
            // displayListExercise();
            displayListUpdateExercise(parseInt(idSession.value));
        }
  
        document.querySelector('#updExercise').className = 'right';
        document.querySelector('#listExercise').className = 'current';
        // document.querySelector('[data-position="current"]').className = 'current';

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
        
        // remove all element in the list.
	    while (listEx.firstChild) {
            listEx.removeChild(listEx.firstChild);
        }
        
        // var request = index.openCursor(IDBKeyRange.only(name));
        var request = index.openCursor(null, 'next');
        // objectStore.openCursor().onsuccess = function(event) {
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
                console.log("id " + cursor.value.id + " idSession " + cursor.value.idSession);
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
    console.log("displayListUpdateExercise idSession: " + idSession);
    var objectStore = db.transaction("exercice").objectStore("exercice");
    var listEx = document.getElementById("list-items-ex");
    
    // remove all element in the list.
	while (listEx.firstChild) {
        listEx.removeChild(listEx.firstChild);
    }

    var index = objectStore.index("BySession");
    var id = parseInt(idSession);
    var request = index.openCursor(IDBKeyRange.only(id));
    
    request.onsuccess = function(event) {
        try {
            var cursor = event.target.result;
            if (cursor) {
                console.log("=> addExercise");
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
    
    spanl.className = "leftCheckbox";
    spanr.className = "right";
    
    spanl.appendChild(a);
    spanr.appendChild(label);
    
    li.appendChild(spanl);
    li.appendChild(spanr);
    
    list.appendChild(li);    
}

function pauseEx() {

    if (flagStart) {
        if ( typeCounter == STATE_EX_EFFORT || typeCounter == STATE_EX_RECOVERY) {
            typeCounterPause = typeCounter;
            typeCounter = STATE_EX_PAUSE;
            timer = window.clearInterval(timer);
        } else  {
            timer = window.setInterval(display, 1000);
            typeCounter = typeCounterPause;
        }
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
        var y = listEx.options[0];
        var sequence;
        sequence = listEx.options[x].value;
        
        var res = sequence.split(",");
        
        durationEx = parseInt(res[0]) + 1;
        breakTimeEx = parseInt(res[1]);
        nbRetryEx = parseInt(res[2]);
        
        var effortDiv = document.getElementById('effortDiv');
        // effortDiv.style.backgroundColor = 'black';
        effortDiv.style.color = '#F97C17';
        
        timer = window.setInterval(display, 1000);
        flagStart = true;
    } else {
        if (typeCounter == STATE_EX_PAUSE) {
            timer = window.setInterval(display, 1000);
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

        endExercise();
        timer = window.clearInterval(timer);

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
    timer = window.clearInterval(timer);

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
        
        displayListUpdateExercise(1);
        displayListExercise();
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
                console.log("chk: " + chk.checked);
                
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
 * Class Session.
*/ 

function Session() {
    this.flagStartSes = false;
    this.timerSession;
    this.chronoSession = document.getElementById('chronoSession');
    this.sessionSec = 0;
}

/**
* Start a new Session.
* Change the text of the button
*/ 
Session.prototype.startSes = function() {

    if (this.flagStartSes == false) {
        this.timerSession = window.setInterval(displaySession, 1000);
        this.flagStartSes = true;
    }
}

/**
* Pause Session.
*/ 
Session.prototype.pauseSes = function() {

    if (this.flagStartSes) {
        this.timerSession = window.clearInterval(this.timerSession);
        this.flagStartSes = false;
    }
}

/**
 * Cancel the current Session.
*/
Session.prototype.cancelSes = function() {
    try {
        this.timerSession = window.clearInterval(this.timerSession);
        this.sessionSec = 0;
        this.flagStartSes = false;
        displaySecond(this.chronoSession, this.sessionSec);
    } catch(e) {
        console.log(e);
    }
}

Session.prototype.getSessionSec = function () {
    return this.sessionSec;
}

Session.prototype.addSessionSec = function () {
    this.sessionSec++;
}

function displaySession() {
    session.addSessionSec();
    displaySecond(document.getElementById('chronoSession'), session.getSessionSec());
}


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
                displayListSessions();
            }
        } else {
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
                displayListSessions();
            }
        }
        document.querySelector('#updSession').className = 'right';
        document.querySelector('#listSessions').className = 'current';
    } catch(e) {
        console.log(e);
    }
} 

function listSessions() {
    var objectStore = db.transaction("sessions").objectStore("sessions");
    var listSes = document.getElementById("list-session");
    
    // remove all element in the list.
	while (listSes.firstChild) {
        listSes.removeChild(listSes.firstChild);
    }

    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            var opt = document.createElement('option');
                
            opt.appendChild(
                document.createTextNode(cursor.value.name));
                
            opt.value = cursor.value.idSession;
            
            listSes.appendChild(opt);
            console.log("id " + cursor.value.id + " idSession " + cursor.value.idSession);
            cursor.continue();
        }
        else {
            // alert("No more entries!");
        }
    };
}

function changeSessionEx(event) {
    console.log(event);
    var listEx = document.getElementById('list-session');
    var x = listEx.selectedIndex;
    var y = listEx.options[0];
    var sequence;
    sequence = listEx.options[x].value;
    console.log("sequence" + sequence);
    listSessionEx(sequence);
}

function listSessionEx(idSession) {
    
    console.log("listSessionEx idSession: " + idSession);
    var objectStore = db.transaction("exercice").objectStore("exercice");
    var listEx = document.getElementById("list-session-ex");
    
    // remove all element in the list.
	while (listEx.firstChild) {
        listEx.removeChild(listEx.firstChild);
    }

    var index = objectStore.index("BySession");
    var id = parseInt(idSession);
    var request = index.openCursor(IDBKeyRange.only(id));
    
    request.onsuccess = function(event) {
        try {
            var cursor = event.target.result;
            if (cursor) {
                console.log("=> addExercise");
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
                console.log("id " + cursor.value.id + " idSession " + cursor.value.idSession);
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
    
    // remove all element in the list.
	while (listSes.firstChild) {
        listSes.removeChild(listSes.firstChild);
    }

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
    a.text = cursor.value.name;
    a.href = "#";
    
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "checkBoxEx";
    checkbox.value = cursor.value.idSession;
    checkbox.id = "checkBoxEx";
    
    var spanl = document.createElement("span");
    var spanr = document.createElement("span");
    
    var label = document.createElement("label");
    label.className = "pack-checkbox";
    label.appendChild(checkbox);
    var spanlbl = document.createElement("span");
    label.appendChild(spanlbl);
    
    spanl.className = "leftCheckbox";
    spanr.className = "right";
    
    spanl.appendChild(a);
    spanr.appendChild(label);
    
    li.appendChild(spanl);
    li.appendChild(spanr);
    
    list.appendChild(li);    
}

// Add Exercises to Session.
function addExercisesToSession() {
    document.querySelector('#listExercise').className = 'current';
    document.querySelector('#updSession').className = 'right';

    var idSession = document.getElementById('idSession');
    console.log("addExercisesToSession " + idSession.value);
    displayListUpdateExercise(idSession.value);
}
