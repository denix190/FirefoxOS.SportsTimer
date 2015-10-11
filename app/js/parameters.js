/**
 * Class Parameters
 */

function Parameters() {
  this.flagSound = true;

  // Pass to the next Exercise, but not start.
  this.nextExercise = true;
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
          cursor.continue();
        } else {
          if (cpt == 0) {
            // Initialize parameters.
            addParameters(true);
            addParameters(true);
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