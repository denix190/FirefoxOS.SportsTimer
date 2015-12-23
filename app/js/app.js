'use strict';

var durationCounter;
var breakTimeCounter;
var nbRetryCounter;
var durationBetweenExercise;

var curExercise;

var typeCounter;
var typeCounterPause;

var flagStart = false;

// The session selected in the calendar of the program.
var slctSession;

var chronoDisplay = document.getElementById('chronoDisplay');
var nbRetryDisplay = document.getElementById('nbRetryDisplay');

var session = new Session();
var chronos = new Chronos();

// Parameters
var parameters = new Parameters();

// The current program to display.
var currentProg = new Program();
var isProgramDisplay = false;

// Display the panel adding a Exercise.
document.querySelector('#btn-go-add-ex').addEventListener('click', function () {

  document.getElementById('nameEx').value = "";
  document.getElementById('nbRetry').value = "1";
  document.getElementById('descEx').value = "";
  document.getElementById('duration').value = "60";
  document.getElementById('breakTime').value = "30";
  document.getElementById('imagePath').src = "images/gym-null.png";
  document.getElementById('idUpd').value = "-1";
  
  document.querySelector('#addExercise').className = 'current';
  document.querySelector('#listExercise').className = 'right';
});

document.querySelector('#btn-go-add-ex-back').addEventListener('click', function () {
  document.querySelector('#addExercise').className = 'right';
  document.querySelector('#listExercise').className = 'current';
});

/* Back to list list of exercise */
document.querySelector('#btn-go-upd-ex-back').addEventListener('click', function () {
  document.querySelector('#updExercise').className = 'right';
  document.querySelector('#listExercise').className = 'current';
});

document.querySelector('#btn-go-list-ex-back').addEventListener('click', function () {
  document.getElementById('nameSession').scrollIntoView(true);
  document.querySelector('#listExercise').className = 'right';
  document.querySelector('#updSession').className = 'current';
});

document.querySelector('#btn-go-add-ex-back').addEventListener('click', function () {
  document.querySelector('#addExercise').className = 'right';
  document.querySelector('#listExercise').className = 'current';
});

/**
 * Launch SportsTimer.
 */
function launchSelf() {
  var request = window.navigator.mozApps.getSelf();
  request.onsuccess = function() {
    if (request.result) {
      request.result.launch();
    }
  };
}


if (navigator.mozSetMessageHandler) {
  navigator.mozSetMessageHandler("alarm", function (alarm) {
    // only launch a notification if the Alarm is of the right type for this app 
    if(alarm.data.program) {
      launchSelf();
      // Create a notification when the alarm is due
      try {
        notifyMe(alarm.data.program + "/" +  alarm.data.session);
      } catch(e) {
        console.log(e);
      }
    }
  });
}

/**
 * Notify
 */
function notifyMe(task) {

  if (!("Notification" in window)) {
    window.alert("Ce navigateur ne supporte pas les notifications desktop");
  }
  // Voyons si l'utilisateur est OK pour recevoir des notifications
  else if (Notification.permission === "granted") {
    // Ok create a Notification.
    var notification = new Notification("SportsTimer:" + task);
  }
  else if (Notification.permission !== 'denied') {
    window.alert("Access denied !");
    Notification.requestPermission(function (permission) {

      // Quelque soit la réponse de l'utilisateur, nous nous assurons de stocker cette information
      if(!('permission' in Notification)) {
        Notification.permission = permission;
      }

      // Si l'utilisateur est OK, on crée une notification
      if (permission === "granted") {
        var notification = new Notification("SportsTimer:" + task);
      }
    });
  }
}
  
  
  // This should open the application when the user touches the notification
  // but it only works on later FxOS versions, e.g. 2.0/2.1
/*
navigator.mozSetMessageHandler("notification", function (message) {
    if (!message.clicked) {
      console.log("clicked");
      return;
    }
    
    navigator.mozApps.getSelf().onsuccess = function (evt) {
      console.log("app");
      var app = this.result;
      app.launch();
    };
  }); 
*/
// Add a new Session.
document.querySelector('#btn-go-add-session').addEventListener('click', function () {
  try {
    var id= document.getElementById('idSession');
    id.value = "-1";

    document.getElementById('btn-del-ses').className = "invisible";
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

  if (isProgramDisplay) {
      document.querySelector('#updSession').className = 'right';
      document.querySelector('#updProgram').className = 'current';
  } else {
    var id = parseInt(idSession.value);
    if (id == -1) {
      document.querySelector('#updSession').className = 'right';
      document.querySelector('[data-position="current"]').className = 'current';
    } else {
      document.querySelector('#updSession').className = 'right';
      document.querySelector('#currentSession').className = 'current';
    }
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
  document.querySelector('#sessions').className = 'current';
});


document.querySelector('#imagePathUpd').addEventListener('click', function () {
  document.querySelector('#pnl-chooseImage').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';
});

document.querySelector('#imagePath').addEventListener('click', function () {
    document.querySelector('#pnl-chooseImage').className = 'current';
    document.querySelector('[data-position="current"]').className = 'left';
});

// Program
// 
// Display the panel updating a Session.
document.querySelector('#btn-go-add-program').addEventListener('click', function () {
  try {
    var idProgram = document.getElementById('idProgram');
    idProgram.value = "-1";

    var listWeeks= document.getElementById("weeks");
    removeAllItems(listWeeks);

    currentProg.setIdProgram(-1);
    currentProg.resetCalendar();
    
    document.getElementById('btn-del-prog').disabled = true;
    document.getElementById('nameProgram').value = "";
    document.getElementById('descProgram').value = "";

    document.querySelector('#updProgram').className = 'current';
    document.querySelector('[data-position="current"]').className = 'left';
   
  } catch(e) {
    console.log(e);
  }
});

document.querySelector('#btn-go-upd-program-back').addEventListener('click', function () {
  var idProgram = document.getElementById('idProgram');

  var id = parseInt(idProgram.value);
  if (id == -1) {
    document.querySelector('#updProgram').className = 'right';
    document.querySelector('[data-position="current"]').className = 'current';
  } else {
    document.querySelector('#updProgram').className = 'right';
    document.querySelector('#pnl-programs').className = 'current';
  }

});

// Update the Session/date for a program return to the current program.
document.querySelector('#btn-go-upd-session-prog').addEventListener('click', function () {

  try {
    document.querySelector('#updProgram').className = 'current';
    document.querySelector('#listSessions').className = 'left';

    var session = document.getElementById('list-select-session');
    var id = parseInt(session.options[session.selectedIndex].value);

    var startTime = document.getElementById('startTime');

    var valueAsNumber = startTime.valueAsNumber;
    var h = new Date(valueAsNumber);

    var hour = new Hour();
    hour.setTime(h.getHours(), h.getMinutes());
    console.log(slctSession);
    //The session select on the calendar.
    slctSession.style.color = "red";
    slctSession.className = "daySelected";
    slctSession.childNodes[1].innerHTML = hour.getDisplay(); // "&#10003";
    
    // Session selected id :  column / row 

    var values = slctSession.id.split("/");
    var week = parseInt(values[1]);
    var day = parseInt(values[0]);
    console.log("week" + week + " day " + day + " id " + id);

    currentProg.setSession(week, day, id, hour);
    
    slctSession.value = id;
   
  } catch (ex) {
    console.log(ex);
  }
 
});

/**
 * List all the alarms for SportsTimer.
 */
document.querySelector('#btn-list-alarm').addEventListener('click', function () {
  var allAlarmsRequest = navigator.mozAlarms.getAll();
  allAlarmsRequest.onsuccess = function() {
    
    this.result.forEach(function (alarm) {
      console.log(alarm.id + ' : ' + alarm.date.toString() + ' : ' + alarm.respectTimezone);
      console.log( alarm);
    });
  };
});

/**
 * Remove all the alarms for SportsTimer.
 */
document.querySelector('#btn-remove-Allalarm').addEventListener('click', function () {
  var request = navigator.mozAlarms.getAll();

  request.onsuccess = function () {
    // Remove all pending alarms
    this.result.forEach(function (alarm) {
      navigator.mozAlarms.remove(alarm.id);
    });
  }

  request.onerror = function () {
    console.log('operation failed: ' + this.error);
  }
  
});

/**
 * Start the program.
 */
document.querySelector('#btn-start-prog').addEventListener('click', function () {

  if(navigator.mozAlarms) {

    try {
      var dateEvent =  new Date();
      dateEvent.setSeconds(0);
      var now =  new Date();
      var day = dateEvent.getDay();
      var date = dateEvent.getDate();
      var calendar = currentProg.getCalendar();

      for (var j = 0; j < calendar.length; j++) {
        try {
          for (var i = 0; i < 7; i++) {
            var newDate = ((date + i - day) + (7*j) );
            dateEvent.setDate(newDate);

            var session = currentProg.getSession(j, i);
            if (session != -1 && session !== 0) {
              var h = currentProg.getHour(j, i);
              dateEvent.setHours(h.hours);
              dateEvent.setMinutes(h.minutes);

              if (dateEvent.getTime() > now.getTime()) {
                var d = new Date();
                d.setTime(dateEvent.getTime());

                var sessionName = getSession( currentProg.getSession(j, i), d, currentProg.getName(), sendAlarm );
              }
            } 
          }
        } catch(e) {
          console.log(e);
        }
      }

    } catch(e) {
      console.log(e);
    }
  } else {
    console.log("Alarm not created - your browser does not support the Alarm API.");
  }
      
});

/**
 * Send the alarm.
 * @param date The date of the alarm
 * @param data the data to send to the alarm
 */
function sendAlarm(date, programName, sessionId, sessionName) {

  console.log("sendAlarm Date " + date +
              " programName " + programName +
              " sessionName " + sessionName);
  var data = {
    program: programName, 
    session: sessionName,
    idSession: sessionId
  };

  try {
    var alarmRequest = navigator.mozAlarms.add(date, "ignoreTimezone", data);
    
    alarmRequest.onsuccess = function () {
      console.log("onsuccess alarm:" + date);
    };
    
    alarmRequest.onerror = function () { 
      console.log("An error occurred: " + this.error.name);
    };
    
  } catch(e) {
    console.log(e);
  }
}
      

// Button Event.

// Exercise
document.querySelector('#btn-previous-ex').addEventListener('click', previousEx);
document.querySelector('#btn-next-ex').addEventListener('click', nextEx);
document.querySelector('#btn-start-ex').addEventListener('click', startEx);
document.querySelector('#btn-pause-ex').addEventListener('click', pauseEx);
document.querySelector('#btn-cancel-ex').addEventListener('click', cancelEx);


// Store new exercise.
document.querySelector('#btn-add-ex').addEventListener('click', storeEx);

// Update an exercise.
document.querySelector('#btn-upd-ex').addEventListener('click', updateEx);

document.querySelector('#btn-del-ex').addEventListener('click', deleteExercise);

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

// Choose sessions
document.querySelector('#btn-choose-sessions').addEventListener('click', function () {
  isProgramDisplay = false;
  document.querySelector('#sessions').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';
});

// Choose program
document.querySelector('#btn-choose-programs').addEventListener('click', function () {
  isProgramDisplay = true;

  displayListPrograms();
  
  document.querySelector('#pnl-programs').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';
});

document.querySelector('#btn-go-main-back').addEventListener('click', function () {
  document.querySelector('#sessions').className = 'left';
  document.querySelector('[data-position="current"]').className = 'current';
});

document.querySelector('#btn-go-main-prog-back').addEventListener('click', function () {
  document.querySelector('#pnl-programs').className = 'left';
  document.querySelector('[data-position="current"]').className = 'current';
});

document.querySelector('#btn-go-program-back').addEventListener('click', function () {
  document.querySelector('#listSessions').className = 'left';
  document.querySelector('[data-position="current"]').className = 'current';
 
});

// Update an exercise.
document.querySelector('#btn-upd-program').addEventListener('click', updateProgram);

document.querySelector('#btn-del-prog').addEventListener('click', deleteProgram);


document.querySelector('#btn-remove-progses').addEventListener('click', removeProgSession);


// List Exercises.
var listItemEx = document.getElementById('list-items-ex');

// List Session 
var listItemSes = document.getElementById('list-items-ses');

// List Session for program
var listSlctSes = document.getElementById('list-select-session');

// List Program
var listItemProgram = document.getElementById('list-items-progs');

// List All images.
var listImages = document.getElementById('list-images');

/**
 * Load the list of Images.
 */
function initListImages() {
  // List of all images.
  var listImages = [
        "gym-null.png",
        "dessin.svg",
    "gym-ab-bikes.png",
    "gym-crunch-abdos.png",
    "gym-flexion.png",
    "gym-planche.png",
    "gym-pump.png",
    "gym-squat.png",
    "gym-allonge.png",
    "gym-desk.png",
    "gym-side-plank.png",
    "gym-standing-butterfly.png",
    "gym-arm.png",
    "gym-curl.png",
    "gym-shoulder.png",
    "gym-thigh.png",
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
  li.appendChild(aside);
  listImages.appendChild(li);

}

initListImages();

/**
 * List of exercises.
 * Select a exercice to update.
 */
listItemEx.onclick = function(e) {
  var collEnfants = e.target.parentNode.childNodes;
  
  var i = 0;
  for (i = 0; i < collEnfants.length; i++)  {
    if (collEnfants[i].tagName === 'A'){
      var id = parseInt(collEnfants[i].id);
      displayExercise(id);
      break;
    }
    if (collEnfants[i].tagName === 'P'){
      var id = parseInt(collEnfants[i].parentNode.id);
      displayExercise(id);
      break;
    }
  }
};

/**
 * Display the exercise selected.
 * @param id id of the exercise.
 */
function displayExercise(id) {
  try {
    document.querySelector('#updExercise').className = 'current';
    document.querySelector('[data-position="current"]').className = 'left';
    
    document.querySelector('#listExercise').className = 'left';
    
    var transaction = db.transaction(["exercice"]);
    var objectStore = transaction.objectStore("exercice", 'readonly');
    
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
      
      imagePath.src = request.result.imagePath;
      idUpd.value = id;
    };
  } catch (ex) {
    console.log(ex);
  }
}


/**
 * Select a session and display.
 */
listItemSes.onclick = function(e) {
  
  document.getElementById('btn-add-sesEx').disabled = false;
  //document.getElementById('btn-del-ses').disabled = false;
  document.getElementById('btn-del-ses').className = "danger";
  
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
};

/**
 * Update image path for the exercise.
 */ 
listImages.onclick = function(e) {
 
  try {
    var idUpd = document.getElementById('idUpd');
    if (parseInt(idUpd.value) == -1) {
      var imagePath = document.getElementById('imagePath');
      imagePath.src = e.target.id;
      // imagePath.style.display = "visible";
    } else {
      var imagePath = document.getElementById('imagePathUpd');
      imagePath.src = e.target.id;
      //imagePath.style.display = "visible";
    }

    document.querySelector('#pnl-chooseImage').className = 'right';
    document.querySelector('[data-position="current"]').className = 'current';
  } catch (e) {
    console.log(e);
  }
};

/**
 * Display the session
 */
function displaySession() {
  try {
    document.querySelector('#currentSession').className = 'left';
    document.querySelector('#updSession').className = 'current';
    
    //document.getElementById('btn-remove-progses').className = "invisible";
    document.getElementById('btn-del-ses').className = "danger";

    var idSession = document.getElementById('idSession');
    var id = idSession.value;
    loadSession(id);
    
  } catch (ex) {
    console.log(ex);
  }
}

/**
 * Load the data the session in the panel.
 */
function loadSession( id )  {
  var transaction = db.transaction(["sessions"]);
  var objectStore = transaction.objectStore("sessions", 'readonly');
  
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
    
   // idSession.value = id;
  };
} 


/**
 * Get the session and launch the callback for the alarm.
 * @param id id of the session.
 */
function getSession( id , dateEvent, programName, Callback)  {


  var transaction = db.transaction(["sessions"]);
  var objectStore = transaction.objectStore("sessions", 'readonly');
  
  var request = objectStore.get(parseInt(id));
  var session =null;
  request.onerror = function(event) {
    console.log("Not found for Id: " + id);
  };
  
  request.onsuccess = function(evt) {
    try {
      var result = evt.target.result;
      session = result.name;
      Callback(dateEvent, programName, id, session);

      return;
    } catch(e) {
      console.log(e);
    }
  };
  
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

    if (nameEx.length === 0) {
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
    };

    /* */
    var request = store.add(exerciceRecord);
    
    request.onerror = function(e) {
      console.log("Error exercice", e.target.error.name);
    };
    
    request.onsuccess = function(event) {
      dataChange(parseInt(idSession.value));
    };
        
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
    };
        
    var request = store.put(exerciceRecord);
    
    request.onerror = function(e) {
      console.log("Error exercice", e.target.error.name);
    };
    
    request.onsuccess = function(event) {
      dataChange(parseInt(idSession.value));
    };
    
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
          document.createTextNode(cursor.value.name +
                                 " (" + cursor.value.duration +
                                 " -  " + cursor.value.breakTime + ")" +
                                 "*" + cursor.value.nbRetry) );
        
        opt.value = cursor.value.duration +
                  "," + cursor.value.breakTime +
                  "," + cursor.value.nbRetry; 
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
  };
}

/**
 * Add an exercise to the list.
 */ 
function addExercise(list, cursor) {
  var li = document.createElement("li");
  
  var a = document.createElement("a");
  a.setAttribute("id", cursor.value.id);
  a.href = "#";
                                            
  var pName = document.createElement("p");
  pName.innerHTML = cursor.value.name;

  var pInfo = document.createElement("p");
  pInfo.innerHTML = " [" + cursor.value.duration +
     " - " + cursor.value.breakTime + "]" +
            "x" + cursor.value.nbRetry;
  
  a.appendChild(pName);
  a.appendChild(pInfo);
 
  var aside = document.createElement("aside");
  aside.className = "pack-end";
  var img = document.createElement("img");
  
  img.src = cursor.value.imagePath;
  aside.appendChild(img);

  li.appendChild(aside);
  li.appendChild(a);

  list.appendChild(li);    
}

/**
 * Delete the current exercise.
 */
function deleteExercise() {
  if (window.confirm(navigator.mozL10n.get("confirmDeleteExercice"))) {
    var idUpd = document.getElementById('idUpd');

    var id = parseInt(idUpd.value);
    
    var transaction = db.transaction(["exercice"],"readwrite");
    var store = transaction.objectStore("exercice");

    var request = store.delete(id); 

    var idSession = document.getElementById('idSession');

    dataChange(parseInt(idSession.value));

    document.querySelector('#addExercise').className = 'right';

    document.querySelector('#listExercise').className = 'current';
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
      // chronos.start();
      // typeCounter = typeCounterPause;
    }
  }
  // Pause the session.
  session.pauseSes();
}

function startEx() {

  if (!flagStart) {
    durationCounter =  0;
    breakTimeCounter = 0;
    nbRetryCounter = 1;
    durationBetweenExercise = 0;
    nbRetryDisplay.textContent = nbRetryCounter + "/" + curExercise.getNbRetry();
    typeCounter = STATE_EX_EFFORT;

    curExercise = session.getCurrentExercise();

    var effortDiv = document.getElementById('effortDiv');
    effortDiv.style.color = EFFORT_COLOR;
        
    chronos.start();
    flagStart = true;
    session.startSes();
    try {
      var exercise = new Exercise(name, curExercise.getDuration(), curExercise.getBreakTime(), curExercise.getNbRetry());
      session.startExercise(exercise);
    } catch(e) {
      console.log(e);
    }
  } else {
    if (typeCounter == STATE_EX_PAUSE) {
      session.continue();
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
   
    var style = EFFORT_COLOR; 
    if (durationCounter === 0) {
      var effortDiv = document.getElementById('effortDiv');
      playSound('beepBeginSound');
    }

    if ((curExercise.getDuration() - durationCounter) <= 10) {
      var effortDiv = document.getElementById('effortDiv');
      style = EFFORT_END_COLOR;
    }
    
    if (durationCounter >= curExercise.getDuration()) {
      if (curExercise.getBreakTime() > 0) {
        playSound('beepEndSound');
      }

      if ('vibrate' in navigator) {
        window.navigator.vibrate(500);
      } 

      breakTimeCounter = 0;
      typeCounter = STATE_EX_RECOVERY;
    }
    var nbSec = curExercise.getDuration() - durationCounter;
    displaySecond(chronoDisplay, nbSec, style);
    durationCounter++; 
    break;

    // Recovery
    case STATE_EX_RECOVERY:

    if (breakTimeCounter > curExercise.getBreakTime() || curExercise.getBreakTime() === 0) {
      nbRetryCounter++;
      if (nbRetryCounter <= curExercise.getNbRetry()) {

        nbRetryDisplay.textContent = nbRetryCounter + "/" + curExercise.getNbRetry();
        typeCounter =  STATE_EX_EFFORT;
        durationCounter = 0;
      } else {
        typeCounter = STATE_EX_BETWEEN;
        durationCounter = 0;
      }
    } else {
      var nbSec =  curExercise.getBreakTime() - breakTimeCounter;
      displaySecond(chronoDisplay, nbSec, RECOVERY_COLOR);
    }
    
    if ((curExercise.getBreakTime() - breakTimeCounter) == 5) {
      // 
      playSound('5SecSound');
    }
    breakTimeCounter++;
    break;
    
    case STATE_EX_BETWEEN:

    if (parameters.isNextExercise() ) {

      if (durationBetweenExercise === 0) {
        // Pass to the next exercise.
        var ok = nextEx();
        if (!ok) {
          session.stopExercise();
          endExercise();
          chronos.stop();
          session.stopSes();
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

    if (durationBetweenExercise === 0) {
      // Sound begin chain exercice.
      playSound('beginChangeSound');
    }
    if ( durationBetweenExercise <= session.getdelayBetweenExercises()) {
      displaySecond(chronoDisplay, session.getdelayBetweenExercises() - durationBetweenExercise, BETWEEN_COLOR);
      durationBetweenExercise++;
    } else {
      if (durationBetweenExercise >= session.getdelayBetweenExercises()) {
        // Temps entre exercise depasse. Exercice suivant.
        durationBetweenExercise = 0;
        typeCounter = STATE_EX_EFFORT;
        startEx();
      }
    }
    break;
  }
}

/**
 * Get a string for the number of seconds.
 * @param nbSec number of seconds to display.
 */
function getStringTime(nbSec) {
  var seconds = new String(nbSec % 60);
  var minutes = new String(Math.floor(nbSec / 60));
  var hours = Math.floor(nbSec / 3600);
  
  if (seconds.length < 2) {
    seconds = '0' + seconds;
  }
  if (minutes.length < 2) {
    minutes = '0' + minutes;
  }
  
  var ret = "";
  
  if (hours === 0) {
      ret = minutes + ":" + seconds;
  } else {
    ret = new String(hours) + ":" + minutes + ":" + seconds;
  }
  return ret;
}


/**
 * Display the number of second (HH:MM:SS).
 */
function displaySecond(display, nbSec, style) {

  display.style.color = style;
  display.textContent = getStringTime(nbSec);
}

function endExercise() {
  flagStart = false;
}

/**
 * Cancel the session.
 */
function cancelEx() {

  if (window.confirm(navigator.mozL10n.get("confirmCancelSession"))) { 
    chronos.stop();
    // chronoDisplay.textContent = "00:00";

    displaySecond(chronoDisplay, 0, EFFORT_COLOR);
    nbRetryDisplay.textContent = "0/0";
    endExercise();
    
    // Cancel the session.
    session.cancelSes();
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

  if ('requestWakeLock' in navigator) {
    try {
      this.lock = window.navigator.requestWakeLock("screen");
    } catch(e) {
      console.log("Can't lock the screen!" + e);
    }
  }

  this.isLock = true;
};

Chronos.prototype.stop = function() {
  this.timer = window.clearInterval(this.timer);
  try {
    if (this.lock !== null && this.lock !== undefined && this.isLock === true) {
      this.lock.unlock();
      this.isLock = false;
    }
  } catch (e) {
    if (e.result =! 2152923147) {
      // alert(e);
      console.log(e);
    }
  }
};


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
        
    if (nameSes.length === 0) {
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
      };
      
      var request = store.add(sessionRecord);
      
      request.onerror = function(e) {
        console.log("Error SportsTimer", e.target.error.name);
      };
      
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

          if (isProgramDisplay) {
            document.querySelector('#updSession').className = 'right';
            document.querySelector('#updProgram').className = 'current';
          } else {
            document.querySelector('#updSession').className = 'right';
            document.querySelector('[data-position="current"]').className = 'current';
          }
        }
        displayListSessions();
      };
    } else {
      // Update session
      var sessionRecord = {
        name: nameSes,
        desc: descSes,
        chainExercises : chkChainExercises.checked,
        delayBetweenExercises: delayBetweenExercises,
        created:new Date(),
        idSession : id
      };
      var request = store.put(sessionRecord);
      
      request.onerror = function(e) {
        console.log("Error SportsTimer", e.target.error.name);
      };
      
      request.onsuccess = function(event) {
        dataChange(id);
        var title = document.getElementById('idTitleSession');
        title.innerHTML = nameSes;

        if (isProgramDisplay) {
          document.querySelector('#updSession').className = 'right';
          document.querySelector('#updProgram').className = 'current';
        } else {
          document.querySelector('#updSession').className = 'right';
          document.querySelector('#currentSession').className = 'current';
        }
      };
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
  };
}



/**
 * Dysplay the current exercise for the session.
 */
function displayCurrentExercise() {
  try {
    curExercise = session.getCurrentExercise();
    if (curExercise !== null) {
      var nameExercise = document.getElementById("idNameExercise");
      var image = document.getElementById("idImageExercise");
      var infoExercise = document.getElementById("idInfoExercise");

      var idCurExercise = document.getElementById("idCurExercise");

      idCurExercise.textContent = ""
                                + (session.getNumExercise() + 1)
                                +"/" + session.getNbExercises();

      nameExercise.textContent = curExercise.getName();
      infoExercise.textContent = "[" + getStringTime(curExercise.getDuration()) + 
                " - " + getStringTime(curExercise.getBreakTime()) + "]" +
        "x" + curExercise.getNbRetry();
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


/**
 * Add an Session to the list.
*/ 
function addSessionProg(list, cursor, id) {

  var opt = document.createElement("option");
  opt.value = cursor.value.idSession;

  if (cursor.value.idSession === id) {
    opt.selected = true;
  }
  opt.innerHTML = cursor.value.name
  
  list.appendChild(opt);
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
      var listSession = [];
      
      for (var i = 0; i  < chk.length;i++) {
        if (chk[i].checked === true) {
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

/*====================================================
* Programs 
* ==================================================== */
/**
 * Display the list of Programs.
*/
function displayListPrograms() {

  var objectStore = db.transaction("programs").objectStore("programs");
  var listProgs = document.getElementById("list-items-progs");
  
  removeAllItems(listProgs);
  
  objectStore.openCursor().onsuccess = function(event) {
    try {
      var cursor = event.target.result;
      if (cursor) {
        addProgram(listProgs, cursor);
        cursor.continue();
      }
      else {
        // alert("No more entries!");
      }
    } catch(e) {
      console.log(e);
    }
  };
}

/**
 * Add an Program to the list.
*/ 
function addProgram(list, cursor) {
  var li = document.createElement("li");
  
  var a = document.createElement("a");
  a.setAttribute("id", cursor.value.idProgram);
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

/** 
 * Add a week for the program. 
 * 
 *
 */
document.querySelector('#btn-add-week').addEventListener('click', function () {
  var ol = document.createElement("ol");
  try {
    currentProg.addWeek();

    for (var i = 0; i < 7; i++) {
      var li = document.createElement("li");

      var j = (currentProg.getCalendar().length - 1)
      li.id = "" + i + "/" + j;
      var span = document.createElement("span");
      span.textContent = i;
      span.className ="day";
      span.id = "" + i + "/" + "" + j;
      
      var pHour = document.createElement("span");
      pHour.id = "" + i + "/" + "" + j;
      pHour.className ="hour";
    
      pHour.innerHTML ="&nbsp;";

      li.appendChild(span);
      li.appendChild(pHour);

      ol.appendChild(li);
    }
  } catch(e) {
    console.log(e);
  }
  // Select to add or display a Session.
  ol.addEventListener("click", clickOnProgramSession);

  ol.className = "day";
  document.querySelector('#weeks').appendChild(ol);
});

/**
 * callback function call when you click on a cell of the calendar.
 * 
 */
function clickOnProgramSession(e) {
  try {
    var objectStore = db.transaction("sessions").objectStore("sessions");
    var listSes = document.getElementById("list-select-session");
    
    removeAllItems(listSes);
    
    // Load the list of sessions.
    objectStore.openCursor().onsuccess = function(event) {
      var id = e.target.parentNode.value;

      try {
        var cursor = event.target.result;
        if (cursor) {
          addSessionProg(listSes, cursor, id);
          cursor.continue();
        }
        else {
          // End of list of sessions.
          document.querySelector('#listSessions').className = 'current';
          document.querySelector('[data-position="current"]').className = 'left';

          if (e.target.nodeName === 'OL') {
            slctSession = e.target;
          } else if (e.target.nodeName === 'LI') {
            slctSession = e.target; 
          } else if (e.target.nodeName === 'SPAN') {
            slctSession = e.target.parentNode; 
          }
          console.log(slctSession);
          
          var startTime = document.getElementById('startTime');
          if (id !== undefined) {
            // New session for a program
            console.log("Id " + e.target.id);
            var values = e.target.id.split("/");
            var week = parseInt(values[1]);
            var day = parseInt(values[0]);
            currentProg.sessionSelected(week, day);
            var hour = currentProg.getHour(week, day);
            console.log(hour);
            startTime.valueAsDate = new Date(1970, 1, 1, hour.hours, hour.minutes);
            document.getElementById('btn-remove-progses').className= "danger";
          } else {
            // display an existing session
            try {
              document.getElementById('btn-remove-progses').className= "invisible";
              startTime.valueAsDate = new Date(1970, 1, 1, 12, 0);
              startTime.innerHTML = "12:0";
            } catch(e) {
              console.log(e);
            }
          }
        }
      } catch(e) {
        console.log(e);
      }
    };
  } catch(e) {
    console.log(e);
  }
}

/**
 * Display the session selected in the calendar.
 */
function displayProgramSession(value) {

  try {
    document.querySelector('#updSession').className = 'current';
    document.querySelector('#updProgram').className = 'right';

    document.getElementById('btn-remove-progses').className = "danger";

    document.getElementById('btn-del-ses').className ="invisible";

    var id = parseInt(value);
    
    var idSession = document.getElementById('idSession');
    idSession.value = id;
    
    session.setIdSession(id);
 
    listSessionEx(id);
    loadSession(id);

  } catch (ex) {
    console.log(ex);
  } 
}

/**
 * Select a session for a program
 */
listSlctSes.onclick = function(e) {
  
  var collEnfants = e.target.parentNode.childNodes;

  var i = 0;
  for (i = 0; i < collEnfants.length; i++)  {
    
    if (collEnfants[i].tagName === 'P') {
      try {
        document.querySelector('#updProgram').className = 'current';
        document.querySelector('#listSessions').className = 'left';

        var id = parseInt(e.target.parentNode.id);

        // The session select on the calendar.
        slctSession.style.color = "red";
        slctSession.className = "daySelected";
        slctSession.innerHTML = "&#10003";
        
        // Session selected id :  column / row 
        // 
        var values = slctSession.id.split("/");
        var week = parseInt(values[1]);
        var day = parseInt(values[0]);
        console.log("week" + week + " day " + day + " id " + id);
        currentProg.setSession(week, day, id);

        slctSession.value = id;

        break;
      } catch (ex) {
        console.log(ex);
      }
    }
  }
};

/**
 * Update or Add a program and return to the list of programs.
 */
function updateProgram() {

  var idProgram = document.getElementById('idProgram');
  var id = parseInt(idProgram.value);

  console.log("Udpate program id: " + id + " name " + nameProgram +
              " desc " + descProgram);
  console.log(currentProg.getCalendar());

  var prog = new Program();
  prog.setIdProgram(id);
  prog.setName(document.getElementById("nameProgram").value);
  prog.setDescription(document.getElementById("descProgram").value);
  prog.setCalendar(currentProg.getCalendar());

  // Update the program, return to the list of programs.
  dbUpdateProgram(prog, function() {
    document.querySelector('#pnl-programs').className = 'current';
    document.querySelector('#updProgram').className = 'right';

    displayListPrograms();
  });

}

/**
 * Display the program selected in the list of programs.
 */
listItemProgram.onclick = function(e) {

  var collEnfants = e.target.parentNode.childNodes;
  var i = 0;
  for (i = 0; i < collEnfants.length; i++)  {
    
    if (collEnfants[i].tagName === 'P') {
      var id = parseInt(e.target.parentNode.id);
      loadProgram(id, displayProgram);
    }
  }
};

/**
 * Load a program.
 * @param id Id of the program.
 */
function loadProgram(id, callback) {
  try {
    document.querySelector('#updProgram').className = 'current';
    document.querySelector('[data-position="current"]').className = 'left';
    document.getElementById('btn-del-prog').disabled = false;
     
    var transaction = db.transaction(["programs"]);
    var objectStore = transaction.objectStore("programs", 'readonly');
    
    var request = objectStore.get(parseInt(id));
    
    request.onerror = function(event) {
      console.log("Not found for Id: " + id);
    };
    
    request.onsuccess = function(evt) {
      var value = evt.target.result;
       
      try {
        var idProgram = request.result.idProgram;
        document.getElementById('idProgram').value = idProgram;
      } catch (e) {
        console.log(e);
      }

      var curProg = new Program();
      curProg.setName(request.result.name);
      curProg.setDescription(request.result.desc);
      curProg.setIdProgram(request.result.idProgram);
      curProg.setCalendar(request.result.week);

      callback(curProg);
    };
  } catch (ex) {
    console.log(ex);
  }
}

/**
 * Display the current Program.
 * @param prog The program to display.
 */
function displayProgram(prog) {

  try {
    var name = document.getElementById('nameProgram');
    var desc = document.getElementById('descProgram');
  
    name.value = prog.getName();
    desc.value = prog.getDescription();

    var calendar = prog.getCalendar();

    /** Load the current Program */
    currentProg.setCalendar(calendar);
    currentProg.setIdProgram(prog.getIdProgram());
    currentProg.setName(prog.getName());
    currentProg.setDescription(prog.getDescription());
    
    var listWeeks= document.getElementById("weeks");
    removeAllItems(listWeeks);
    if (calendar === undefined) {
      return;
    }
    var now =  new Date();
    var day = now.getDay();
    var date = now.getDate();
    console.log("now " + now  +
                " day " + day + " date " + date);
    for (var j = 0; j < calendar.length; j++) {
      var ol = document.createElement("ol");
      try {

        for (var i = 0; i < 7; i++) {
          var li = document.createElement("li");
          li.id = "" + i + "/" + "" + j;

          var span = document.createElement("span");

          var newDate = ((date + i - day) + (7*j) );
          now.setDate(newDate);
          if (i < day) {
            span.textContent = now.getDate();
          } else {
            span.textContent = now.getDate();
          }
          span.className ="day";
          span.id = "" + i + "/" + "" + j;
         
          var pHour = document.createElement("span");
          pHour.id = "" + i + "/" + "" + j;
          pHour.className ="hour";

          var session = prog.getSession(j, i);
          if (session != -1 && session !== 0) {
            li.style.color = "red";
            li.className = "daySelected";
            var h = prog.getHour(j, i);

            li.value = session;
            pHour.innerHTML = h.getDisplay();
            pHour.value = session;
            span.value = session;
          } else {
            pHour.innerHTML ="&nbsp;";
          }

          li.appendChild(span);
          li.appendChild(pHour);
    
          ol.appendChild(li);
          ol.addEventListener("click", clickOnProgramSession);
        }
      } catch(e) {
        console.log(e);
      }
      
      ol.className = "day";
      document.querySelector('#weeks').appendChild(ol);
    }
  } catch(e) {
    console.log(e);
  } 
}

/**
 * Delete the current Program.
 */
function deleteProgram() {
  if (window.confirm(navigator.mozL10n.get("confirmDeleteProgram"))) {
    try {
      var idUpd = document.getElementById('idProgram');

      var id = parseInt(idUpd.value);
    
      //dbDeleteProgram(id) ;

      var transaction = db.transaction(["programs"],"readwrite");

      transaction.oncomplete = function(event) {
        console.log("delete program:transaction complete");
      };
      
      transaction.onerror = function(event) {
        console.log(event);
      };
      
      var store = transaction.objectStore("programs");
      console.log(id);
      var request = store.delete(id);

      request.onsuccess = function(event) {
        console.log("Delete program succes");
        document.querySelector('#pnl-programs').className = 'current';
        document.querySelector('#updProgram').className = 'right';
      
        displayListPrograms();
      };

      request.onerror = function(event) {
        console.log("Delete program error" + event);
      } 
    } catch(e) {
      console.log(e);
    }
  }
}

/**
 * Remove the session for the program
 */
function removeProgSession() {
  if (window.confirm(navigator.mozL10n.get("confirmRemoveSession"))) {
    try {
      currentProg.removeSession();

      // Reload the current program.
      displayProgram(currentProg);
      
      document.querySelector('#listSessions').className = 'right';
      document.querySelector('#updProgram').className = 'current';
    } catch(e) {
      console.log(e);
    }
  }
}
