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

var curSession = new Session();
var chronos = new Chronos();

// Parameters
var parameters = new Parameters();
 
// The current program to display.

var isProgramDisplay = false;

// List Exercises.
var listItemEx = document.getElementById('list-items-ex');

// List Session 
var listItemSes = document.getElementById('list-items-ses');

// List Session for program
var listSlctSes = document.getElementById('list-select-session');

// List Calendar
var listCalendar = document.getElementById('list-calendar');

// List All images.
var listImages = document.getElementById('list-images');


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

  updateCalendarNbDays(parseInt(document.querySelector('#nbDayCalendar').value));
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

/**
 * Launch SportsTimer.
 */
function launchSelf(data) {
  try {
    var request = window.navigator.mozApps.getSelf();
    request.onsuccess = function() {
      if (request.result) {
        request.result.launch();
        displaySession(data.idSession, data.idCalendar);
      }
    };
  } catch(e) {
    console.log(e);
  }
}

/**
 * Launch the application and display the session.
 */
if (navigator.mozSetMessageHandler) {
  
  navigator.mozSetMessageHandler("alarm", function (alarm) {
    // only launch a notification if the Alarm is of the right type for this app 
    console.log(alarm);
    if(alarm.data.sessionName) {
      launchSelf(alarm.data);
      // Create a notification when the alarm is due
      try {
        notifyMe(alarm.data.sessionName);
        // Display the session.
       
      } catch(e) {
        console.log(e);
      }
    }
  });
}

/**
 * Notify
 */
function notifyMe(msg) {

  if (!("Notification" in window)) {
    window.alert("Ce navigateur ne supporte pas les notifications desktop");
  }
  // Voyons si l'utilisateur est OK pour recevoir des notifications
  else if (Notification.permission === "granted") {
    // Ok create a Notification.
    var notification = new Notification("SportsTimer:" + msg);
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
        var notification = new Notification("SportsTimer:" + msg);
      }
    });
  }
}

// This should open the application when the user touches the notification
// but it only works on later FxOS versions, e.g. 2.0/2.1
if (navigator.mozSetMessageHandler) {
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
}

/**
 * List all the alarms for SportsTimer.
 */
// document.querySelector('#btn-list-alarm').addEventListener('click', function () {
//   var allAlarmsRequest = navigator.mozAlarms.getAll();
//   allAlarmsRequest.onsuccess = function() {
    
//     this.result.forEach(function (alarm) {
//       console.log( alarm);
//     });
//   };
// });


/**
 * Remove all the alarms for SportsTimer.
 */
// document.querySelector('#btn-remove-Allalarm').addEventListener('click', function () {
//   var request = navigator.mozAlarms.getAll();

//   request.onsuccess = function () {
//     // Remove all pending alarms
//     this.result.forEach(function (alarm) {
//       navigator.mozAlarms.remove(alarm.id);
//     });
//   };

//   request.onerror = function () {
//     console.log('operation failed: ' + this.error);
//   };
  
// });

// document.querySelector('#btn-start-prog').addEventListener('click', function () {
//   updateProgram( startProgram, true);
// });

function delAlarm(doe) {
  console.log("delAlarm" + doe.idCalendar);
  var allAlarmsRequest = navigator.mozAlarms.getAll();
  allAlarmsRequest.onsuccess = function() {

    this.result.forEach(function (alarm) {
      console.log("Alarm remove alarm.data.idCalendar :" +
                  alarm.data.idCalendar +
                  "doe.idCalendar" +  doe.idCalendar);
      if (alarm.data.idCalendar == doe.idCalendar) {
        console.log("Alarm remove :" + doe.idCalendar);
        navigator.mozAlarms.remove(alarm.id);
      }
     });
   };
}

/**
 * Send the alarm.
 * @param date The DayOfExercice.
 */
function sendAlarm(doe, sessionName) {
  try {
    
    console.log("sendAlarm Date " + doe.day +
                " sessionName " + sessionName +
                " idSession " + doe.idSession +
               " idCalendar " + doe.idCalendar);
    var data = {
      idCalendar: doe.idCalendar,
      sessionName: sessionName,
      idSession: doe.idSession
    };
    console.log(data);
    var alarmRequest = navigator.mozAlarms.add(doe.day, "ignoreTimezone", data);
    
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
document.querySelector('#btn-previous-ex').addEventListener('click', btnPreviousEx);
document.querySelector('#btn-next-ex').addEventListener('click', btnNextEx);
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
document.querySelector('#btn-go-upd-session').addEventListener('click', displayUpdateSession);

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

///////////////////////////////////////////////////////////////////
// Main panel
///////////////////////////////////////////////////////////////////

// Choose sessions
document.querySelector('#btn-choose-sessions').addEventListener('click', function () {
  isProgramDisplay = false;
  document.querySelector('#sessions').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';
});

// Choose calendar
document.querySelector('#btn-choose-calendar').addEventListener('click', function () {
  isProgramDisplay = true;

  getSessions(displayCalendar);

 
  document.querySelector('#pnl-calendar').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';
});

document.querySelector('#btn-choose-history').addEventListener('click', function () {

  displayHistory();

  document.querySelector('#pnl-history').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';
});


///////////////////////////////////////////////////////////////////
// Panel: sessions.
///////////////////////////////////////////////////////////////////

// Return to the main panel
document.querySelector('#btn-go-main-back').addEventListener('click', function () {
   document.querySelector('#sessions').className = 'left';
   document.querySelector('[data-position="current"]').className = 'current';
});

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

///////////////////////////////////////////////////////////////////
// Panel: pnl-calendar.
///////////////////////////////////////////////////////////////////

document.querySelector('#btn-go-main-calendar-back').addEventListener('click', function () {
  document.querySelector('#pnl-calendar').className = 'left';
  document.querySelector('[data-position="current"]').className = 'current';
});

///////////////////////////////////////////////////////////////////
// Panel: pnl-calendar
///////////////////////////////////////////////////////////////////

function returnToCalendar() {

  document.querySelector('#pnl-day').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';
}

// Add a new day of exercices.
document.querySelector('#btn-go-add-day').addEventListener('click', function () {

  document.querySelector('#pnl-day').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';

  var doe = new DayOfExercice();
  doe.idSession = -1;

  initPnlDay(doe);
});

/**
 * Select a day in the calendar.
 */
listCalendar.onclick = function(e) {

  document.querySelector('#pnl-day').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';

  document.getElementById('btn-add-sesEx').disabled = false;
  document.getElementById('btn-del-ses').className = "danger";
  
  var collEnfants = e.target.parentNode.childNodes;
  var i = 0;
  for (i = 0; i < collEnfants.length; i++)  {
    console.log(collEnfants[i].tagName);
    if (collEnfants[i].tagName === 'P') {
      try {
        var id = parseInt(e.target.parentNode.id);
        console.log(id);

        dbLoadCalendar(id, initPnlDay);

        // initPnlDay(id);
        break;
      } catch (ex) {
        console.log(ex);
      }
    }
  }
};

// Panel: pnl-history
document.querySelector('#btn-go-main-history-back').addEventListener('click', function () {
  document.querySelector('#pnl-history').className = 'left';
  document.querySelector('[data-position="current"]').className = 'current';
});


///////////////////////////////////////////////////////////////////
// Panel: pnl-day.
///////////////////////////////////////////////////////////////////

document.querySelector('#btn-go-day-back').addEventListener('click', function () {
  document.querySelector('#pnl-day').className = 'left';
  document.querySelector('[data-position="current"]').className = 'current';
 
});

document.querySelector('#btn-execute-session').addEventListener('click', function () {
   var allAlarmsRequest = navigator.mozAlarms.getAll();
   allAlarmsRequest.onsuccess = function() {
  
     this.result.forEach(function (alarm) {
       console.log( alarm);
       console.log("" + alarm.date);
     });
   };

  try {
    document.querySelector('#pnl-calendar').className = 'current';
    document.querySelector('#pnl-day').className = 'left';

    var session = document.getElementById('list-select-session');
    console.log(session);
    var idSession = parseInt(session.options[session.selectedIndex].value);

    var startTime = document.getElementById('startTime');
    var startDay = document.getElementById('startDay');

    var idCalendar = document.getElementById('idCalendar');

    var valueAsNumber = startTime.valueAsNumber;
    var h = new Date(valueAsNumber);
     
    var day = startDay.valueAsNumber;
    var d = new Date(day);
    d.setHours(h.getUTCHours());
    d.setMinutes(h.getUTCMinutes());

    var doe = new DayOfExercice();
    doe.day = d;
    doe.idSession = idSession;
    doe.idCalendar = parseInt(idCalendar.value);
    doe.executed = true;

    dbStoreCalendar(doe, function () {
      displaySession(idSession, 0);
      // getSessions(displayCalendar);
    });
  } catch (ex) {
    console.log(ex);
  }

});

// Update a day for the calendar.
document.querySelector('#btn-go-upd-day').addEventListener('click', function () {

  try {

    var session = document.getElementById('list-select-session');

    if (session.selectedIndex == -1) {
      window.alert(navigator.mozL10n.get("idAlertNoSession"));
      return;
    }
    
    var idSession = parseInt(session.options[session.selectedIndex].value);

    var startTime = document.getElementById('startTime');
    var startDay = document.getElementById('startDay');

    if (startTime.value == "") {
      window.alert(navigator.mozL10n.get("idAlertNoTime"));
      return;
    }

    if (startDay.value == "") {
      window.alert(navigator.mozL10n.get("idAlertNoDay"));
      return;
    }

    document.querySelector('#pnl-calendar').className = 'current';
    document.querySelector('#pnl-day').className = 'left';

    var idCalendar = document.getElementById('idCalendar');

    var valueAsNumber = startTime.valueAsNumber;
    var h = new Date(valueAsNumber);
     
    var day = startDay.valueAsNumber;
    var d = new Date(day);
    d.setHours(h.getUTCHours());
    d.setMinutes(h.getUTCMinutes());

    var doe = new DayOfExercice();
    doe.day = d;
    doe.idSession = idSession;
    doe.idCalendar = parseInt(idCalendar.value);

    if (doe.idCalendar != -1) {
      // Suppress the old alarm.
      delAlarm(doe);
    }
   
    dbStoreCalendar(doe, function () {
      console.log("doe.idCalendar:" + doe.idCalendar);
      sendAlarm(doe, session.options[session.selectedIndex].innerHTML);   
      getSessions(displayCalendar);
    });
  } catch (ex) {
    console.log(ex);
  }
 
});



// Remove the current day in the calendar.
document.querySelector('#btn-remove-day').addEventListener('click', removeDay);

// Update an exercise and back to the list of programs
// document.querySelector('#btn-upd-program').addEventListener('click', function () {
//  // Update the program, return to the list of programs.
//   updateProgram( function() {
//     document.querySelector('#pnl-calendar').className = 'current';
//     document.querySelector('#updProgram').className = 'right';

//     displayCalendar();
//   }, false);
  
// });




/**
 * Load the list of Images.
 */
function initListImages() {
  // List of all images.
  var listImages = [
        ["gym-null.png",""],
        ["gym-ab-bikes.png", "ab-bikes"],
        ["gym-crunch-abdos.png", "crunch-abdos"],
        ["gym-flexion.png", "flexion"],
        ["gym-planche.png", "gym-planche"],
        ["gym-push-up.png", "push-up"],
        ["gym-squat.png", "squat"],
        ["gym-jump-squat.png", "jump-squat"],
        ["gym-allonge.png", "allonge"],
        ["gym-desk.png", "desk"],
        ["gym-side-plank.png", "side-plank"],
        ["gym-standing-butterfly.png", "standing-butterfly"],
        ["gym-arm.png", "arm"],
        ["gym-curl.png", "curl"],
        ["gym-shoulder.png", "shoulder"],
        ["gym-thigh.png", "thigh"],
        ["gym-donkey-side-kick.png", "donkey-side-kick"],
        ["gym-donkey-kick.png", "donkey-kick"],
        ["gym-single-leg-hip-raise.png", "single-leg-hip-raise"],
        ["gym-bridge.png", "bridge"],
        ["gym-mountain.png", "mountain"],
        ["gym-situps.png", "situps"],
        ["gym-leg-raises.png", "leg-raises"],
        ["gym-flutter-kicks.png", "flutter-kicks"],
        ["gym-air-bike-crunches.png", "air-bike-crunches"], 
        ["gym-wall-push-ups.png", "wall-push-ups"],
        ["gym-ball.png", "ball"],
        ["gym-push-up-ball.png", "push up with ball"]
];
  
  for (var i = 0; i < listImages.length; i++) {
    addImage("images/" + listImages[i][0], listImages[i][1]);
  }

}

function addImage(path, text) {
  var li = document.createElement("li");
  var aside = document.createElement("aside");
  aside.className = "pack-end";
  var image = document.createElement("img");
  image.src = path;
  image.id = path;

  var pInfo = document.createElement("p");
  pInfo.innerHTML = text;

  aside.appendChild(image);
  aside.appendChild(pInfo);

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
        var id = parseInt(e.target.parentNode.id);
        displaySession(id, 0);
        break;
      } catch (ex) {
        console.log(ex);
      }
    }
  }
};

/**
 * Display the session
 * @param id id of the session.
 */
function displaySession(id, idCalendar) {
  document.querySelector('#currentSession').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';
       
  var idSession = document.getElementById('idSession');
  idSession.value = id;
  
  curSession.setIdSession(id);
  curSession.setIdCalendar(idCalendar);
  
  var title = document.getElementById('idTitleSession');
  
  listSessionEx(id);
  
  var transaction = db.transaction(["sessions"]);
  var objectStore = transaction.objectStore("sessions", 'readonly');
  var request = objectStore.get(id);
  
  request.onerror = function(event) {
    console.log("Not found for Id: " + id);
  };
  
  request.onsuccess = function(evt) {
    try {
      curSession.setName(request.result.name);
      title.innerHTML = request.result.name;
      if (request.result.hasOwnProperty("chainExercises")) {
        curSession.setChainExercises( request.result.chainExercises);
      } else {
        curSession.setChainExercises(false);
      }
      curSession.setdelayBetweenExercises(parseInt(request.result.delayBetweenExercises));
    } catch (e) {
      console.log(e);
    }
  };
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
function displayUpdateSession() {
  try {
    document.querySelector('#currentSession').className = 'left';
    document.querySelector('#updSession').className = 'current';
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


function btnPreviousEx() {

  if (flagStart && !window.confirm(navigator.mozL10n.get("confirmPreviousExercice"))) {
    return;
  }
  previousEx();
}

function btnNextEx() {
  if (flagStart && !window.confirm(navigator.mozL10n.get("confirmNextExercice"))) {
    return;
  }
  nextEx();
}

function previousEx() {

  var ok = curSession.setNumExercise(curSession.getNumExercise() - 1);
  displayCurrentExercise();
  return ok;
}


function nextEx() {
  var ret = curSession.setNumExercise(curSession.getNumExercise() + 1);
  displayCurrentExercise();
  return ret;
}

function hasNextEx() {
  return curSession.hasNextExercise();
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
  curSession.pauseSes();
}

function startEx() {

  if (!flagStart) {
    // Start a new Session
    durationCounter =  0;
    breakTimeCounter = 0;
    nbRetryCounter = 1;
    durationBetweenExercise = 0;
    nbRetryDisplay.textContent = nbRetryCounter + "/" + curExercise.getNbRetry();
    typeCounter = STATE_EX_EFFORT;

    curExercise = curSession.getCurrentExercise();

    var effortDiv = document.getElementById('effortDiv');
    effortDiv.style.color = EFFORT_COLOR;
        
    chronos.start();
    flagStart = true;
    curSession.startSes();
    try {
      var exercise = new Exercise(name, curExercise.getDuration(), curExercise.getBreakTime(), curExercise.getNbRetry());
      curSession.startExercise(exercise);
      if (curSession.getIdCalendar() != 0) {
        dbExecuteCalendar(curSession.getIdCalendar());
      }
    } catch(e) {
      console.log(e);
    }
  } else {
    if (typeCounter == STATE_EX_PAUSE) {
      // State Pause restart the session.
      curSession.continue();
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
          curSession.stopExercise();
          endExercise();
          chronos.stop();
          curSession.stopSes();
          playSound('finalSound');
          break;
        }
        
        if (!curSession.isChainExercises()) {
          typeCounter = STATE_EX_EFFORT;
          curSession.stopExercise();
          endExercise();
          chronos.stop();
          break;
        }
      }
    } else {
      curSession.stopExercise();
      endExercise();
      chronos.stop();
      break;
    }

    if (durationBetweenExercise === 0) {
      // Sound begin chain exercice.
      playSound('beginChangeSound');
    }
    if ( durationBetweenExercise <= curSession.getdelayBetweenExercises()) {
      displaySecond(chronoDisplay, curSession.getdelayBetweenExercises() - durationBetweenExercise, BETWEEN_COLOR);
      durationBetweenExercise++;
    } else {
      if (durationBetweenExercise >= curSession.getdelayBetweenExercises()) {
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
  curSession.endOfSession();
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
    curSession.cancelSes();
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
  
  curSession.initListExercises();

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
        curSession.addListExercises(exercise);
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
    curExercise = curSession.getCurrentExercise();
    if (curExercise !== null) {
      durationCounter = 0;
      var nameExercise = document.getElementById("idNameExercise");
      var image = document.getElementById("idImageExercise");
      var infoExercise = document.getElementById("idInfoExercise");

      var idCurExercise = document.getElementById("idCurExercise");

      idCurExercise.textContent = ""
                                + (curSession.getNumExercise() + 1)
                                +"/" + curSession.getNbExercises();

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
 * Display the list of Sessions.
*/
function getSessions(callback) {
  console.log("getSessions");   
  var objectStore = db.transaction("sessions").objectStore("sessions");
  var sessions = [];

  objectStore.openCursor().onsuccess = function(event) {
    try {
      var cursor = event.target.result;
      if (cursor) {
        var sessionData = new SessionData();
        sessionData.idSession = cursor.value.idSession; 
        sessionData.name = cursor.value.name;
        sessions.push(sessionData);
        cursor.continue();
      }
      else {
        callback(sessions);
      }
    } catch(e) {
      console.log(e);
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
function addSessionToList(list, cursor, id) {

  var opt = document.createElement("option");
  opt.value = cursor.value.idSession;

  if (cursor.value.idSession === id) {
    opt.selected = true;
  }
  opt.innerHTML = cursor.value.name;
  
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
* Calendar
* ==================================================== */
/**
 * Display the calendar.
*/
function displayCalendar(listSessions) {
  console.log("displayCalendar");
  try {
    var listCalendar = document.getElementById("list-calendar");
    removeAllItems(listCalendar);
    var objectStore = db.transaction("calendar").objectStore("calendar");

    var index = objectStore.index("dateSession");
    var date = new Date();

    date.setDate(date.getDate() - parameters.getCalendarNbDays());
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    var range = IDBKeyRange.lowerBound(date);
    
    index.openCursor(range).onsuccess = function(event) {
      try {
        var cursor = event.target.result;
        if (cursor) {
          displayDay(listCalendar, cursor, listSessions);
          cursor.continue();
        }
        else {
          // alert("No more entries!");
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
 * Display a day.
*/ 
function displayDay(list, cursor, listSessions) {
  var date = new Date();
  var li = document.createElement("li");

  var state = StateEnum.PAST;
  var arrow = "";
  var a = document.createElement("a");
  a.setAttribute("id", cursor.value.idCalendar);
  a.href = "#";

  //console.log("Date " + cursor.value.dSession +
  //             " executed: "+ cursor.value.executed)

  var p0 = document.createElement("p");
  var p1 = document.createElement("p");

  if (cursor.value.executed) {
    state = StateEnum.EXECUTED;
    arrow =  "&#10003 ";
  } else if (cursor.value.dSession.getDate() == date.getDate() &&
             cursor.value.dSession.getMonth() == date.getMonth() ) {
    state = StateEnum.CURRENT;
    arrow = "&#8594; ";
  } else if (cursor.value.dSession.getTime() < date.getTime()) {
    if (cursor.value.executed) {
      arrow =  "&#10003 ";
      state = StateEnum.EXECUTED;
    } else {
      arrow =  "&#8593";
      state = StateEnum.LATE;
    }
  } else {
    arrow =  "&#8595 ";
    state = StateEnum.FUTURE;
  }

  for (var i = 0; i < listSessions.length;i++) {
    if (cursor.value.idSession == listSessions[i].idSession) {
      p0.innerHTML = arrow + listSessions[i].name;
    }
  }
  a.appendChild(p0);

  if (state === StateEnum.EXECUTED) {
    li.className = "executedDay";
  } else if (state === StateEnum.PAST) {
    li.className = "pastDay";
  } else if (state === StateEnum.LATE) {
    li.className = "notExecutedDay";
  } else if (state === StateEnum.CURRENT) {
    li.className = "currentDay";
  } else if (state === StateEnum.FUTURE) {
    li.className = "nextDay";
  }
  
  p1.innerHTML = cursor.value.dSession.toLocaleDateString() +
            " " + cursor.value.dSession.toLocaleTimeString();
  a.appendChild(p1);

  li.appendChild(a);
  list.appendChild(li);
}

/**
 * Remove a day in the calendar.
 */
function removeDay() {
  if (window.confirm(navigator.mozL10n.get("confirmRemoveDay"))) {
    try {
      var idCalendar = document.getElementById('idCalendar');
      console.log("idCalendar:" + idCalendar);
      dbDeleteCalendar(parseInt(idCalendar.value));
      getSessions(displayCalendar);
      var doe = new DayOfExercice();
      doe.idCalendar = parseInt(idCalendar.value);
      delAlarm(doe);
      
      document.querySelector('#pnl-day').className = 'right';
      document.querySelector('#pnl-calendar').className = 'current';
    } catch(e) {
      console.log(e);
    }
  }
}
/**
 * Initialize the list of sessions for a Day.
 */
function initPnlDay(dayOfExercice) {
  try {
    var listSes = document.getElementById("list-select-session");
    removeAllItems(listSes);

    if (dayOfExercice.day != null) {
      var startTime = document.getElementById('startTime');
      var start = Date.UTC(1970, 1, 1, dayOfExercice.day.getHours(),
                           dayOfExercice.day.getMinutes());
      startTime.valueAsNumber = start;
      
      var startDay = document.getElementById('startDay');
      startDay.valueAsNumber = dayOfExercice.day.getTime();

      var now = new Date();
      now.setHours(23);
      now.setMinutes(59);
      now.setSeconds(59);

      // You can run the session for the current day only.
      if (dayOfExercice.day.getTime() <= now.getTime() ) {
        document.getElementById('btn-execute-session').className = "recommend"
      } else {
        document.getElementById('btn-execute-session').className = "invisible";
      }
    } else {
      document.getElementById('btn-execute-session').className = "invisible";
    }
    
    if (dayOfExercice.executed) {
      document.getElementById('btn-execute-session').className = "invisible";
    }
    
    var idCalendar = document.getElementById('idCalendar');
    idCalendar.value = dayOfExercice.idCalendar;
    console.log(dayOfExercice);

    // Load the list of sessions.
    var objectStore = db.transaction("sessions").objectStore("sessions");
    objectStore.openCursor().onsuccess = function(event) {

      try {
        var cursor = event.target.result;
        if (cursor) {
          addSessionToList(listSes, cursor, dayOfExercice.idSession);
          cursor.continue();
        } else {
          // returnToCalendar();
        }
      } catch(e) {
        console.log(e);
      }
    };
  } catch(e) {
    console.log(e);
  }
}


//////////////////////////////////
//  History
//////////////////////////////////

/**
 * Display the History.
*/
function displayHistory(listSessions) {
 
  try {
    var listHistory = document.getElementById("list-history");
    removeAllItems(listHistory);
    var objectStore = db.transaction("history").objectStore("history");

    var index = objectStore.index("dateHistory");
    var date = new Date();

    date.setDate(date.getDate() - parameters.getCalendarNbDays());
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    var range = IDBKeyRange.lowerBound(date);
    
    index.openCursor(range).onsuccess = function(event) {
      try {
        var cursor = event.target.result;
        if (cursor) {
          displayHistorySession(listHistory, cursor);
          cursor.continue();
        }
        else {
          // alert("No more entries!");
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
 * Display a session of the History.
*/ 
function displayHistorySession(list, cursor) {
  var date = new Date();
  var li = document.createElement("li");

  var a = document.createElement("a");
  a.setAttribute("id", cursor.value.idHistory);
  a.href = "#";

  // console.log("Date " + cursor.value.beginSession);
  // console.log(cursor.value);

  var p0 = document.createElement("p");
  var p1 = document.createElement("p");

  p0.innerHTML =  cursor.value.nameSession;
  a.appendChild(p0);

  p1.innerHTML = cursor.value.beginSession.toLocaleDateString() +
            " " + cursor.value.beginSession.toLocaleTimeString() +
            " (" +
            getStringTime(((cursor.value.endSession.getTime() - cursor.value.beginSession.getTime())/1000>>0)) + ")" ;
            //")" );
  a.appendChild(p1);

  li.appendChild(a);
  list.appendChild(li);
}
