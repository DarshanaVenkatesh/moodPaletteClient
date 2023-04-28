import axios from "axios";

//All the variables for lockout functionality
var lastLockout = 0;
var lockedAt = null;
var isLockedOut = false;

export const loginCall = async (userCredential, dispatch, totalLogins) => {
  console.log("entered the login_start")

  // a bunch of console logs for debugging purposes
  console.log("totalLogins", totalLogins);
  console.log("lastLockout", lastLockout);
  console.log("lockedAt", lockedAt);
  console.log("isLockedOut", isLockedOut);

  if (isLockedOut) { // currently in a lockout period
    var now = new Date(); 
    if ((now - lockedAt) > 30000) { // check if lockout period is over (for debugging purposes, the period is 30 sec, which is 30000 ms)
      lockedAt = null;
      isLockedOut = false;
      console.log("Lockout is over!");
    }
    else {
      console.log("In lockout period, can't login yet");

      // notify user of time left in lockout
      var timeLeft = 30000 - (now - lockedAt);
      var min = Math.floor(timeLeft / 60000);
      var sec = parseInt(((timeLeft % 60000) / 1000).toFixed(0));
      console.log("min: ", min, ", sec: ", sec);
      if (min === 0 && sec === 1) {
        return `You are still locked out and cannot try logging in for another ${sec} second.`;
      }
      else if (min === 0) {
        return `You are still locked out and cannot try logging in for another ${sec} seconds.`;
      }
      else if (sec === 1) {
        return `You are still locked out and cannot try logging in for another ${min} minute and ${sec} second.`;
      }
      else {
        return `You are still locked out and cannot try logging in for another ${min} minute and ${sec} seconds.`;
      }
    }
  }

  if (!isLockedOut) { // try to login ONLY IF the user is not currently in a lockout period
    dispatch({ type: "LOGIN_START" }); 
    try {
      const res = await axios.post("/auth/login", userCredential);  // call login api call
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data }); // if valid user, return user object
      lastLockout = 0;
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err }); // if not valid, return error
      document.getElementById("overallError").innerHTML = 
      "Invalid credentials!";
      console.log("Invalid credentials!")
    }
  }

  if ((totalLogins - lastLockout) === 3) { // if there's been 3 successive logins that failed
    lastLockout = totalLogins; // update relative counter in preparation for the next potential lockout
    lockedAt = new Date(); // keep track of when lockout period started
    isLockedOut = true;
    console.log("Lockout period has started at", lockedAt);
    return "You have been locked out for having 3 unsuccessful login attempts. You must wait for 30 seconds before trying to login again."
  }

  return "";
};