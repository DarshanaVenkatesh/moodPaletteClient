import * as React from "react";
import { HeatMapComponent, Legend, Tooltip, Inject } from '@syncfusion/ej2-react-heatmap';
import { Internationalization } from "@syncfusion/ej2-base";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";


/**
 * Calender HeatMap sample
 */
function CalendarHeatmap() {

    const [totalData, setTotalData] = useState(Array.from({length: 53},()=> Array.from({length: 7}, () => null)));
    const [percentData, setPercentData] = useState(Array.from({length: 53},()=> Array.from({length: 7}, () => null)));
    const { user } = useContext(AuthContext);
    
    const handleChange = (row, column, tData, pData) => {
        let tCopy = [...totalData];
        let pCopy = [...percentData];
        if (pData !== pData) {
            pData = 0;
        }
        tCopy[row][column] = tData;
        pCopy[row][column] = pData;
        setTotalData(tCopy);
        setPercentData(pCopy);
    };

    window.onload = async function fillHeatmap() {
        //console.log(user.username)
        try {
            for (var i = 0; i < 53; i++) {
                for (var j = 0; j < 7; j++) {
                    //console.log(getDateString(j + i*7))
                    const dateString = getDateString(j + i*7);
                    if (dateString !== "") {
                        const res = await axios.get(`day/getDailyData/${user.username}/${dateString}`)
                        let numCompleted = 0;
                        let numTotal = 0;
                        for (var k = 0; k < res.data.length; k++) {
                            if (!res.data[k].color) {
                                console.log(res.data[k], dateString);
                                numCompleted = res.data[k].completedHabits.length
                                numTotal = res.data[k].allHabits.length //THIS HAS TO BE CHANGED TO TOTALHABITS.LENGTH
                            }
                        }
                        console.log(numCompleted, numTotal)
                        if (numTotal > 0) {
                            //console.log(latestres.completedHabits.length);
                            //console.log(latestres.color);
                            handleChange(i, j, numCompleted, (numCompleted*1.0) / numTotal);
                        }
                        else {
                            handleChange(i, j, 0, 0);
                        }
                    }
                    else {
                        handleChange(i, j, 0, 0);
                    }
                }
            }
        }
        catch (error) {
            console.log(error);
        }
        console.log(percentData);
        console.log(totalData);
    } 

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

    function tooltipTemplate(args) {
        let intl = new Internationalization();
        let format = intl.getDateFormat({ format: 'EEE MMM dd, yyyy' });
        let newDate = new Date(args.xValue);
        let date = new Date(newDate.getTime());
        let axisLabel = args.heatmap.axisCollections[1].axisLabels;
        let index = axisLabel.indexOf(args.yLabel);
        (date).setDate((date).getDate() + index);
        let value = format(date);
        const monthTab = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let month = date.getMonth();
        let day = date.getDate() - 1;
        let totalDay = 0;
        for (let i = 0; i < month; i++) {
            totalDay += monthTab[i];
        }
        totalDay += day;
        let week = Math.floor(totalDay / 7);
        console.log("in tooltip");
        console.log(totalDay);
        console.log(percentData[week][index], totalData[week][index]);
        console.log(week, index)
        args.content = [(args.value === 0 ? 'No' : (totalData[week][index])) + ' ' + ' habits completed' + '<br>' + value];
    }
    ;
    function load(args) {
        let selectedTheme = window.location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.heatmap.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
    }
    ;


    return (
        <div>
            <div>
                {/* <Mounting /> */}
            </div>
            <div className='control-pane'>
                <div className='control-section'>
                    <HeatMapComponent id='heatmap-container' titleSettings={{
                text: '',
                textStyle: {
                    size: '15px',
                    fontWeight: '500',
                }
            }} height={'270px'} width={'1350px'}xAxis={{
                opposedPosition: true,
                valueType: 'DateTime',
                minimum: new Date(2022, 12, 1),
                maximum: new Date(2023, 12, 1),
                intervalType: 'Days',
                showLabelOn: 'Months',
                labelFormat: 'MMM',
                increment: 7,
                labelIntersectAction: 'Rotate45',
            }} yAxis={{
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                isInversed: true,
            }} dataSource={percentData} cellSettings={{
                showLabel: false,
                border: { color: 'white' }
            }} tooltipRender={tooltipTemplate} paletteSettings={{
                palette: [{ value: NaN, color: 'rgb(238,238,238)', label: '0% of habits completed' },
                    { value: 0.01, color: 'rgb(150, 255, 150)', label: '1-20% of habits completed' },
                    { value: 0.21, color: 'rgb(105, 216, 105)', label: '21-40% of habits completed' },
                    { value: 0.41, color: 'rgb(75, 195, 75)', label: '41-60% of habits completed' },
                    { value: 0.61, color: 'rgb(37, 156, 37)', label: '61-80% of habits completed' },
                    { value: 0.81, color: 'rgb(0, 117, 0)', label: '81-100% of habits completed' },
                ],
                type: 'Fixed',
                emptyPointColor: 'white'
            }} load={load.bind(this)} legendSettings={{
                position: 'Bottom',
                width: '20%',
                alignment: 'Near',
                showLabel: true,
                labelDisplayType: 'None',
                enableSmartLegend: true
            }}>
                        <Inject services={[Legend, Tooltip]}/>
                    </HeatMapComponent>
                </div>
            </div>
        </div>);
}
export default CalendarHeatmap;