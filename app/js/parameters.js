/**
 * Class Parameters
 */

function Parameters() {
  this.flagSound = true;

  // Pass to the next Exercise, but not start.
  this.nextExercise = true;

  this.calendarNbDays = 1;
}

Parameters.prototype.setSound = function(bSound) {
  this.flagSound = bSound;
}

Parameters.prototype.isSound = function(bSound) {
  return this.flagSound;
}

Parameters.prototype.setNextExercise = function(bNextExercise) {
  this.nextExercise = bNextExercise;
}

Parameters.prototype.isNextExercise = function() {
  return this.nextExercise;
}

Parameters.prototype.getCalendarNbDays = function() {
  return this.calendarNbDays;
}

Parameters.prototype.setCalendarNbDays = function(nbDays) {
  return this.calendarNbDays = nbDays;
}

/**
 * Activate the sound.
 */
function checkSoundHandler(event) {
  parameters.setSound(event.originalTarget.checked);
  saveParameters(1, parameters.isSound());
}

/**
 * Check the next exercice.
 */
function checkNextExercice(event) {
  parameters.setNextExercise(event.originalTarget.checked);
  saveParameters(2, parameters.isNextExercise());
}


/**
 * Update the number of days for the calendar
 * 
 */
function updateCalendarNbDays(value) {
  try {
    parameters.setCalendarNbDays(value);
    saveParameters(3, parameters.getCalendarNbDays());
  } catch(e) {
    console.log(e);
  }
}

/**
 * Adding parameters.
 */
function addParameters(value) {
  try {
    var transaction = db.transaction(["parameters"],"readwrite");
    var store = transaction.objectStore("parameters");
    
    //Define a new parameters Record
    var parametersRecord = {
      value: value,
      created:new Date()
    }
    
    var request = store.add(parametersRecord);
    
    request.onerror = function(e) {
      console.log("Error parametersRecord", e.target.error.name);
    }
 
    request.onsuccess = function(event) {
      console.log("parameters add");
    }
  } catch(e) {
    console.log(e);
  }
}

/**
 * Update parameter.
 */
function saveParameters(id, value) {
  try {
    var transaction = db.transaction(["parameters"],"readwrite");
    var store = transaction.objectStore("parameters");
    console.log("saveParameters id " + id + " value " + value);
    //Define a new parameters Record
    var parametersRecord = {
      id: id, 
      value: value,
      created:new Date()
    }
    
    var request = store.put(parametersRecord);
    
    request.onerror = function(e) {
      console.log("Error parametersRecord", e.target.error.name);
    }
 
    request.onsuccess = function(event) {
      console.log("parameters update");
    }
  } catch(e) {
    console.log(e);
  }
}

/**
 * Load the parameters.
 */
function loadParameters() {
  try {
    var cpt = 0;
    var objectStore = db.transaction(["parameters"],"readwrite").objectStore("parameters");
    
    objectStore.openCursor().onsuccess = function(event) {
      try {
        var cursor = event.target.result;
        if (cursor) {
          if (cursor.value.id == 1) {
            cpt += 1;
            parameters.setSound (cursor.value.value);
            var chk = document.getElementById("chk-sound");
            chk.checked = parameters.isSound();
          }
          
          if (cursor.value.id == 2) {
            cpt += 2;
            parameters.setNextExercise (cursor.value.value);
            var chk = document.getElementById("chk-next-exercice");
            chk.checked = parameters.isNextExercise();
          }
          if (cursor.value.id == 3) {
            cpt += 3;
            parameters.setCalendarNbDays (cursor.value.value);
            var nbDays = document.getElementById("nbDayCalendar");
            nbDays.value = parameters.getCalendarNbDays();
          }

          cursor.continue();
        } else {
          if (cpt == 0) {
            // Initialize parameters.
            addParameters(true);
            addParameters(true);
            addParameters(1);
          }
        } 
      } catch(e) {
        console.log(e);
      }
    }
    
  } catch(e) {
    console.log(e);
  }
}