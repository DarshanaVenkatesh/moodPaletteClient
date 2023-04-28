import React, { useState, useContext, useRef, useEffect } from "react";
import NavBar from "../navbar/index";
import { AuthContext } from "../../context/AuthContext";
import "./habittracker.css";
import "reactjs-popup/dist/index.css";
import axios, { all } from "axios";
import Popup from "reactjs-popup";

const HabitTracker = () => {
  const { user } = useContext(AuthContext);
  const [updatedUser, setUser] = useState({ user });

  const [open, setOpen] = useState(false);

  const [oldUpdatedHabit, setOldUpdatedHabit] = useState("");

  const [errorHandling, setErrorHandling] = useState("");


  const [popupHabit, setPopupHabit] = useState("")

  const [popupPriority, setPopupPriority] = useState("")
  
  const [popupFreq, setPopupFreq] = useState("")
  //SINCE WE HAVE LABELED PRIORITIES AS 1,2,3 --> HIGHER PRIORITIES should theoretically BE FIRST ON LIST
  const allHabits = user.userHabits.sort();

  const habit = useRef();
  const priority = useRef();
  const frequency = useRef();

  const habit1 = useRef();
  const priority1 = useRef();
  const frequency1 = useRef();

  const [helpText, setHelpText] = useState("?");

  const displayHelp = () => {
    setHelpText(
      "Welcome to your Habit Tracker! Enter different habits that you want to track! You can prioritize them and change their frequency to your liking!"
    );
  };

  const displayQuestion = () => {
    setHelpText("?");
  };

  const enterHabit = async (e) => {
    e.preventDefault(); // stops page from refreshing on button click
    console.log(habit.current.value);
    for (let i = 0; i < allHabits.length; i++) {
      if (allHabits[i].substring(4) === habit.current.value) {
        document.getElementById("HabitError").innerHTML =
          "You've already entered this habit!";
        console.log("habit already exists");
        return;
      }
    }

    if (allHabits.length >= 10) {
      setErrorHandling("You've reached the maximum number (10) of habits!");
      // document.getElementById("HabitError").innerHTML =
      // "You've reached the maximum number (10) of habits!";
      console.log("habit limit reached");
      return;
    }
    setErrorHandling("");
    const fullHabitString =
      priority.current.value + frequency.current.value + habit.current.value;
    console.log(fullHabitString);

    const addHabit = {
      username: user.username,
      habit: fullHabitString,
    };

    console.log(priority.current.value);

    await axios.post("/users/addHabit", addHabit); // call login api call, asccessing the req.body.habit in users.j

    const res = await axios.get(`/users/${user._id}`);

    console.log("res.data", res.data);
    //setUser(res.data);

    //localStorage.setItem("user", JSON.stringify(updatedUser.user))
    localStorage.setItem("user", JSON.stringify(res.data));

    window.location.reload(false);
    console.log("updated:", updatedUser);
  };

  const deleteHabit = async (e, habitD) => {
    e.preventDefault(); // stops page from refreshing on button click
    console.log("habit to be deleted:", habitD.habit);

    const deleteHabit = {
      username: user.username,
      habit: habitD.habit,
    };

    const deleteDayHabit = {
      username: user.username,
      habit: habitD.habit,
      date: new Date().toDateString(),
    };

    const test = await axios.post("/users/deleteHabit", deleteHabit);
    console.log("test", test);
    const test1 = await axios.post("/day/deleteHabit", deleteDayHabit);
    console.log("test1", test1); //deleting from days object

    const res = await axios.get(`/users/${user._id}`);

    //const res1 = await axios.get(`/day/${user._id}/${new Date().toDateString}`);

    console.log("res.data", res.data);
    //setUser(res.data);

    //localStorage.setItem("user", JSON.stringify(updatedUser.user))
    localStorage.setItem("user", JSON.stringify(res.data));

    window.location.reload(false);
    console.log("updated:", updatedUser);
  };

  const updateHabitPopup = async (e) => {
    e.preventDefault(); // stops page from refreshing on button click
    console.log("habit to be updated:", popupHabit);

    if (popupHabit !== oldUpdatedHabit.substring(4)) {
      for (let i = 0; i < allHabits.length; i++) {
        if (allHabits[i].substring(4) === popupHabit) {
          document.getElementById("HabitErrorPopup").innerHTML = "You've already entered this habit!";
          console.log("habit already exists");
          return;
        }
      }
    }

    const deleteHabit = {
      username: user.username,
      habit: oldUpdatedHabit,
    };
    console.log(deleteHabit)

    await axios.post("/users/deleteHabit", deleteHabit);

    
    const concatHabit = priority1.current.value + frequency1.current.value + popupHabit;
    console.log("concatHabit", concatHabit);

    const addHabit = {
      username: user.username,
      habit: concatHabit,
    };

    await axios.post("/users/addHabit", addHabit); // call login api call, asccessing the req.body.habit in users.

    const res = await axios.get(`/users/${user._id}`);
    console.log("res.data", res.data);
    localStorage.setItem("user", JSON.stringify(res.data));
    window.location.reload(false);
    console.log("updatedUser:", updatedUser);
  }

  const updateHabit = async (e, habitU) => {
    // e.preventDefault(); // stops page from refreshing on button click
    // console.log("habit to be updated:", habitU.habit);

    // const updateHabit = {
    //   username: user.username,
    //   oldHabit: habitU.habit,
    //   newHabit: "something",
    // };

    // console.log("updateHabit", updateHabit);
    // const test = await axios.put("/users/updateHabit", updateHabit);
    // console.log("test", test);

    // const res = await axios.get(`/users/${user._id}`);

    // console.log("res.data", res.data);
    // //setUser(res.data);

    // //localStorage.setItem("user", JSON.stringify(updatedUser.user))
    // localStorage.setItem("user", JSON.stringify(res.data));

    // window.location.reload(false);
    // console.log("updated:", updatedUser);
    setOpen(true);
    console.log(habitU);
    setOldUpdatedHabit(habitU.habit);

    //habitU is basically an object that contains the habit string
    //.habit is getting the habit for it

    setPopupHabit(habitU.habit.substring(4))
    setPopupPriority(habitU.habit.substring(0,1))
    setPopupFreq(habitU.habit.substring(1,4))


    // setUpdating(true)
    // console.log(isUpdating)
    console.log("im in update habit");
    // return (

    // );
  };

  // const sortHabits = () => {
  //   allHabits.sort();
  //   console.log(allHabits)
  // }

  return (
    <div>
      {<NavBar></NavBar>}
      <br></br>
      <h1 className="header1"> {user.username}'s Habits!!</h1>
      <div>
        {/* <button onClick={sortHabits}>hi</button> */}

        {allHabits?.map((habit, index) => (
          <div className="listingHabit">
            {habit.substring(0, 1) === "1" &&
              (habit.substring(1, 4) === "Day" ||
                habit.substring(1, 4) ===
                  new Date().toDateString().split(" ")[0]) && (
                <div>
                  <h3 style={{ color: "red" }}>
                    {/* {index + 1} . {habit.substring(4)} */}
                    {habit.substring(4)} 
                  </h3>
                  <button
                    className="deleteButton"
                    onClick={(e) => deleteHabit(e, { habit })}
                  >
                    Delete
                  </button>
                  <button
                    className="updateButton"
                    onClick={(e) => updateHabit(e, { habit })}
                  >
                    Update
                  </button>
                </div>
              )}
            {habit.substring(0, 1) === "2" &&
              (habit.substring(1, 4) === "Day" ||
                habit.substring(1, 4) ===
                  new Date().toDateString().split(" ")[0]) && (
                <div>
                  <h3 style={{ color: "#D29E1E" }}>
                    {/* {index + 1} . {habit.substring(4)} */}
                    {habit.substring(4)} 
                  </h3>
                  <button
                    className="deleteButton"
                    onClick={(e) => deleteHabit(e, { habit })}
                  >
                    Delete
                  </button>
                  <button
                    className="updateButton"
                    onClick={(e) => updateHabit(e, { habit })}
                  >
                    Update
                  </button>
                  <Popup
                    open={open}
                    closeOnDocumentClick
                    onClose={() => setOpen(false)}
                    contentStyle={{ border: `5px solid black` }}
                  >
                    <div className="popupFormatting">
                    <form className="updateHabit" onSubmit={updateHabitPopup}>
                      <input
                        value={popupHabit}
                        className="habitInput"
                        ref={habit1}
                        onChange={(e) => setPopupHabit(e.target.value)}
                      />
                      <div className="priorityLevelP">
                        <label for="priority">Choose a priority level: </label>

                        <select name="priority" id="levels" ref={priority1}>
                          <optgroup label="-- Priority Level --">
                            <option value="1" selected={popupPriority === "1"}>
                              High (Red)
                            </option>
                            <option value="2" selected={popupPriority === "2"}>
                              Medium (Yellow)
                            </option>
                            <option value="3" selected={popupPriority === "3"}>
                              Low (Green)
                            </option>
                          </optgroup>
                        </select>
                      </div>

                      <div className="frequencyLevelP">
                        <label for="priority">
                          Choose a frequency for your habit:{" "}
                        </label>

                        <select name="priority" id="levels" ref={frequency1}>
                          <optgroup label="-- Frequency Level --">
                            <option value="Day" selected={popupFreq === "Day"}>Daily</option>
                            <option value="Sun" selected={popupFreq === "Sun"}>Sunday</option>
                            <option value="Mon" selected={popupFreq === "Mon"}>Monday</option>
                            <option value="Tue" selected={popupFreq === "Tue"}>Tuesday</option>
                            <option value="Wed" selected={popupFreq === "Wed"}>Wednesday</option>
                            <option value="Thu" selected={popupFreq === "Thu"}>Thursday</option>
                            <option value="Fri" selected={popupFreq === "Fri"}>Friday</option>
                            <option value="Sat" selected={popupFreq === "Sat"}>Saturday</option>
                          </optgroup>
                        </select>
                      </div>

                      <button
                        className="addHabitButtonP"
                        type="submit"
                        // disabled={allHabits.length >= 10}
                      >
                        Update your habit!
                      </button>

                      <p id="HabitErrorPopup">{errorHandling}</p>
                    </form>
                    </div>
                  </Popup>
                </div>
              )}
            {habit.substring(0, 1) === "3" &&
              (habit.substring(1, 4) === "Day" ||
                habit.substring(1, 4) ===
                  new Date().toDateString().split(" ")[0]) && (
                <div>
                  <h3 style={{ color: "green" }}>
                    {/* {index + 1} . {habit.substring(4)} */}
                    {habit.substring(4)} 
                  </h3>

                  <button
                    className="deleteButton"
                    onClick={(e) => deleteHabit(e, { habit })}
                  >
                    Delete
                  </button>
                  <button
                    className="updateButton"
                    onClick={(e) => updateHabit(e, { habit })}
                  >
                    Update
                  </button>
                </div>
              )}
          </div>
        ))}
      </div>

      <form className="inputHabit" onSubmit={enterHabit}>
        <input
          placeholder="Enter your habit here!"
          className="habitInput"
          ref={habit}
        />
        <div className="priorityLevel">
          <label for="priority">Choose a priority level: </label>

          <select name="priority" id="levels" ref={priority}>
            <optgroup label="-- Priority Level --">
              <option value="1">High (Red)</option>
              <option value="2">Medium (Gold)</option>
              <option value="3">Low (Green)</option>
            </optgroup>
          </select>
        </div>

        <div className="frequencyLevel">
          <label for="priority">Choose a frequency for your habit: </label>

          <select name="priority" id="levels" ref={frequency}>
            <optgroup label="-- Frequency Level --">
              <option value="Day">Daily</option>
              <option value="Sun">Sunday</option>
              <option value="Mon">Monday</option>
              <option value="Tue">Tuesday</option>
              <option value="Wed">Wednesday</option>
              <option value="Thu">Thursday</option>
              <option value="Fri">Friday</option>
              <option value="Sat">Saturday</option>
            </optgroup>
          </select>
        </div>

        <button
          className="addHabitButton"
          type="submit"
          // disabled={allHabits.length >= 10}
        >
          Add your habit!
        </button>

        <p id="HabitError">{errorHandling}</p>

      </form>
      {/* <div id="HabitError"></div> */}
      <div
        className="helpButton"
        onMouseOver={displayHelp}
        onMouseOut={displayQuestion}
      >
        {helpText}
      </div>
    </div>
  );
};

export default HabitTracker;
