//LOGIN PAGE FRONTEND CODE
import { React, useRef, useState } from "react";
import "./login.css";
import { loginCall } from "../../attemptLogin";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function Login() {
  //*Note: we could also use state but since this refreshes with each letter,, better to use reference
  const username = useRef(); // useRef will auto update this value with whatever user types in form immediately
  const password = useRef(); // just say ref={varName} with associated form input

  const {user, isFetching, totalLogins, dispatch} = useContext(AuthContext) // use the auth context to get this info

  const navigate = useNavigate();

  //BELOW ARE TWO FUNCTIONS THAT WILL HELP US TO VALIDATE THE EMAIL/PASSWORD THAT A USER LOGINS WITH
  const [validU, setValidU] = useState(0);
	const [validP, setValidP] = useState(0);

	function validateUsername() {
		if (username.current.value.length === 0) {
			document.getElementById("usernameError").innerHTML = "Please enter a username!";
			console.log("username length is 0");
			setValidU(0);
		}  else {
			document.getElementById("usernameError").innerHTML = "";
			setValidU(1);
		}
	}

	function validatePassword() {
		// add regex check
		// var re = ^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$;
		if (password.current.value.length === 0) {
			document.getElementById("passError").innerHTML = "Please enter password!";
			console.log("password length is 0");
			setValidP(0);
		} else if (
			!(
				password.current.value.length >= 8 &&
				password.current.value.length <= 16 
				// && (password.current.value.match(/(?=.*[^a-zA-Z0-9])/) &&
				// 	!/\s/g.test(password.current.value))
			)
		) {
			document.getElementById("passError").innerHTML =
				"Please enter a valid password!";
			console.log("password is not valid type");
			setValidP(0);
		} else {
			document.getElementById("passError").innerHTML = "";
			setValidP(1);
		}
	}

  const [passwordType, setPasswordType] = useState("password");

  const togglePassword = (e) => {
    e.preventDefault(); //THIS PREVENTS THE PAGE FROM REFRESHING!!
    if (passwordType === "password") {
      setPasswordType("text");
      // return;
    } else {
      setPasswordType("password");
    }
  };

  //console.log(dispatch)
  // method for when user clicks login button
  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // stops page from refreshing on button click
    //username.current.value holds whatever user submitted as username
    //password.current.value holds whatever user submitted as password
    console.log("username", username.current.value);
    console.log("password", password.current.value);
    console.log(validU + validP);
    if (validU + validP === 2) {
        console.log("trying to validate user")
        loginCall({ username: username.current.value, password: password.current.value }, dispatch, totalLogins)
        .then(function(data) {
          console.log(data);
          document.getElementById("lockoutError").innerHTML = data;
        })     
    } else {
			document.getElementById("overallError").innerHTML =
				"Please fill all fields!";
		}

  }

  const registerRedirect = () => {
    navigate("/register");
  };

  console.log("user", user);

  // page
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Mood Palette</h3>
          <span className="loginDesc">
            Track your mood, write diary entries, customize your Moo Pal, and
            get a personalized song everyday!
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleLoginSubmit}>
            <input
              placeholder="Username"
              className="loginInput"
              ref={username}
              onBlur={validateUsername}/>
            <div id="usernameError" style={{ color: "red" }}></div>

            {/* PASSWORD AND VISIBILITY BELOW */}
            <input
              placeholder="Password"
              type={passwordType}
              className="loginInput"
              ref={password}
              onBlur={validatePassword}/>
            <div id="passError" style={{ color: "red" }}></div>
           
            <div className="input-group-btn">
              <button
                className="btn btn-outline-primary"
                onClick={togglePassword}
              >
                {passwordType === "password" ? (
                  <span class="material-icons">Show Password</span>

                ) : (
                  <span class="material-icons">Hide Password</span>
                )}
              </button>
            </div>

               
            {/* PASSWORD AND VISIBILITY ABOVE */}

            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? <CircularProgress size="20px" /> : "Log In"}
            </button>
            <div id="lockoutError" style={{ color: "red" }}></div>
            {/* <span className="loginForgot">Forgot Password?</span> */}
            <button className="loginRegisterButton" onClick={registerRedirect}>
              {isFetching ? (
                <CircularProgress size="20px" />
              ) : (
                "Create a New Account"
              )}
            </button>
            <div id="overallError" style={{ color: "red" }}></div>
            </form>
        </div>
      </div>
    </div>
  );
}