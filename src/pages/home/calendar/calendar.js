import {useState} from 'react';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'
import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './calendar.css';
import {Slider } from '@mui/material';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { ChromePicker } from 'react-color'
import axios from "axios";



import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
//userContext for storing/accessing user specific data 
// use the auth context to get this user //from AuthContext.js

const {user} = useContext(AuthContext)
 //to track selected date
 const [date, setDate] = useState(new Date())
 //to specify popups for specific dates
 const [open, setOpen] = useState(false)
 const [openPast, setOpenPast] = useState(false)
 //to open a popup when the user hasn't inputted their thought log
 const [openExtra, setOpenExtra] = useState(false)
 //to track the color
 const[color, setColor] = useState("#ffffff");
 //to track the vibe
 const[vibe, setVibe] = useState(25);
 //to track emotion
 const [emotion, setEmotion] = useState("");
 //to save text within the textbox- for journal
 const [journal, setText] = useState("");
 //to store the retrieved data

const [currRec, setCurrRec] = useState("");
 const [clickedDate, setClickedDate] = useState(new Date());

 const notify = () => {
  toast("Loading 5 MooLahs into your account for completing your daily entry!");
}
 

 const [userData, setUserData] = useState({
  username: "",
  date: "",
  color: "",
  vibe: 0,
  journal: "",
  emotion: ""
 })
 

 //const [mooLahs, setMooLahs] = useState[user.mooLahs];
 let mooLahs = user.mooLahs;
 const[firstDailyEntry, setDailyEntry] = useState(false);


const getUserData = async (e) => {
  console.log("DATE:", date.toDateString());
  const res = await axios.get(`day/getDailyData/${user.username}/${date.toDateString()}`)
  
  const song = await axios.get(`/song/getSongID/${user.username}/${clickedDate.toDateString()}`);
  console.log("song res", song);
  setCurrRec(song.data.songId);

  console.log("inside getUserData");
  let latestres = 'undefined';
  let foundData = false
  console.log("inside getUserData");
  console.log("latestres:", latestres);
  for (let k = 0; k < res.data.length; k++) {
    if (typeof res.data[k] !== 'undefined' && res.data[k].color) {
      foundData = true;
      latestres = res.data[k];
    }
  }
  if (foundData) {
    console.log("found data: user has already submitted once");
   
    setUserData({username: user.username, date: date.toDateString(), color: latestres.color, vibe: latestres.vibe, journal: latestres.journal, emotion: latestres.emotion});
    setColor(latestres.color);
    setVibe(latestres.vibe);
    setText(latestres.journal);
    setEmotion(latestres.emotion)
  }
  else {
    console.log("did not find data: first entry of today");
    setDailyEntry(true);
    setUserData({username: user.username, date: date.toDateString(), color: "#ffffff", vibe: 25, journal: "", emotion: ""});
  }
  return "";
};


// to handle submission of data to the backend API
const handleSubmit = async (e) => {

    e.preventDefault();
    console.log("user: ", user.username, " date: ", date.toDateString, " color: ", color, " vibe: ", vibe, " journal: ", journal, " emotion: ", emotion);
    const apiData = {
      username: user.username,
      date: date.toDateString(),
      color: color.hex,
      vibe: vibe,
      journal: journal,
      emotion: emotion,
    };
    if (emotion == null) { 
      setOpenExtra(true) 
    }
    else {
      if (emotion !== "") {
        setOpenExtra(false);
        setOpenPast(true);
        console.log(apiData);
        // submit data into db
        await axios.post("/day/addDayInputs", apiData).then((response) => {
          console.log(response.data);
          // handle successful response
        })
        .catch((error) => {
          //console.error(error);
          console.log(error);
          // handle error response
        });
      
      
      }
      //await axios.post("/day/addDayInput", apiData);
    }
    console.log("done")
    return "";
};

 //to specify popups
 const handleDateClick = (clickedDate) => {
  setClickedDate(clickedDate);
  console.log("Clicked Date", clickedDate)
  getUserData();
  if (clickedDate.toDateString() === new Date().toDateString()) {
    getUserData();
    setOpen(true);
    setDate(clickedDate);
  } else if (clickedDate < new Date()) {
    setDate(clickedDate);
    setOpenPast(true);
  }

  // set apiData with the data you want to send to the API
  // setApiData({
  //   username: user.username,
  //   date: clickedDate.toDateString(),
  //   color: color.hex,
  //   vibe: vibe,
  //   journal: journal,
  //   emotion: emotion,
  // });
};

const handleMooLahs = async (e) => {
  console.log("NOTIFY");

//  increment mooLahs
      console.log("here", firstDailyEntry);
       if(firstDailyEntry){
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
        setOpenPast(false)
  
        if(firstDailyEntry){
          notify();
          setTimeout(function(){
            window.location.reload(false);
          }, 2000);
        }else{
          window.location.reload()
        }
        
        //window.location.reload();
        
       
        //e.preventDefault();
        //toast("suppp")
   
   
        //notify();

        /*
        if(firstDailyEntry){
          notify();
        }*/
       
}

const marks = [
  { value: 0, label: '0'},
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 30, label: '30' },
  { value: 40, label: '40' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
];



return (
 <div className="app">
   <h2 className="homeHeader"> My Calendar </h2>
   <div className="calendar-container">
     <Calendar 
        onChange={setDate} 
        value={date}
        tileClassName={({date, view}) => {
          if (view === 'month' && date <= new Date()) {
            return "react-calendar__tile--prev";
          }
        }}
        
        //adding click event to each date in calendar 
        //tileContent prop takes a function that returns a date button to be rendered in each date tile
        tileContent={({ date, view }) => {
          if (date > new Date()) {
            return null;
          }
          if (view === 'month'){
            return (
              <button onClick={() => handleDateClick(date)}>
                {date.getDate()}
              </button>
          );}
        }}
        />
   </div>
        <Popup open={open} closeOnDocumentClick onClose={() => setOpen(false)}>
            <h2>{date.toDateString()}</h2><br />
            <p>Color of the day: </p><br />
            <center>
              <ChromePicker color={color} onChange={updatedColor => setColor(updatedColor)} disableAlpha={true}/>
            </center> <br />
            <p>Vibe Meter: </p>
            <Slider
                  aria-label="Restricted values"
                  defaultValue={25}
                  step={1}
                  valueLabelDisplay="auto"
                  marks={marks}
                  max={50}
                  min={0}
                  onChange={(value) => {setVibe(value.target.value)}}
              />
            <p>Thought Log: </p>
            <textarea rows="4" cols="104" value={journal} onChange={(event) => setText(event.target.value)}></textarea>
            <div style={{ width: "100%", textAlign: "center" }}>
                <button style={{ display: "block", marginTop: "20px", float: "right" }} onClick={() => {
                  setOpen(false);
                  setOpenExtra(true);
                }}>Next</button>
            </div>
        </Popup>
        <Popup open={openPast} closeOnDocumentClick onClose={() => setOpenPast(false)} onOpen={(e) => getUserData(e)}
        contentStyle={{ border: `10px solid ${userData.color}` }}>
          <h2>{date.toDateString()}</h2><br />
          <p>Vibe Meter: {userData.vibe} </p><br></br>
          <p>Journal: {userData.journal} </p><br></br>
          <p>Emotion: {userData.emotion} </p><br></br>

          <p>Song of the Day!:  </p><br></br>
          <p>{currRec}</p>
          
                  <iframe className="songEmbed" src= {"https://open.spotify.com/embed/track/" + currRec + "?utm_source=generator"} width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>             
                  
         
         
            <button onClick={handleMooLahs}>Close</button>
          
        </Popup>
        <Popup open={openExtra} closeOnDocumentClick onClose={() => setOpenExtra(false)}>
          <h2>Select your mood</h2>
          <br />
            <Container fluid="md">
                <Row>
                    <button class = "emoji-button" onClick={() => setEmotion("Happy")}>🙂</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Sad")}>🙁</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Stressed")}>😫</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Angry")}>😡</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Bored")}>😑</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Confused")}>🤔</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Sick")}>🤢</button>
                </Row>
                <Row>
                    <button class = "emoji-button" onClick={() => setEmotion("Calm")}>😌</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Hopeful")}>🙏</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Worried")}>😬</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Annoyed")}>😒</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Proud")}>👏</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Satisfied")}>😊</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Tired")}>🥱</button>
                </Row>
                <Row>
                    <button class = "emoji-button" onClick={() => setEmotion("Loving")}>🥰</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Scared")}>😨</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Meh")}>😶</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Distraught")}>😭</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Excited")}>🤩</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Exhausted")}>💀</button>
                    <button class = "emoji-button" onClick={() => setEmotion("Shocked")}>🤯</button>
                </Row>
              </Container>
            <br />
            <h3>Your current mood: {emotion}</h3>
            <br />
            <button onClick={() => {
                setOpenExtra(false);
                setOpen(true);
            }}>Back</button>
            <button style={{float: "right"}} onClick={handleSubmit}>Done</button>
            {/*<button onClick={notify}>TEST</button>*/}
            {console.log("color", color, "vibe", vibe, "journal", journal, "emotion", emotion)}
        </Popup>
        <ToastContainer autoClose={2000}></ToastContainer>
  </div>
  )
}


export default App;