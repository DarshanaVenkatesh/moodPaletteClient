import axios from "axios";
import { useEffect } from "react";

const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URI = 'http://localhost:3000/'
const CLIENT_ID = "1f57088263ff49bebe219245a8e8c6c9" //TODO: figure out why process.env.SPOTIFY_CLIENT_ID doesn't work
const SCOPES = ['user-read-private', 'user-top-read', 'user-read-email', 'user-read-playback-state', 'playlist-modify-public', 'playlist-modify-private']
const SCOPES_URL = SCOPES.join("%20");
const STATE = 'some-state-of-my-choice'; //TODO: generate random number

function SpotifyAuth() {
    useEffect(() => {
        async function generateSpotifyToken() {
            if (window.location.search) {
                const afterQuestion = window.location.search.toString().substring(1);
                const [codeKV, stateKV] = afterQuestion.split("&");
                const [codeKey, codeValue] = codeKV.split("=");
                const [stateKey, stateValue] = stateKV.split("=");

                if (stateValue === STATE && codeKey === "code") {
                    try {
                        axios.post("/spotify/generateAccessToken", { code : codeValue });
                    } catch (err) {
                        console.log(err);
                    }
                }
                else if (stateValue !== STATE) {
                    console.log("Incorrect state! Aborting...")
                }
                else if (codeKey === "error" && codeValue === "access_denied") {
                    // plz don't deny...
                    console.log("User denied authorization")
                }
            }
        }
        generateSpotifyToken();
    });

    const generateSpotifyToken = () => {
        // redirect to Spotify authorization page
        window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL}&state=${STATE}&response_type=code&show_dialog=true`;
    }

    return (
        <button onClick={generateSpotifyToken}></button>
    )
}
export default SpotifyAuth

/*function checkAccessToken() {
    if (localStorage.getItem("spotify_token") == null) {
        fetchNewAccessToken();
        while (localStorage.getItem("spotify_token") == null) {
            // wait for async function to return
        }
    }
    else {
        var spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(localStorage.getItem("spotify_token"));
        spotifyApi.getMe().then((response) => {
            // do nothing, everything is good
        })
        .catch((error) => {
        if (error.status === 401)
            console.log("The access token has expired");
            localStorage.setItem("spotify_token", null);
            fetchNewAccessToken();
            while (localStorage.getItem("spotify_token") == null) {
                // wait for async function to return
            }
        }); 
    }
}

async function fetchNewAccessToken() {
    const res = await axios.post("/spotify/fetchAccessToken", {});
    localStorage.setItem("spotify_token", res.data);
}

export { checkAccessToken };*/