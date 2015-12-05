/**
 * Class Program.
*/

function Week() {
  this.week = [0,0,0,0,0,0,0];
}

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

Program.prototype.addWeek = function () {
  this.sessions.push(new Week());
};

Program.prototype.getCalendar = function () {
  return this.sessions;
};

Program.prototype.setCalendar = function (calendar) {
  this.sessions = calendar;
};

Program.prototype.getSession = function(week, day) {
  if (week >= this.sessions.length || day > 7) {
    return -1;
  } 
  var w = this.sessions[week];
  return w.week[day];
}

/**
 * Affect the session for a day.
 *
 * @param week the week.
 * @param day the day in the week.
 * @param session id of the session.
 */
Program.prototype.setSession = function (week, day, session) {
  var w = this.sessions[week];
  w.week[day] = session;
};
