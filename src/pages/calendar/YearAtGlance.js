import axios from "axios";
import { useEffect, useState, useRef, useContext } from "react";
import data from './calendar-data-source.json'
import { AuthContext } from './../../context/AuthContext.js';


function App() {

    const {user} = useContext(AuthContext)
    const [currentUser, setUser] = useState(user);

    const canvasRefH = useRef();
  
    const drawRectangleH = async () => {
        const context = canvasRefH.current.getContext("2d");
        let count = 0
        let width = window.innerWidth;
        //console.log("width", width);
        for (let j = 0; j < 53; j++) {
            for (let i = 0; i < 7; i++) {
                let day = getDateString(j*7 + i);
                context.fillStyle = "#" + (0xffffff).toString(16).slice(0, 6);
                if (day !== "") {
                    try {
                        const res = await axios.get(`day/getDailyData/${currentUser.username}/${getDateString(j*7 + i)}`)
                        for (let k = 0; k < res.data.length; k++) {
                            if (res.data[k].color) {
                                context.fillStyle = res.data[k].color;
                            }
                        }
                        //console.log(latestres);
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                context.fillRect(j*24.46+42, i*25.07+20, 24.67, 25.07);
                context.strokeStyle = '#000000';
                context.lineWidth = 0.5;
                context.strokeRect(j*24.46+42, i*25.07+20, 24.67, 25.07);
            }
        }
        //console.log(count);
    };

    // write a text
    const writeTextH = (info, style = {}) => {
        const context = canvasRefH.current.getContext("2d");
        const { text, x, y } = info;
        const { fontSize = 12, fontFamily = 'Raleway', color = 'grey', textAlign = 'right', textBaseline = 'top'} = style;        
    
        context.beginPath();
        context.font = fontSize + 'px ' + fontFamily;
        context.textAlign = textAlign;
        context.textBaseline = textBaseline;
        context.fillStyle = color;
        context.fontWeight = 'thin';
        context.fillText(text, x, y);
        context.stroke();
    };
  
    useEffect(() => {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 0; i < 7; i++) {
            //console.log("look here", 30 + 27*i)
            writeTextH({text: daysOfWeek[i], x: 30, y: 27 + (24*i)});
        }

        const monthTab = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 0; i < 12; i++) {
            var numDays = 6;
            for (let j = 0; j < i; j++) {
                numDays += monthTab[j];
            }
            var numWeeks = Math.floor(numDays/7);
            //console.log(numWeeks);
            writeTextH({ text: monthNames[i], x: 64 + (numWeeks * 24.5), y: 0 + (numWeeks * 0)})
        }
        drawRectangleH();
    }, []);


    const canvasRefV = useRef();
  
    const drawRectangleV = async () => {
        const context = canvasRefV.current.getContext("2d");
        let count = 0
        let width = window.innerWidth;
        //console.log("width", width);
        for (let i = 0; i < 53; i++) {
            for (let j = 0; j < 7; j++) {
                let day = getDateString(i*7 + j);
                if (day !== "") {
                    try {
                        const res = await axios.get(`day/getDailyData/${currentUser.username}/${getDateString(i*7 + j)}`)
                        const latestres = res.data[res.data.length - 1];
                        if (typeof latestres !== 'undefined') {
                            //console.log(latestres)
                            //console.log(latestres.color);
                            context.fillStyle = latestres.color;
                        }
                        else {
                            context.fillStyle = "#" + (0xffffff).toString(16).slice(0, 6);
                        }
                        //console.log(latestres);
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                else {
                    context.fillStyle = "#" + (0xffffff).toString(16).slice(0, 6);
                }
                
                context.strokeStyle = '#000000';
                context.fillRect(j*24.46+42, i*25.07+20, 24.67, 25.07);
                context.lineWidth = 1.2;
                context.strokeRect(j*24.46+42, i*25.07+20, 24.67, 25.07);
            }
        }
        //console.log(count);
    };

    // write a text
    const writeTextV = (info, style = {}) => {
        const context = canvasRefV.current.getContext("2d");
        const { text, x, y } = info;
        const { fontSize = 12, fontFamily = 'Raleway', color = 'grey', textAlign = 'right', textBaseline = 'top'} = style;        
    
        context.beginPath();
        context.font = fontSize + 'px ' + fontFamily;
        context.textAlign = textAlign;
        context.textBaseline = textBaseline;
        context.fillStyle = color;
        context.fontWeight = 'thin';
        context.fillText(text, x, y);
        context.stroke();
    };
  
    useEffect(() => {
        const days = 'S     M     T     W     T     F     S'
        writeTextV({text: days, x: 200, y: 0});


        const monthTab = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 0; i < 12; i++) {
            var numDays = 6;
            for (let j = 0; j < i; j++) {
                numDays += monthTab[j];
            }
            var numWeeks = Math.floor(numDays/7);
            //console.log(numWeeks);
            writeTextV({ text: monthNames[i], x: 30, y: 27 + (numWeeks * 25)})
        }
        drawRectangleV();
    }, []);
    
    function getDateString(dayOfYear) {
        //console.log(dayOfYear)
        if (dayOfYear > 364) {
            return "";
        }
        const monthTab = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let monthIndex = 0;
        while (dayOfYear >= monthTab[monthIndex]) {
            dayOfYear -= monthTab[monthIndex];
            monthIndex++;
        }
        let dateString = (monthIndex + 1) + "/" + (dayOfYear + 1) + "/2023";
        const date = new Date(dateString);
        if (date > new Date()) {
            return "";
        }
        //console.log(dateString, date.toDateString());
        return date.toDateString();
    }
    // return (
    //     <div>
    //         <canvas
    //         id="vertical"
    //         ref={canvasRefV}
    //         height={1348}
    //         width={255}
    //         />
    //     </div>
    // );

    const [clicked, setClicked] = useState(false);

    return (
        <div>
            <button id="button" onClick={() => setClicked(!clicked)}>
                {clicked ? 'Horizontal view' : 'Vertical view'}
            </button>
            <br></br>
            <br></br>
            <div>
                <canvas
                id="horizontal"
                ref={canvasRefH}
                height={255}
                width={1348}
                style={{visibility: clicked ? 'hidden' : 'visible' }}
                />
            </div>
            <div>
                <canvas
                id="vertical"
                ref={canvasRefV}
                height={1365}
                width={255}
                style={{visibility: clicked ? 'visible' : 'hidden' }}
                />
            </div>
        </div>
    );
}
  
  export default App;