import React, { useState } from 'react';
import { ChromePicker } from 'react-color'

function App() {
    const[color, setColor] = useState('#fff');
    return (
        <div>
            <ChromePicker color={color} onChange={updatedColor => setColor(updatedColor)} disableAlpha={true}/>
        </div>
    );
}
export default App;
