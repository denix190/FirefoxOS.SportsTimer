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
  this.self = this;
  this.exercises = new Array();

}

/**
* Start a new Session.
* Change the text of the button
*/ 
Session.prototype.startSes = function() {
  
  console.log(this.beginSession);
  try {
    if (this.flagStartSes == false) {
      this.beginSession = new Date();
      this.timerSession = window.setInterval(this.displaySessionx.bind(this), 1000);
      this.flagStartSes = true;
    }
  } catch(e) {
    console.log(e);
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

Session.prototype.displaySessionx = function() {
  try {
    this.sessionSec++;
    displaySecond(document.getElementById('chronoSession'), this.sessionSec);
  } catch(e) {
      console.log(e);
  }
}

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
}

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
}

function Exercise(name, duration, breakTime, nbRetry) {
  try {
    this.name = name;
    this.duration = duration;
    this.breakTime = breakTime;
    this.nbRetry = nbRetry;
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
}
