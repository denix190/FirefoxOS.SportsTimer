/**
 * Class Session.
*/ 

function Session() {
  this.flagStartSes = false;
  this.timerSession;
  this.chronoSession = document.getElementById('chronoSession');
  this.sessionSec = 0;
  this.beginSession;
  this.endSession;
  this.chainExercises = false;
  this.delayBetweenExercises = 0;
  this.idSession;

  /* List of exercises for the current session. */
  this.listExercises;
  this.numExercise = 0;
  
  this.exercises = new Array();
}

Session.prototype.setIdSession = function(id) {
  this.idSession = id;
};

Session.prototype.setChainExercises = function(bchainExercises) {
  this.chainExercises = bchainExercises;
};

Session.prototype.isChainExercises = function() {
  return this.chainExercises;
};

Session.prototype.setdelayBetweenExercises = function(delay) {
  this.delayBetweenExercises = delay;
};

Session.prototype.getdelayBetweenExercises = function() {
  return this.delayBetweenExercises;
};

Session.prototype.getNumExercise = function () {
  return this.numExercise;
};

Session.prototype.setNumExercise = function (numExercise) {
  if (numExercise >= 0 && numExercise < this.listExercises.length) {
    this.numExercise = numExercise;
    return true;
  }
  return false;
};

Session.prototype.getNextExercise = function (numExercise) {
  if ((this.numExercise + 1) < this.listExercises.length) {
    return this.numExercise + 1;
  }
  return this.numExercise;
};

Session.prototype.initListExercises = function () {
  this.numExercise = 0;
  this.listExercises = new Array();
};

Session.prototype.hasNextExercise = function () {
  if (this.numExercise == this.listExercises.length -1 ) {
    return false;
  }
  return true;
};

Session.prototype.addListExercises = function (exercises) {
  this.listExercises.push(exercises);
};

Session.prototype.getListExercises = function () {
  return this.listExercises;
};

Session.prototype.getCurrentExercise = function () {
  if (this.listExercises.length > 0 && this.numExercise < this.listExercises.length) {
    return this.listExercises[this.numExercise];
  }
  return null;
};

/**
* Start a new Session.
* Change the text of the button
*/ 
Session.prototype.startSes = function() {
  try {
    if (this.flagStartSes === false) {
      this.beginSession = new Date();
      
      //this.timerSession = window.setInterval(this.displaySessionx.bind(this), 1000);
      this.timerSession = window.setInterval(
        function() {
          try {
            session.addSessionSec();
            displaySecond(document.getElementById('chronoSession'), session.getSessionSec());
          } catch(e) {
            console.log(e);
          } }, 1000);

      this.flagStartSes = true;
    }
  } catch(e) {
    var lock = null;
    console.log(e);
  }
};

/**
* Pause Session.
*/ 
Session.prototype.pauseSes = function() {

  if (this.flagStartSes) {
    this.timerSession = window.clearInterval(this.timerSession);
    this.flagStartSes = false;
  }
};

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
};

Session.prototype.getSessionSec = function () {
  return this.sessionSec;
};

Session.prototype.addSessionSec = function () {
  this.sessionSec++;
};

Session.prototype.displaySessionx = function() {
  try {
    this.sessionSec++;
    displaySecond(document.getElementById('chronoSession'), this.sessionSec);
  } catch(e) {
      console.log(e);
  }
};

/**
* Start a new Exercise
*
*/ 
Session.prototype.startExercise = function(exercise) {
  try {
    this.exercises.push(exercise);
  } catch(e) {
    console.log(e);
  }
};


/**
* Stop/End of Exercise
* 
*/ 
Session.prototype.stopExercise = function() {
  try {
    var exercise = this.exercises[this.exercises.length - 1];
    exercise.stop();
  } catch(e) {
    console.log(e);
  }
};


/**
 * Exercise
 */
function Exercise(name, duration, breakTime, nbRetry) {
  try {
    this.name = name;
    this.duration = parseInt(duration);
    this.breakTime = parseInt(breakTime);
    this.nbRetry = parseInt(nbRetry);
    this.imagePath;
    this.beginExercise = new Date();
    this.endExercise;
  } catch(e) {
    console.log(e);
  }
}

Exercise.prototype.stop = function() {
  try {
    this.endExercise = new Date();
  } catch(e) {
    console.log(e);
  }
};

Exercise.prototype.setName = function(name) {
  this.name = name;
};

Exercise.prototype.getName = function() {
  return this.name;
};

Exercise.prototype.setDuration = function(duration) {
  this.duration = duration;
};

Exercise.prototype.getDuration = function() {
  return this.duration;
};

Exercise.prototype.setBreakTime = function(breakTime) {
  this.breakTime = breakTime;
};

Exercise.prototype.getBreakTime = function() {
  return this.breakTime;
};

Exercise.prototype.setNbRetry = function(nbRetry) {
  this.nbRetry = nbRetry;
};

Exercise.prototype.getNbRetry = function() {
  return this.nbRetry;
};

Exercise.prototype.setImagePath = function(path) {
  this.imagePath = path;
};

Exercise.prototype.getImagePath = function() {
  return this.imagePath;
};