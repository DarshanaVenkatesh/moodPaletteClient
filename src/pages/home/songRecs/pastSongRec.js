import "./songRecs.css"
import "reactjs-popup/dist/index.css";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import SpotifyWebApi from 'spotify-web-api-js';
import { useContext, useState } from "react";


const currDate = new Date().toDateString();


function PastSongRecs() {
  const [currRec, setCurrRec] = useState("");
  const { user } = useContext(AuthContext);
  console.log(user)

  const {date, setDate} = useState(currDate);

  const getSongDB = async () => {
    try {
        const res = await axios.get(
          `/song/getSongID/${user.username}/${currDate}`
          );
        console.log("ATTEMPT " , res.data[0].songId);
        if (typeof res.data[0].songId !== 'undefined') {
          setCurrRec({username: user.username, date:currDate, id: res.data[0].songId});
        } 
    } catch (err) {
      console.log(err);
    }
  }


  return (
    
    <div className="recs">
        <div className="recsWrapper">
            <span className="recsDesc">
              <br/> 
                View your Song Reccomendation!
            </span>
                <br/>
                <div>
                  <br/> <br/> <br/>
                  <br/> 
                  {console.log("CURRRECID" , currRec.id)}
                  {getSongDB}
                  if (currRec.id != undefined ) {
                    <><br /><br /><br /><br />
                    <iframe className="songEmbed" src={"https://open.spotify.com/embed/track/" + currRec.id + "?utm_source=generator"} width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                    <br /><br /></>
                  }
                </div>
                
                </div>
    </div>
  );
}

export default PastSongRecs