import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import "./habitChecklist.css";
import axios from "axios";
import { useState, useEffect } from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HabitChecklist = () => {
  const { user } = useContext(AuthContext);
  
  const [currentUser, setUser] = useState(user);
  const habits = currentUser.userHabits; // all of a user's habits
  //console.log("size", habits.length)

  const notify = () => {
    toast("Loading 5 MooLahs into your account for using your Habit Checklist!");
  }


  const date = new Date().toDateString()
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${currentUser.username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [currentUser.username]);

  console.log("currentUser", currentUser);
  let mooLahs = user.mooLahs;

  const [dbCompletedHabits, setCompHabits] = useState([]);
  useEffect(() => {
    const fetchAllCompHabits = async () => {
      // async function since making api request
      try {
        const res = await axios.get(
          `day/getCompletedHabits/${currentUser.username}/${date}`
        ); // have to specify date
        let length = res.data.length;
        setCompHabits(res.data[length - 1].completedHabits);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllCompHabits();
  }, [currentUser.username]);

  console.log("dbCompletedHabits", dbCompletedHabits);

  //console.log("completed habits", dbCompletedHabits[0].completedHabits.length)

  const checklistSubmit = async (e) => {
    e.preventDefault();
    let completedHabits = [];
    var index = 0;
    let checkboxes = document.querySelectorAll("input[type='checkbox']");
   
    console.log("completedHabits:", completedHabits[index])

    for (let i = 0; i < checkboxes.length; i++) {
      
      if (checkboxes[i].checked) {
        console.log("just i ", i)
        completedHabits[index] = habits[i];
        index++;
      }
    }

    const habitsLog = {
      username: currentUser.username,
      completedHabits: completedHabits,
      allHabits: habits,
      date: new Date().toDateString(),
    };

    
    const firstDailyEntry = await axios.get(`day/getChecklist/${currentUser.username}/${date}`);
   // console.log("firstDailyEntry: ", firstDailyEntry.data[0].completedHabits.length);
    let updateMoolah = false;
    if(firstDailyEntry.data.length == 0){
       updateMoolah = true;
    }/*else if(firstDailyEntry.data[0].completedHabits.length!=habits.length){
      updateMoolah = true;
    }*/
     
    
    const res = await axios.delete(`day/deleteUpdateHack/${currentUser.username}/${date}`);
		console.log("delete res", res)
  
    await axios.post("/day/addCompletedHabits", habitsLog);
    console.log("array lengths", habits.length, completedHabits.length);
    //if (habits.length === completedHabits.length) {
      
      if(updateMoolah){
        //setMooLahs(mooLahs+5)
        mooLahs = mooLahs+5;
        // update user
        try {
          axios.put("/users/" + user._id, { mooLahs: mooLahs });
          // update local storage
      
           // update user object for this page
           user.mooLahs = mooLahs;
           
           // update user object in local (browser) storage
           const newUser = JSON.parse(localStorage.getItem("user"))
           newUser.mooLahs = mooLahs;
           localStorage.setItem("user", JSON.stringify(newUser))
           
           //toast("You earned 5 MooLahs for filling out todays daily entry! Hooray!");
           
        } catch (err) {
          console.log("error with adding mooLahs");
        }
      }
   // }
    // fetch user
    // update local storage
    if(updateMoolah){
      notify();
      setTimeout(function(){
        window.location.reload(false);
      }, 2000);
    }else{
      window.location.reload(false);
    }
    

  };

  // user.spotifyAccessToken = res.data.access_token;
  // user.spotifyRefreshToken = res.data.refresh_token;

  // // update user object in local (browser) storage
  // const newUser = JSON.parse(localStorage.getItem("user"));
  // newUser["spotifyAccessToken"] = res.data.access_token;

  const onEditClick = (e) => {
    setEdit(true);
  };

  const [completedHabits, setCompletedHabits] = useState(dbCompletedHabits);

 
  

  return (
    <>
      {((habits && dbCompletedHabits.length === 0) || edit) && (
               
        <div>
          <h2 className="homeHeader">My Habits</h2>
          <br></br>
          <form>
            <div className="habits">
              {habits.map((habit) => (
                (habit.substring(1, 4) === "Day" ||
                habit.substring(1, 4) ===
                  new Date().toDateString().split(" ")[0]) ? 
                  (<div className="habit" key={habit}>
                    <input type="checkbox" defaultChecked={dbCompletedHabits.includes(habit)}/>
                    <label>{habit.substring(4)}</label>
                  </div>):
                  (<div className="habit" key={habit}>
                    <input type="checkbox" disabled="true" defaultChecked={dbCompletedHabits.includes(habit)}/>
                    <label>{habit.substring(4)} ({habit.substring(1,4)})</label>
                  </div>)
              ))}
            </div>

            <br></br>
            {habits.length > 0 &&
            <button
              className="loginButton"
              type="submit"
              onClick={checklistSubmit}
            >
              Submit
            </button>
            }
            <br></br>
            <br></br>
            <br></br>
          </form>
        </div>
        )}
      

      {dbCompletedHabits && dbCompletedHabits.length > 0 && !edit && (
        <div>
          
          <h1 className="homeHeader">Habits Remaining</h1>
          <br></br>

          <div className="habits">
      

      <ul>
      {habits.map((habit) => (
        (habit.substring(1, 4) === "Day" ||
        habit.substring(1, 4) ===
          new Date().toDateString().split(" ")[0]) &&
        <li
          key={habit.id}
          style={dbCompletedHabits.includes(habit) ? { textDecoration: 'line-through' ,fontSize:20 } : {fontSize:20}}
        >
          {habit.substring(4)}
        </li>
      ))}
     </ul>

            <br></br>
            <button  
            style={{ marginRight: "10px"}}
            className="loginButton" type="submit" onClick={onEditClick}>
              Edit
            </button>
          </div>
          <br></br>
          <br></br>
          <br></br>

          {/* This div important for formatting? */}

        </div>
      )}
      <ToastContainer autoClose={2000}></ToastContainer>
    </>
  );
};

export default HabitChecklist;
