import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import './outfit.css'
import moolah from './moolah.png';
import partyprimary from './outfits/party-primary.png'
import partysecondary from './outfits/party-secondary.png'
import crownprimary from './outfits/crown-primary.png'
import crownsecondary from './outfits/crown-secondary.png'
import cowboyprimary from './outfits/cowboy-primary.png'
import cowboysecondary from './outfits/cowboy-secondary.png'
import fancyprimary from './outfits/fancy-primary.png'
import fancysecondary from './outfits/fancy-secondary.png'
import employeeprimary from './outfits/employee-primary.png'
import employeesecondary from './outfits/employee-secondary.png'
import chefprimary from './outfits/chef-primary.png'
import chefsecondary from './outfits/chef-secondary.png'
import sportsprimary from './outfits/sports-primary.png'
import sportssecondary from './outfits/sports-secondary.png'
import ninjaprimary from './outfits/ninja-primary.png'
import ninjasecondary from './outfits/ninja-secondary.png'
import popstarprimary from './outfits/popstar-primary.png'
import popstarsecondary from './outfits/popstar-secondary.png'
import discoprimary from './outfits/disco-primary.png'
import discosecondary from './outfits/disco-secondary.png'
import cow from './outfits/cow.png'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function OutfitCard(props) {
  const outfits = [partyprimary, partysecondary, crownprimary, crownsecondary, cowboyprimary, cowboysecondary, fancyprimary, fancysecondary, employeeprimary, employeesecondary, chefprimary, chefsecondary, sportsprimary, sportssecondary, ninjaprimary, ninjasecondary, popstarprimary, popstarsecondary, discoprimary, discosecondary, cow]
  const [outfitIndex, setOutfitIndex] = useState(props.outfitIndex + 1)
  const [outfit, setOutfit] = useState(outfits[props.outfitIndex])
  //console.log("outfit:", outfitIndex)
  //let balance = 85;
  const { user } = useContext(AuthContext);
  let mooLahs = user.mooLahs;
  const notify = (amt) => {
    toast(`Deducting ${amt} MooLahs from your account!`);
  }

  

  const [ dummy, setDummy ] = React.useState(true);
  const [ notEnough, setNotEnough ] = React.useState(false);
  const [ enough, setEnough ] = React.useState(false);

  useEffect(() => {
    const setDisabled = () => {
      var currentCard = document.getElementById(user.mooPalOutfit)
      currentCard.disabled = true

      var currentCard = document.getElementById(user.mooPalOutfit + 1)
      currentCard.style.background = "lightblue"
    };
    setDisabled();
  }, []);

  const handleButtonClickNotEnough = () => {
      setNotEnough(true);
      setDummy(false);
      setTimeout(() => {
          setNotEnough(false);
          setDummy(true);
      }, 3000);
  }

  const handleButtonClickEnough = () => {
    setEnough(true);
    setDummy(false);

    // deduct from moo lah and notify
    const amt = props.cost
    mooLahs = mooLahs-amt;
    // update user
    try {
      axios.put("/users/" + user._id, { mooLahs: mooLahs });
      // update local storage
  
        // update user object for this page
        user.mooLahs = mooLahs;
        
        // update user object in local (browser) storage
        const newUser = JSON.parse(localStorage.getItem("user"))
        newUser.mooLahs = mooLahs;
        localStorage.setItem("user", JSON.stringify(newUser))
        
        notify(amt);
        setTimeout(function(){
          window.location.reload(false);
        }, 2000);
        //toast("You earned 5 MooLahs for filling out todays daily entry! Hooray!");
        
    } catch (err) {
      console.log("error with adding mooLahs");
    }


    addOutfitToInventory();
    setTimeout(() => {
        setEnough(false);
        setDummy(true);
    }, 3000);
  }

  async function addOutfitToInventory() {
    var inventoryOutfitIndex = outfitIndex;
    if (outfitIndex % 2 === 1) {
      inventoryOutfitIndex -= 1
    }

    const newOutfit = {
        username: user.username,
        outfitIndex: inventoryOutfitIndex
    };

    //update DB
    await axios.post("/users/addOutfitToInventory", newOutfit)

    // update user object for this page
    user.outfitInventory.push(inventoryOutfitIndex)
    
    // update user object in local (browser) storage
    const newUser = JSON.parse(localStorage.getItem("user"))
    newUser["outfitInventory"].push(inventoryOutfitIndex)
    localStorage.setItem("user", JSON.stringify(newUser))

    // update buttons
    var newCard = document.getElementById(props.outfitIndex)
    newCard.innerHTML = "Set as outfit!"
  }

  const move = () => {
    setOutfitIndex(((outfitIndex + 1) % 2) + props.outfitIndex)
    console.log("on toggle:", outfitIndex);
    setOutfit(outfits[outfitIndex])
  }

  const [selectedButtonIndex, setSelectedButtonIndex] = useState(-1);

  const purchase = () => {
    console.log("hi")
    //setSelectedButtonIndex(index);
    var currentCard = document.getElementById(props.outfitIndex)
    if (currentCard.innerHTML === "Purchase!") {
      if (mooLahs < props.cost) {
        handleButtonClickNotEnough()
      }
      else {
        handleButtonClickEnough()
      }
    }
    else if (currentCard.innerHTML === "Set as outfit!") {
      setAsOutfit();
    }
  }

  async function setAsOutfit() {
    var currentOutfitIndex = outfitIndex;
    if (outfitIndex % 2 === 1) {
      currentOutfitIndex -= 1
    }
    var oldOutfitIndex = user.mooPalOutfit

    const currentOutfit = {
        username: user.username,
        outfitIndex: currentOutfitIndex
    };

    //update DB
    await axios.post("/users/updateCurrentOutfit", currentOutfit)

    // update user object for this page
    user.mooPalOutfit = currentOutfitIndex
    
    // update user object in local (browser) storage
    const newUser = JSON.parse(localStorage.getItem("user"))
    newUser["mooPalOutfit"] = currentOutfitIndex
    localStorage.setItem("user", JSON.stringify(newUser))

    // update buttons
    var newCard = document.getElementById(props.outfitIndex)
    newCard.disabled = true
    newCard.innerHTML = "Current outfit!"

    var newCard = document.getElementById(props.outfitIndex + 1)
    console.log(newCard)
    newCard.style.background = "lightblue"

    var oldCard = document.getElementById(oldOutfitIndex)
    oldCard.disabled = false
    oldCard.innerHTML = "Set as outfit!"

    var oldCard = document.getElementById(oldOutfitIndex + 1)
    oldCard.style.background  = "white"
    window.location.reload()
  }

  return (
    <Card id={props.id} Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 288 }}
        image={outfit}
      />
      <CardActions>
        {props.outfitIndex !== 20 && <button onClick={move}>{'<'}</button>}
        {notEnough && <div className='alert-container'>
              <div className='alert-inner' style={{color: "red"}}>Not enough moo lahs!</div>
          </div>}
        {enough && <div className='alert-container'>
            <div className='alert-inner' style={{color: "green"}}>Purchased!</div>
        </div>}
        {dummy && <div className='alert-container'>
        </div>}
        {props.outfitIndex !== 20 && <button onClick={move}>{'>'}</button>}
      </CardActions>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          <h3>{props.outfitName}</h3>
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          <p>{props.cost} <img src={moolah}/></p>
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
        <button id={props.outfitIndex} 
                onClick={purchase} 
                style={{
                  backgroundColor: 'darkseagreen', color: 'white'
                }}>
          {props.status}
        </button>        
      </CardActions>
      <ToastContainer autoClose={2000}></ToastContainer>
    </Card>
  );
}

export default OutfitCard;