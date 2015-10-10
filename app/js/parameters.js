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