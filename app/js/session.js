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
}

/**
* Start a new Session.
* Change the text of the button
*/ 
Session.prototype.startSes = function() {
    this.beginSession = new Date();
    try {
        if (this.flagStartSes == false) {
            this.timerSession = window.setInterval(self.displaySession, 1000);
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

Session.prototype.displaySession = function() {
    self.addSessionSec();
    displaySecond(document.getElementById('chronoSession'), self.getSessionSec());
}
