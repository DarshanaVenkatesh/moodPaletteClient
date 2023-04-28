import React from 'react';
import Heatmap from './Heatmap'
import YearAtGlance from './YearAtGlance'
import NavBar from "../navbar/index"
import Grid from '@mui/material/Grid';
import { useState } from 'react';

export default function CalendarView() {

    const [helpText, setHelpText] = useState("?");

    const displayHelp = () => {
      setHelpText("Welcome to your calendar view! Here you can see your data throughout the year!")
    }
  
    const displayQuestion = () => {
      setHelpText("?");
    }

    return (
        <React.StrictMode>
            <div>
            {<NavBar></NavBar>}
            <br></br>
            <div class="calendars">
            <h2>Habit Tracker Heat Map:</h2>
            <Heatmap></Heatmap>            
            <h2>Year at a glance:</h2>
            <br></br>
            <YearAtGlance></YearAtGlance>
            </div>
            </div>
            <div className="helpButton" onMouseOver={displayHelp} onMouseOut={displayQuestion}>{helpText}</div>
        </React.StrictMode>
    )
}