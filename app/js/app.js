'use strict';

var dbName = "chronosData";
var dbVersion = 11;

var note = null;

var db;
var timer;

var durationCounter;
var breakTimeCounter;
var nbRetryCounter;
              
var durationSeq;
var breakTimeSeq;
var nbRetrySeq;

var typeCounter;
var typeCounterPause;
var flagSound = true;
var flagStart = false;

var chronoDisplay = document.getElementById('chronoDisplay');
var breakTimeDisplay = document.getElementById('breakTimeDisplay');
var nbRetryDisplay = document.getElementById('nbRetryDisplay');


// Display the panel adding a new Sequence.
document.querySelector('#btn-go-add-seq').addEventListener('click', function () {
    document.querySelector('#addSeq').className = 'current';
    document.querySelector('[data-position="current"]').className = 'left';
});


document.querySelector('#btn-go-add-seq-back').addEventListener('click', function () {
  document.querySelector('#addSeq').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
});

// Display the panel updating Sequences.
document.querySelector('#btn-go-list-seq').addEventListener('click', function () {
    document.querySelector('#listSeq').className = 'current';
    document.querySelector('[data-position="current"]').className = 'left';
    displayListUpdateSequence();
});

document.querySelector('#btn-go-list-seq-back').addEventListener('click', function () {
  document.querySelector('#listSeq').className = 'right';
   document.querySelector('[data-position="current"]').className = 'current';
});


document.querySelector('#btn-go-upd-seq-back').addEventListener('click', function () {
   document.querySelector('#updSeq').className = 'right';
   document.querySelector('[data-position="current"]').className = 'current';
});


document.querySelector('#btn-go-params-seq-back').addEventListener('click', function () {
   document.querySelector('#pnl_parameters').className = 'right';
   document.querySelector('[data-position="current"]').className = 'current';
});

// Display the panel Parameters.
document.querySelector('#btn-go-param-seq').addEventListener('click', function () {
    document.querySelector('#pnl_parameters').className = 'current';
    document.querySelector('[data-position="current"]').className = 'left';
    displayListUpdateSequence();
});


document.querySelector('#btn-start-seq').addEventListener('click', startSeq);
document.querySelector('#btn-cancel-seq').addEventListener('click', cancelSeq);

document.querySelector('#btn-add-seq').addEventListener('click', storeSeq);
document.querySelector('#btn-upd-seq').addEventListener('click', updateSeq);

document.querySelector('#btn-del-seq').addEventListener('click', deleteSequences);

document.querySelector('#chk-sound').addEventListener('change', checkSoundHandler);


var listItemSeq = document.getElementById('list-items-seq');

init();

/**
 * Activate the sound.
 */
function checkSoundHandler(event) {
    flagSound = event.originalTarget.checked;
    saveParameters(db, 1, flagSound);
    console.log("flagSound :" + flagSound);
}
    
listItemSeq.onclick = function(e) {
    
    var collEnfants = e.target.parentNode.childNodes;
    var i = 0;
    for (i = 0; i < collEnfants.length; i++)  {
       console.log(collEnfants[i]); 

       if (collEnfants[i].tagName === 'A'){
            console.log(collEnfants[i].id);  // Check if the element is a LI

            try {
                document.querySelector('#updSeq').className = 'current';
                document.querySelector('[data-position="current"]').className = 'left';
        
                document.querySelector('#listSeq').className = 'left';

                var transaction = db.transaction(["chronos"]);
                var objectStore = transaction.objectStore("chronos", 'readonly');
                
                var id = parseInt(collEnfants[i].id);
                var request = objectStore.get(id);

                request.onerror = function(event) {
                    console.log("Not found for Id: " + id);
                };

                request.onsuccess = function(evt) {
                    
                    var value = evt.target.result;
                    console.log(value);
                    
                    var name = document.getElementById('nameSeqUpd');
                    var nbRetry = document.getElementById('nbRetryUpd');
                    var breakTime = document.getElementById('breakTimeUpd');
                    var duration = document.getElementById('durationUpd');
                    var idUpd = document.getElementById('idUpd');
                    
                    name.value = request.result.name;
                    nbRetry.value = request.result.nbRetry;
                    breakTime.value = request.result.breakTime;
                    duration.value = request.result.duration;
                    idUpd.value = id;
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
            displayListSequence();
        };

        DBOpenRequest.onupgradeneeded = function(event) {
            console.log("onupgradeneeded");
            var thisDB = event.target.result;

            thisDB.onerror = function(event) {
                console.log("Error loading database" + event);
            };

            console.log ("chronos");
            if (thisDB.objectStoreNames.contains("chronos")) {
                thisDB.deleteObjectStore("chronos");
            }
            console.log ("parameters");
            if (thisDB.objectStoreNames.contains("parameters")) {
                thisDB.deleteObjectStore("parameters");
            } 

            var objectStore = thisDB.createObjectStore("chronos", { keyPath : "id",   autoIncrement: true });
            var nameIndex = objectStore.createIndex("by_name", "name", {unique: false});

            var objectStore = thisDB.createObjectStore("parameters", { keyPath : "id"}  );

            saveParameters( thisDB, 1, true);
        };
    } catch(e) {
       console.log(e);
    }
}


/**
 * Add a new Sequence.
 */
function storeSeq() {
    try {
        var durationId = document.getElementById("duration");
        var breakTimeId = document.getElementById("breakTime");         
        var nbRetryId = document.getElementById("nbRetry");
        var nameId = document.getElementById("nameSeq");

        var duration = durationId.value;
        var breakTime = breakTimeId.value;
        var nbRetry = nbRetryId.value;
        var nameSeq = nameId.value;

        if (nameSeq.length == 0) {
            window.alert(navigator.mozL10n.get("idAlertNoName"));
            return;
        }
        console.log("nameSeq:" + nameSeq)
        
        var opt = document.createElement('option'); // create new option element
        // create text node to add to option element (opt)
        opt.appendChild( document.createTextNode(nameSeq + " (" + duration + " -  " + breakTime + ")" + "*" + nbRetry) );

        opt.value = duration + "," + breakTime + "," + nbRetry; // set value property of opt
        var listSeq = document.getElementById('list-seq');

        listSeq.appendChild(opt);

        var transaction = db.transaction(["chronos"],"readwrite");
        var store = transaction.objectStore("chronos");
        
        //Define a new chronosRecord
        var chronosRecord = {
            name: nameSeq,
            duration: duration,
            breakTime: breakTime,
            nbRetry: nbRetry,
            created:new Date()
        }
        
        var request = store.add(chronosRecord);
 
        request.onerror = function(e) {
            console.log("Error chronos", e.target.error.name);
        }
        
        request.onsuccess = function(event) {
            console.log("sequence add");
        }
  
        document.querySelector('#addSeq').className = 'right';
        document.querySelector('[data-position="current"]').className = 'current';
    } catch(e) {
        console.log(e);
    }
}    

/**
 * Update Sequence.
 */
function updateSeq() {
    try {
        var nameId = document.getElementById('nameSeqUpd');
        var nbRetryId = document.getElementById('nbRetryUpd');
        var breakTimeId = document.getElementById('breakTimeUpd');
        var durationId = document.getElementById('durationUpd');
        var idUpd = document.getElementById('idUpd');

        var duration = durationId.value;
        var breakTime = breakTimeId.value;
        var nbRetry = nbRetryId.value;
        var nameSeq = nameId.value;
        var id = parseInt(idUpd.value);

        var transaction = db.transaction(["chronos"],"readwrite");
        var store = transaction.objectStore("chronos");
        
        // Define a the sequence.
        var chronosRecord = {
            id: id,
            name: nameSeq,
            duration: duration,
            breakTime: breakTime,
            nbRetry: nbRetry,
            created:new Date()
        }
        
        var request = store.put(chronosRecord);
 
        request.onerror = function(e) {
            console.log("Error chronos", e.target.error.name);
        }
        
        request.onsuccess = function(event) {
           console.log("updateSeq ok id:" + id);
           displayListSequence();
        }
  
        document.querySelector('#updSeq').className = 'right';
        document.querySelector('[data-position="current"]').className = 'current';
    } catch(e) {
        console.log(e);
    }
}    

/**
* Initialize the list of sequences.
*/
function displayListSequence() {
    loadParameters(1);
 
    try {
        var objectStore = db.transaction("chronos").objectStore("chronos");
        var index = objectStore.index("by_name");
        var listSeq = document.getElementById("list-seq");
        
        // remove all element in the list.
	    while (listSeq.firstChild) {
            listSeq.removeChild(listSeq.firstChild);
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
                listSeq.appendChild(opt);
                
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

function displayListUpdateSequence() {
    var objectStore = db.transaction("chronos").objectStore("chronos");
    var listSeq = document.getElementById("list-items-seq");
    
    // remove all element in the list.
	while (listSeq.firstChild) {
        listSeq.removeChild(listSeq.firstChild);
    }

    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            var li = document.createElement("li");

            var a = document.createElement("a");
            a.setAttribute("id", cursor.value.id);
            a.text = cursor.value.name
                + " (" + cursor.value.duration
                + " -  " + cursor.value.breakTime + ")"
                + "*" + cursor.value.nbRetry;
            a.href = "#";
            
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = "checkBoxSeq";
            checkbox.value = cursor.value.id;
            checkbox.id = "checkBoxSeq";

            var spanl = document.createElement("span");
            var spanr = document.createElement("span");
            
            var label = document.createElement("label");
            label.className = "pack-checkbox";
            label.appendChild(checkbox);
            var spanlbl = document.createElement("span");
            label.appendChild(spanlbl);
            
            spanl.className = "left";
            spanr.className = "right";
            
            spanl.appendChild(a);
            // a.appendChild(checkbox);
            spanr.appendChild(label);
            
            li.appendChild(spanl);
            li.appendChild(spanr);
            
       		listSeq.appendChild(li);

            cursor.continue();
        }
        else {
            // alert("No more entries!");
        }
    };
}

function startSeq() {
    var btnStart = document.getElementById('btn-start-seq');
    
    if (flagStart) {
        
        btnStart.textContent = navigator.mozL10n.get("idStart");
        if ( typeCounter == 1 || typeCounter == 2) {
            //var btn = document.getElementById('btn-pause-seq');
            // btn.textContent ="Retry";
            
            typeCounterPause = typeCounter;
            typeCounter = 3;
            timer = window.clearInterval(timer);
        } else  {
            //var btn = document.getElementById('btn-pause-seq')
            // btn.textContent ="Pause";
            timer = window.setInterval(display, 1000);
            typeCounter = typeCounterPause;
        }
    } else {
        btnStart.textContent = navigator.mozL10n.get("idPause");
        durationCounter =  0;
        breakTimeCounter = 0;
        nbRetryCounter = 1;
        typeCounter = 1;
        
        var listSeq = document.getElementById('list-seq');
        listSeq.selectedIndex;
        
        var x = listSeq.selectedIndex;
        var y = listSeq.options[0];
        var sequence;
        sequence = listSeq.options[x].value;
        
        var res = sequence.split(",");
        
        durationSeq = parseInt(res[0]) + 1;
        breakTimeSeq = parseInt(res[1]);
        nbRetrySeq = parseInt(res[2]);
        
        var effortDiv = document.getElementById('effortDiv');
        effortDiv.style.backgroundColor = 'black';
        
        timer = window.setInterval(display, 1000);
        flagStart = true;
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
  
    if (nbRetryCounter > nbRetrySeq) {
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
    if (typeCounter == 1) {
        nbRetryDisplay.textContent = nbRetryCounter + "/" +nbRetrySeq;
        durationCounter++;
        
        if (durationCounter == 1) {
            var effortDiv = document.getElementById('effortDiv');
            effortDiv.style.backgroundColor = 'black';
            playSound('beepBeginSound');
        }

        if ((durationSeq - durationCounter) == 10) {
            var effortDiv = document.getElementById('effortDiv');
            effortDiv.style.backgroundColor = 'red';
        }
        
        if (durationCounter >= durationSeq) {
            playSound('beepEndSound');

            breakTimeCounter = 0;
            typeCounter = 2;
        }
        var nbSec = durationSeq - durationCounter;
        displaySecond(chronoDisplay, nbSec);
    }

    // Recovery
    if (typeCounter == 2) {
        breakTimeCounter++;
        if (breakTimeCounter >= breakTimeSeq) {       
            nbRetryCounter++;
            if (nbRetryCounter <= nbRetrySeq) {
                nbRetryDisplay.textContent = nbRetryCounter + "/" + nbRetrySeq;
            }
            typeCounter = 1;
            durationCounter = 0;
            displaySecond(breakTimeDisplay, 0);
        } else {
            var nbSec =  breakTimeSeq - breakTimeCounter;
            displaySecond(breakTimeDisplay, nbSec);
        }
        
        if ((breakTimeSeq - breakTimeCounter) == 5) {
            playSound('5SecSound');
        }
    }
}

function displaySecond(display, nbSec) {
    var seconds = new String(nbSec % 60);
    var minutes = new String(Math.floor(nbSec / 60));
    
    if (seconds.length < 2) {
        seconds = '0' + seconds;
    }
    if (minutes.length < 2) {
        minutes = '0' + minutes;
    }
    display.textContent = minutes + ":" + seconds;
}

function endExercise() {
    flagStart = false;
    var btnStart = document.getElementById('btn-start-seq');
    btnStart.textContent = navigator.mozL10n.get("idStart");
}

function cancelSeq() {
    timer = window.clearInterval(timer);

    var btn = document.getElementById('btn-start-seq');
    btn.textContent ="Retry";
    
    chronoDisplay.textContent = "00:00";
    breakTimeDisplay.textContent = "00:00";
    nbRetryDisplay.textContent = "0/0";
    endExercise();
}



/**
* Delete sequences.
*/
function deleteSequences() {
    var list = document.getElementById('list-items-seq');
    var chk = list.getElementsByTagName('input');
    
    var transaction = db.transaction(["chronos"],"readwrite");
    var store = transaction.objectStore("chronos");
    
    for (var i = 0; i  < chk.length;i++) {
        if (chk[i].checked == true) {
            var request = store.delete(parseInt(chk[i].value)); 
        }
    }
  
    displayListUpdateSequence();
    displayListSequence();
}

function saveParameters(dbObj, id, value) {
    try {
        var transaction = dbObj.transaction(["parameters"],"readwrite");
        var store = transaction.objectStore("parameters");
        
        //Define a new chronosRecord
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
            console.log("parameters value: " + request.result.value);
            flagSound = request.result.value;
            var chk = document.getElementById("chk-sound");
            console.log("chk: " + chk.checked);

            chk.checked = flagSound;
        }

    } catch(e) {
        console.log(e);
    }
}
