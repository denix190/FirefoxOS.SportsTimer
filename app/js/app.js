'use strict';

var durationCounter;
var breakTimeCounter;
var nbRetryCounter;
var durationBetweenExercise;

var curExercise;

var typeCounter;
var typeCounterPause;

var flagStart = false;

var chronoDisplay = document.getElementById('chronoDisplay');
var breakTimeDisplay = document.getElementById('breakTimeDisplay');
var nbRetryDisplay = document.getElementById('nbRetryDisplay');

var session = new Session();
var chronos = new Chronos();

// Parameters
var parameters = new Parameters();


// Display the panel adding a Exercise.
document.querySelector('#btn-go-add-ex').addEventListener('click', function () {

  document.getElementById('nameEx').value = "";
  document.getElementById('nbRetry').value = "1";
  document.getElementById('descEx').value = "";
  document.getElementById('duration').value = "60";
  document.getElementById('breakTime').value = "60";
  document.getElementById('imagePath').src = "";
  document.getElementById('idUpd').value = "-1";
  
  document.querySelector('#addExercise').className = 'current';
  document.querySelector('#listExercise').className = 'right';
  //document.getElementById('nameEx').scrollIntoView(true); 
});

document.querySelector('#btn-go-add-ex-back').addEventListener('click', function () {
//  document.getElementById('nameEx').scrollIntoView(true);
  document.querySelector('#addExercise').className = 'right';
  document.querySelector('#listExercise').className = 'current';
});

document.querySelector('#btn-go-list-ex-back').addEventListener('click', function () {
  document.getElementById('nameSession').scrollIntoView(true);
  document.querySelector('#listExercise').className = 'right';
  document.querySelector('#updSession').className = 'current';
});


document.querySelector('#btn-go-upd-ex-back').addEventListener('click', function () {
  document.getElementById('nameExUpd').scrollIntoView(true);
  document.querySelector('#updExercise').className = 'right';
  document.querySelector('#listExercise').className = 'current';
});


// Display the panel updating a Session.
document.querySelector('#btn-go-add-session').addEventListener('click', function () {
  try {
    var idSession = document.getElementById('idSession');
    idSession.value = "-1";

    // Desactivate the button "AddExercises"
    // document.getElementById('btn-add-sesEx').disabled = true;
    document.getElementById('btn-del-ses').disabled = true;

    document.getElementById('nameSession').value = "";
    document.getElementById('descSession').value = "";
    
    document.querySelector('#updSession').className = 'current';
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

document.querySelector('#chk-next-exercice').addEventListener('change', checkNextExercice);

// Update an Session.
document.querySelector('#btn-upd-session').addEventListener('click', updateSession);

// Display an Session.
document.querySelector('#btn-go-upd-session').addEventListener('click', displaySession);

// Configuration Exercises to Session
document.querySelector('#btn-add-sesEx').addEventListener('click', addExercisesToSession);

document.querySelector('#btn-del-ses').addEventListener('click', deleteSession);

document.querySelector('#btn-export').addEventListener('click', exportSessions);


// Display Image
document.querySelector('#btn-choose-img').addEventListener('click', function () {
  document.querySelector('#pnl-chooseImage').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';
});

// Display Image
document.querySelector('#btn-chooseUpd-img').addEventListener('click', function () {
  document.querySelector('#pnl-chooseImage').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';
});

// Return to the exercise
document.querySelector('#btn-go-choose-image-back').addEventListener('click', function () {
  document.querySelector('#pnl-chooseImage').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
});

// List Exercises.
var listItemEx = document.getElementById('list-items-ex');

// List Session.
var listItemSes = document.getElementById('list-items-ses');

// List All images.
var listImages = document.getElementById('list-images');

/**
 * Load the list of Images.
 */
function initListImages() {
  // List of all images.
  var listImages = [  "gym-ab-bikes.png",
                      "gym-crunch-abdos.png",
                      "gym-planche.png",
                      "gym-squat.png",
                      "gym-allonge.png",
                      "gym-desk.png",
                      "gym-side-plank.png",
                      "gym-standing-butterfly.png",
                      "gym-arm.png",
                      "gym-donkey-side-kick.png",
                      "gym-single-leg-hip-raise.png",
                      "gym-bridge.png",
                      "gym-mountain.png",
                      "gym-situps.png"];

  for (var i = 0; i < listImages.length; i++) {
    addImage("images/" + listImages[i]);
  }

}

function addImage(path) {
  var li = document.createElement("li");
  var aside = document.createElement("aside");
  aside.className = "pack-end";
  var image = document.createElement("img");
  image.src = path;
  image.id = path;

  aside.appendChild(image);
  listImages.appendChild(aside);

}

initListImages();

/**
 * Select a exercice to update.
 */
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
            var imagePath = document.getElementById('imagePathUpd');
            var idUpd = document.getElementById('idUpd');
            
            name.value = request.result.name;
            nbRetry.value = request.result.nbRetry;
            breakTime.value = request.result.breakTime;
            duration.value = request.result.duration;
            desc.value = request.result.desc;

            if (request.result.imagePath == "") {
              imagePath.style.display = "none";
            } else {
              imagePath.style.display = "visible";
            }
            imagePath.src = request.result.imagePath;
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
  document.getElementById('btn-del-ses').disabled = false;
  
  var collEnfants = e.target.parentNode.childNodes;
  var i = 0;
  for (i = 0; i < collEnfants.length; i++)  {
    
    if (collEnfants[i].tagName === 'P') {
      try {
        document.querySelector('#currentSession').className = 'current';
        document.querySelector('[data-position="current"]').className = 'left';
        
        var id = parseInt(e.target.parentNode.id);
        
        var idSession = document.getElementById('idSession');
        idSession.value = id;
        
        session.setIdSession(id);
        
        var title = document.getElementById('idTitleSession');
        title.innerHTML = collEnfants[i].innerHTML;
        listSessionEx(id);

        var transaction = db.transaction(["sessions"]);
        var objectStore = transaction.objectStore("sessions", 'readonly');
        var request = objectStore.get(id);

        request.onerror = function(event) {
          console.log("Not found for Id: " + id);
        };
        
        request.onsuccess = function(evt) {
      
          try {
            if (request.result.hasOwnProperty("chainExercises")) {
              session.setChainExercises( request.result.chainExercises);
            } else {
              session.setChainExercises(false);
            }
            session.setdelayBetweenExercises(parseInt(request.result.delayBetweenExercises));
          } catch (e) {
            console.log(e);
          }
        };
        break;
      } catch (ex) {
        console.log(ex);
      }
    }
  }
}

/**
 * Update image path for the exercise.
 */ 
listImages.onclick = function(e) {
 
  try {
    var idUpd = document.getElementById('idUpd');
    if (parseInt(idUpd.value) == -1) {
      var imagePath = document.getElementById('imagePath');
      imagePath.src = e.target.id;
      imagePath.style.display = "visible";
    } else {
      var imagePath = document.getElementById('imagePathUpd');
      imagePath.src = e.target.id;
      imagePath.style.display = "visible";
    }

    document.querySelector('#pnl-chooseImage').className = 'right';
    document.querySelector('[data-position="current"]').className = 'current';
  } catch (e) {
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
      var check = document.getElementById('chk-chainExercises');
      var delayBetweenExercises = document.getElementById('idDelayBetweenExercises');
      try {
        var idSession = request.result.idSession;
      } catch (e) {
        console.log(e);
      }
      name.value = request.result.name;
      desc.value = request.result.desc;
      delayBetweenExercises.value = request.result.delayBetweenExercises;
      if (request.result.hasOwnProperty("chainExercises")) {
        check.checked = request.result.chainExercises;
      } else {
        check.checked = false;
      }
      
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
    var imagePath = document.getElementById("imagePath");
    var idSession = document.getElementById('idSession');

    var path = "";
    if (imagePath.src.indexOf("app.html") < 0) {
      var index = imagePath.src.lastIndexOf("/");
      path = "images" + imagePath.src.substring(index);
    }
    
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
      imagePath: path,
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
    var imagePath = document.getElementById('imagePathUpd');
    var path = "";
    if (imagePath.src.indexOf("app.html") < 0) {
      var index = imagePath.src.lastIndexOf("/");
      path = "images" + imagePath.src.substring(index);
    }
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
      imagePath: path,
      idSession :parseInt(idSession.value),
      created:new Date()
    }
        
    var request = store.put(exerciceRecord);
    
    request.onerror = function(e) {
      console.log("Error exercice", e.target.error.name);
    }
    
    request.onsuccess = function(event) {
      dataChange(parseInt(idSession.value));
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
      + " [" + cursor.value.duration
      + " - " + cursor.value.breakTime + "]"
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


function previousEx() {

  var ok = session.setNumExercise(session.getNumExercise() - 1);
  displayCurrentExercise();
  return ok;
}

function nextEx() {

  var ret = session.setNumExercise(session.getNumExercise() + 1);
  displayCurrentExercise();
  return ret;
}

function hasNextEx() {
  console.log(session.hasNextExercise());
  return session.hasNextExercise();
}

function pauseEx() {

  if (flagStart) {
    if ( typeCounter == STATE_EX_EFFORT || typeCounter == STATE_EX_RECOVERY || typeCounter == STATE_EX_BETWEEN) {
      typeCounterPause = typeCounter;
      typeCounter = STATE_EX_PAUSE;
      chronos.stop();
    } else  {
      chronos.start();
      typeCounter = typeCounterPause;
    }
  }
}

function startEx() {

  if (!flagStart) {
    durationCounter =  0;
    breakTimeCounter = 0;
    nbRetryCounter = 1;
    durationBetweenExercise = 0;
    breakTimeDisplay.style.color = 'white';
    nbRetryDisplay.textContent = nbRetryCounter + "/" + curExercise.getNbRetry();
    typeCounter = STATE_EX_EFFORT;

    curExercise = session.getCurrentExercise();

    var effortDiv = document.getElementById('effortDiv');
    effortDiv.style.color = EFFORT_COLOR;
        
    chronos.start();
    flagStart = true;
    try {
      var exercise = new Exercise(name, curExercise.getDuration(), curExercise.getBreakTime(), curExercise.getNbRetry());
      session.startExercise(exercise);
    } catch(e) {
      console.log(e);
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
  if (parameters.isSound()) {
    document.getElementById(sound).play();
  }
}

/**
 * Manage the chain of the exercises.
 */
function display() {

  switch (typeCounter) {
    // Duration
    case STATE_EX_EFFORT:
    breakTimeDisplay.style.color = 'white';
    durationCounter++;
    
    if (durationCounter == 1) {
      var effortDiv = document.getElementById('effortDiv');
      effortDiv.style.color = EFFORT_COLOR;
      playSound('beepBeginSound');
    }

    if ((curExercise.getDuration() - durationCounter) == 10) {
      var effortDiv = document.getElementById('effortDiv');
      effortDiv.style.color = 'red';
    }
    
    if (durationCounter >= curExercise.getDuration()) {
      playSound('beepEndSound');

      if ('vibrate' in navigator) {
        window.navigator.vibrate(1000);
      } 

      breakTimeCounter = 0;
      typeCounter = STATE_EX_RECOVERY;
    }
    var nbSec = curExercise.getDuration() - durationCounter;
    displaySecond(chronoDisplay, nbSec);
    break;

    // Recovery
    case STATE_EX_RECOVERY:
 
    breakTimeCounter++;
    if (breakTimeCounter > curExercise.getBreakTime()) {
      nbRetryCounter++;
      if (nbRetryCounter <= curExercise.getNbRetry()) {

        nbRetryDisplay.textContent = nbRetryCounter + "/" + curExercise.getNbRetry();
        typeCounter =  STATE_EX_EFFORT;
        durationCounter = 0;
      } else {
        typeCounter = STATE_EX_BETWEEN;
        durationCounter = 0;
        displaySecond(breakTimeDisplay, 0);
      }
    } else {
      var nbSec =  curExercise.getBreakTime() - breakTimeCounter;
      displaySecond(breakTimeDisplay, nbSec);
    }
    
    if ((curExercise.getBreakTime() - breakTimeCounter) == 5) {
      // 
      playSound('5SecSound');
    }
    break;
    
    case STATE_EX_BETWEEN:

    if (parameters.isNextExercise() ) {

      if (durationBetweenExercise == 0) {
        // Pass to the next exercise.
        var ok = nextEx();
        if (!ok) {
          session.stopExercise();
          endExercise();
          chronos.stop();
          playSound('finalSound');
          break;
        }
        
        if (!session.isChainExercises()) {
          typeCounter = STATE_EX_EFFORT;
          session.stopExercise();
          endExercise();
          chronos.stop();
          break;
        }
      }
    } else {
      session.stopExercise();
      endExercise();
      chronos.stop();
      break;
    }

    if (durationBetweenExercise == 0) {
      // Sound begin chain exercice.
      playSound('beginChangeSound');
      durationBetweenExercise++;
    } else {
      if ( durationBetweenExercise <= session.getdelayBetweenExercises()) {
        breakTimeDisplay.style.color = EFFORT_COLOR;
        displaySecond(breakTimeDisplay, session.getdelayBetweenExercises() - durationBetweenExercise);
        durationBetweenExercise++;
      } else {
        if (durationBetweenExercise >= session.getdelayBetweenExercises()) {
          // Temps entre exercise depasse. Exercice suivant.
          durationBetweenExercise = 0;
          breakTimeDisplay.style.color = 'white';
          typeCounter = STATE_EX_EFFORT;
          startEx();
        }
      }
    }
    break;
  }
}

/**
 * Display the number of second (HH:MM:SS).
 */
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
  breakTimeDisplay.style.color = "white";
  endExercise();
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

  if ('requestWakeLock' in navigator) {
    try {
      this.lock = window.navigator.requestWakeLock("screen");
    } catch(e) {
      console.log("Can't lock the screen!" + e);
    }
  }

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
      // alert(e);
      console.log(e);
    }
  }
}


/**
 * Update session.
 */
function updateSession(flagExercise) {
  try {
    
    var nameId = document.getElementById("nameSession");
    var descId = document.getElementById("descSession");
    var idSession = document.getElementById('idSession');
    var chkChainExercises = document.getElementById('chk-chainExercises');
    var delayBetweenExercises = document.getElementById('idDelayBetweenExercises').value;
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
        chainExercises : chkChainExercises.checked,
        delayBetweenExercises: delayBetweenExercises,
        created:new Date()
      }
      
      var request = store.add(sessionRecord);
      
      request.onerror = function(e) {
        console.log("Error SportsTimer", e.target.error.name);
      }
      
      request.onsuccess = function(event) {
        if (flagExercise) {
          console.log("flagExercise new exercise" + event.currentTarget.result);
          document.querySelector('#listExercise').className = 'current';
          document.querySelector('#updSession').className = 'right';
          idSession.value = event.currentTarget.result;
          displayListUpdateExercise(event.currentTarget.result);
        } else {
          console.log("Update exercises");
          document.getElementById('idSession').value = event.target.result;
          document.getElementById('btn-add-sesEx').disabled = false;
        
          displayListSessions();
          document.querySelector('#updSession').className = 'right';
          document.querySelector('[data-position="current"]').className = 'current';
        }
      }
    } else {
      // Update session
      var sessionRecord = {
        name: nameSes,
        desc: descSes,
        chainExercises : chkChainExercises.checked,
        delayBetweenExercises: delayBetweenExercises,
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
 * Load the list of exercise for a Session 
 */ 
function listSessionEx(idSession) {
  var objectStore = db.transaction("exercice").objectStore("exercice");
  
  session.initListExercises();

  var index = objectStore.index("BySession");
  var id = parseInt(idSession);
  var request = index.openCursor(IDBKeyRange.only(id));
  var i = 0;
  request.onsuccess = function(event) {
    try {
      var cursor = event.target.result;
      if (cursor) {
        var exercise = new Exercise( cursor.value.name,  cursor.value.duration,  cursor.value.breakTime, cursor.value.nbRetry);
        exercise.setImagePath(cursor.value.imagePath);
        session.addListExercises(exercise);
        cursor.continue();
      }
      else {
        displayCurrentExercise();
      }
    } catch (e) {
      console.log(e);
    }
  };

  request.onerror = function(e) {
    console.log("listExercise ", e);
  }
}

function displayCurrentExercise() {
  try {
    curExercise = session.getCurrentExercise();
    if (curExercise != null) {
      var nameExercise = document.getElementById("idNameExercise");
      var image = document.getElementById("idImageExercise");
      var infoExercise = document.getElementById("idInfoExercise");
   
      nameExercise.textContent = curExercise.getName();
      infoExercise.textContent = "[" + curExercise.getDuration() 
    + " -  " + curExercise.getBreakTime() + "]"
    + "x" + curExercise.getNbRetry();
        image.src = curExercise.getImagePath();

        nbRetryCounter = 1;
        nbRetryDisplay.textContent = nbRetryCounter + "/" + curExercise.getNbRetry();
    }
      
  } catch(e) {
    console.log(e);
  }
}

/**
 * Display the list of Sessions.
*/
function displayListSessions() {
  //loadParameters(1);
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

  li.appendChild(a);
  list.appendChild(li);
}

// Add Exercises to Session.
function addExercisesToSession() {
  var idSession = document.getElementById('idSession');
  var id = parseInt(idSession.value);
  if (id == -1) {
    updateSession(true);
  } else {
    document.querySelector('#listExercise').className = 'current';
    document.querySelector('#updSession').className = 'right';

    displayListUpdateExercise(idSession.value);
  }
}

function deleteSession() {
    if (window.confirm(navigator.mozL10n.get("confirmDeleteSession"))) {
      var idSession = document.getElementById('idSession');
      var id  = parseInt(idSession.value);

      // Delete session and exercises.
      dbDeleteSession(id);

      document.querySelector('#updSession').className = 'right';
      document.querySelector('[data-position="current"]').className = 'current';

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

        displayListSessions();
    }
}

/**
 * Actualize the list, after modification of session/exercice.
*/
function dataChange(idSession) {

    displayListUpdateExercise(idSession);
    displayListSessions();
    listSessionEx(idSession);
}

function removeAllItems(list) {
    // remove all element in the list.
	while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}
