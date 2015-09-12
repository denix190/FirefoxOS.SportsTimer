/**
 * Class Parameters
 */

function Parameters() {
  this.flagSound = true;
  this.nextExercice = true;
}

Parameters.prototype.setSound = function(bSound) {
  this.flagSound = bSound;
}

Parameters.prototype.isSound = function(bSound) {
  return this.flagSound;
}

Parameters.prototype.setNextExercice = function(bNextExercice) {
  this.nextExercice = bNextExercice;
}

Parameters.prototype.isNextExercice = function() {
  return this.nextExercice;
}