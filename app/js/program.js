/**
 * Class Program.
*/

function Program() {
  this.name;
  this.idProgram;
  this.description;

  /**
   * List of sessions for the program.
   */
  this.sessions = [];
}

Program.prototype.setName = function(name) {
  this.name = name;
};

Program.prototype.getName = function() {
  return this.name;
};

Program.prototype.setDescription = function(description) {
  this.description = description;
};

Program.prototype.getDescription = function() {
  return this.description;
};

Program.prototype.setIdProgram = function(idProgram) {
  this.idProgram = idProgram;
};

Program.prototype.getIdProgram = function() {
  return this.idProgram;
};
