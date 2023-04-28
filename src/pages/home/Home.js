import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./home.css";
import Calendar from "./calendar/calendar";
import NavBar from "../navbar/index";
import GetDailyQuote from "./quotes/dailyQuote";
import PlaylistNotify from "./notify/playlistNotify"
import { useState } from "react";

import HabitChecklist from "./habitChecklist/HabitChecklist";
import SpotifyAuth from "./spotify/spotifyAuth";
import SongRecs from "./songRecs/songRecs";
import Colby from "./colby.png";

export default function Home() {
  const { user } = useContext(AuthContext);
  console.log(user);
  const [helpText, setHelpText] = useState("?");

  const displayHelp = () => {
    setHelpText("Welcome to Mood Palette! To enter your color of the day, vibe level, an optional diary entry, and emotion, click on today's date. To view previous day's inputs, click on the date you would like to see! Track your habits by using the checklist on the left. If you want to add more, checkout the Habit Tracker page. Customize your Moo Pal by dressing it up in different outfits from the Moo Mart!")
  }

  const displayQuestion = () => {
    setHelpText("?");
  }

  return (
    <div className="homePage">
        {/*{ <SpotifyAuth></SpotifyAuth> }*/} {/*TODO: figure out a better way to do this*/}
        {<NavBar></NavBar>}   
        <br></br>
        <br></br>
        <div className="calendarAndChecklist">
          <h1 className = "header1"><u>Hi, {user.username}!</u></h1>
            <div className="calendar">
                { <Calendar></Calendar> }
            </div>
            <div className="checklist">
                {<HabitChecklist></HabitChecklist> }
            </div>
        </div>
        { <PlaylistNotify></PlaylistNotify> }
        { <GetDailyQuote></GetDailyQuote> }
        <center>
        { <SongRecs></SongRecs> }    
        </center>
        <div className="helpButton" onMouseOver={displayHelp} onMouseOut={displayQuestion}>{helpText}</div>
    </div> 
  )
}
