import "./profile.css";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import NavBar from "../navbar/index";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SpotifyWebApi from 'spotify-web-api-js';

import emailjs from 'emailjs-com';
import SpotifyGenres from "./genre";

import partyprimary from '../shop/outfits/party-primary.png'
import partysecondary from '../shop/outfits/party-secondary.png'
import crownprimary from '../shop/outfits/crown-primary.png'
import crownsecondary from '../shop/outfits/crown-secondary.png'
import cowboyprimary from '../shop/outfits/cowboy-primary.png'
import cowboysecondary from '../shop/outfits/cowboy-secondary.png'
import fancyprimary from '../shop/outfits/fancy-primary.png'
import fancysecondary from '../shop/outfits/fancy-secondary.png'
import employeeprimary from '../shop/outfits/employee-primary.png'
import employeesecondary from '../shop/outfits/employee-secondary.png'
import chefprimary from '../shop/outfits/chef-primary.png'
import chefsecondary from '../shop/outfits/chef-secondary.png'
import sportsprimary from '../shop/outfits/sports-primary.png'
import sportssecondary from '../shop/outfits/sports-secondary.png'
import ninjaprimary from '../shop/outfits/ninja-primary.png'
import ninjasecondary from '../shop/outfits/ninja-secondary.png'
import popstarprimary from '../shop/outfits/popstar-primary.png'
import popstarsecondary from '../shop/outfits/popstar-secondary.png'
import discoprimary from '../shop/outfits/disco-primary.png'
import discosecondary from '../shop/outfits/disco-secondary.png'
import cow from '../shop/outfits/cow.png'

//import { checkAccessToken } from "../home/spotify/spotifyAuth";
const spotifyApi = new SpotifyWebApi();

const notify = () => {
  toast("Make sure to fill out your Mood Palette for the day!");
}

export default function Profile() {

  const [currRec, setCurrRec] = useState("");
  const [helpText, setHelpText] = useState("?");

  const displayHelp = () => {
    setHelpText("Welcome to your profile page! Feel free to edit your profile information on the left. On the right, input a time at which you'd like to be reminded to enter your daily data!")
  }

  const displayQuestion = () => {
    setHelpText("?");
  }
  const form = useRef();
    function sendEmail(e) {
        e.preventDefault();    //This is important, i'm not sure why, but the email won't send without it
    
        emailjs.sendForm('service_t3oalh7', 'template_zh4imic', e.target, 'QDfiNV70JdveqlrKq')
          .then((result) => {
              window.location.reload()  //This is if you still want the page to reload (since e.preventDefault() cancelled that behavior) 
          }, (error) => {
              console.log(error.text);
          });
      }

  const { user, dispatch } = useContext(AuthContext);
  console.log(user)

  const username = useRef();
  const email = useRef();
  const age = useRef();

  const navigate = useNavigate();

  const handleEdit = async (e) => {
    e.preventDefault();
     console.log("username entered", username.current.value)
	if (username.current.value.length !== 0) {
		try {
			axios.put("/users/" + user._id, {
				username: username.current.value
			});
		} catch (err) {
			console.log("error with editing username");
		}
	}

	if (email.current.value.length !== 0) {
		try {
			axios.put("/users/" + user._id, { email: email.current.value });
		} catch (err) {
			console.log("error with editing email");
		}
	}

	if (age.current.value.length !== 0) {
		try {
			axios.put("/users/" + user._id, { age: age.current.value });
		} catch (err) {
			console.log("error with editing age");
		}
	}

	// when user updates their credentials, they must login again
	dispatch({type:"LOGOUT", payload: user})
	navigate('/login');

  };

  const handleDelete = async (e) => {
	e.preventDefault();
	try {
		const res = await axios.delete(`/users/${user._id}`);
		console.log(res)
		
		dispatch({type:"LOGOUT", payload: user})
		navigate("/register");
	} catch (err) {
		console.log("error with deleting");
	}
  };

  let editButton = (
    <button variant="contained" className="greenBtnEdit">
      Edit Profile
    </button>
  );
  let deleteButton = (
    <button variant="contained" className="redBtnChoose">
      {" "}
      Delete Profile
    </button>
  );
  let updateGenreButton = (
    <button variant="contained" className="blueBtnEdit">
      Update Genres
    </button>
  )

  let deleteFinal = (
    <button
      variant="contained"
      className="redBtnFinal"
      onClick={handleDelete}
    >
      {" "}
      Delete Profile
    </button>
  );


  const getRecs = async () => {
    const res = await axios.get("/spotify/fetchAccessToken", {})
    .then((res) => {
      spotifyApi.setAccessToken(res.data.accessToken);
      return spotifyApi.getRecommendations({
        limit:5,
        market:"ES",
        seed_artists:"4NHQUGzhtTLFvgF5SZesLK",
        seed_genres:"rock,pop,classical",
        seed_tracks:"0c6xIDDpzE81m2q797ordA"
      }).then((response) => {
          console.log("THIS IS MY REC:", response)
          setCurrRec({
            name: response.tracks[0].name,
            albumArt: response.tracks[0].album.images[0].url
          }) 
      });
    })
    .catch((error) => {
        console.log(error);
    });
  }

  const outfits = [partyprimary, partysecondary, crownprimary, crownsecondary, cowboyprimary, cowboysecondary, fancyprimary, fancysecondary, employeeprimary, employeesecondary, chefprimary, chefsecondary, sportsprimary, sportssecondary, ninjaprimary, ninjasecondary, popstarprimary, popstarsecondary, discoprimary, discosecondary, cow]
  const mooPalImg = outfits[user.mooPalOutfit]

  return (
    <>
      {<NavBar></NavBar>}
      <h2 className="homeHeader">{user.username}'s Profile Page!!</h2>
      <div className="entirePage">
        <div className="entireProfile">
          <img
            className="profileUserImg"
			      alt="mooPal"
            src={mooPalImg}
          />
          <h4 className="profileInfoName">{user.username}</h4>
          <p className="profileInfoEmail">{user.email}</p>
          <span className="profileInfoDesc">{user.age}</span>
          <div className="spacer">
            <Popup trigger={editButton} modal nested>
              {(close) => (
                <div className="modal">
                  <div className="content">
                    <h2>Edit Profile</h2>
                    <div>
                      <form className="registerBox" onSubmit={handleEdit}>
                        <input
                          placeholder={user.username}
                          ref={username}
                          className="registerInput"
                        />
                        <input
                          placeholder={user.email}
                          ref={email}
                          c
                          type="email"
                          className="registerInput"
                        />
                        <input
                          placeholder={user.age}
                          ref={age}
                          className="registerInput"
                        />
                        <button className="updateInfoBtn" type="submit">
                          Update Info
                        </button>
                        <button
                          className="greyBtnCancel2"
                          onClick={() => close()}
                        >
                          Cancel
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </Popup>{" "}
            <Popup trigger={deleteButton} modal nested>
              {(close) => (
                <div className="modal">
                  <div className="content">
                    <h2>Delete Profile</h2>
                    <br />
                    <p>
                      We're sad to see you leave! Are you sure you wish to
                      delete your account?
                    </p>
                    <p>
                      {" "}
                      This is permanent and all your information will be lost!{" "}
                    </p>
                    <br />
                    <div className="spacer">
                      {deleteFinal}{" "}
                      <button
                        variant="contained"
                        className="greyBtnCancel"
                        onClick={() => close()}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Popup>
            <Popup trigger={updateGenreButton} modal nested>
              {(close) => (
                  <div className="modal">
                    <div className="content">
                      <center><h2>Update your Spotify genre preferences</h2></center>
                      <br/>
                      <SpotifyGenres></SpotifyGenres>
                      <div className="spacer">
                        <br/>
                        <center><button
                          variant="contained"
                          className="greyBtnCancel"
                          onClick={() => close()}
                        >
                          Close
                        </button></center>
                      </div>
                    </div>
                  </div>
              )}
            </Popup>
          </div>{" "}
          {/* this div has the two buttons --> leads to popups*/}
        </div>
        <div className="email">
            <div classname="emailWrapper">
            <span className="loginDesc">
            Subscribe to email notifications!
          </span>
            <br/>
            <div className="emailRight">
            <form className="contact-form" onSubmit={sendEmail}>
                <input type="hidden" name="contact_number" />
                <label>Name</label>
                <input className="from_name" type="text" name="from_name" />
                <br/>
                <label>Email</label>
                <input className="from_email" type="email" name="from_email" />
                <br/>
                <label>Time</label>
                <input type="time" className="from_time" name="from_time" />
                <br/>
                <label>Subscribe</label>
                <input  type="checkbox" name="from_checkbox"/>
                <br/>
                <input className="submit" type="submit" value="Send" />
                <br/>
                <button className="notify" value="Notify!" onClick={notify}></button>
                </form>

            </div>
            <ToastContainer/>
            </div>
        </div>
        </div>
        {/* <div className="entireProfile"></div> */}
        <div className="helpButton" onMouseOver={displayHelp} onMouseOut={displayQuestion}>{helpText}</div>
    </>
    
  );
}