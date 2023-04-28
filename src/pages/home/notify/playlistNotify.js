import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import Popup from 'reactjs-popup';
import "./notify.css"

function PlaylistNotify() {
    const {user} = useContext(AuthContext);
    const [playlistId, setPlaylistId] = useState({id: ""});

    useEffect(() => {
        async function getPlaylistId() {
            try {
                const currDate = new Date().toDateString()
                const currMonth = (currDate.split(" "))[1]
                const res = await axios.get(`/song/getPlaylistId/${user.username}/${currMonth}`);
                if (res) {
                    setPlaylistId({id: res.data.playlistId})
                }
            } catch (err) {
              console.log(err.response.data);
            }
        }
        getPlaylistId();
      },[])

    const updateNotifyFlag = async () => {
        console.log("updating notify flag!")
        try {
            const currentUser = {
                username: user.username,
            };

            //update DB
            await axios.post("/users/updateNotifyFlag", currentUser)
        
            // update user object for this page
            user.monthlyNotify = false
            
            // update user object in local (browser) storage
            const newUser = JSON.parse(localStorage.getItem("user"))
            newUser["monthlyNotify"] = false
            localStorage.setItem("user", JSON.stringify(newUser))
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <Popup open={user.monthlyNotify && playlistId.id !== ""} modal nested onClose={updateNotifyFlag}>
                {close => (
                <div className="notifyOuterContainer"> 
                    <div className="notifyInnerContainer">
                        <div className="notifyText">
                            <p>Your monthly Spotify playlist is ready!</p>
                        </div>
                    </div>
                    <br></br>
                    <div>
                        <iframe src={"https://open.spotify.com/embed/playlist/" + playlistId.id + "?utm_source=generator"} width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                    </div>
                    <div className="notifyInnerContainer">
                        <button className="notifyYesBtn" onClick={() => {close()}}>Cool!</button>
                    </div>
                </div>
                )}
            </Popup>
        </div> 
    )
}

export default PlaylistNotify