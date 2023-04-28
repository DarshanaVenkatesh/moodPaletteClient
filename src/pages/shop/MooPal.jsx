import React from 'react'
import NavBar from "../navbar/index"
import OutfitCard from "./outfit"
import Grid from '@mui/material/Grid';
import { useState, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";

const MooPalShop = () => {
  const { user } = useContext(AuthContext);
  const currentOutfit = user.mooPalOutfit;
  const purchasedOutfits = user.outfitInventory ? user.outfitInventory : [];
  const [helpText, setHelpText] = useState("?");

  const displayHelp = () => {
    setHelpText("Welcome to MooMart! Here, you can purchase different outfits to dress your Moo Pal to your liking!")
  }

  const displayQuestion = () => {
    setHelpText("?");
  }


  function setStatus(index) {
    if (index == currentOutfit) {
      return "Current outfit!"
    }
    if (purchasedOutfits.includes(index)) {
      return "Set as outfit!"
    }
    else {
      return "Purchase!"
    }
  }
  
  return (
    <div>
    {<NavBar></NavBar>}
    <br></br>
    <center>
    <h1>Welcome to the MooMart!</h1>  
    <br />
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <OutfitCard id={21} outfitName="Cow" outfitIndex={20} cost={0} status={setStatus(20)}></OutfitCard>
      </Grid>
      <Grid item xs={4}>
        <OutfitCard id={1} outfitName="Party Pal" outfitIndex={0} cost={20} status={setStatus(0)}></OutfitCard>
      </Grid>
      <Grid item xs={4}>
        <OutfitCard id={3} outfitName="Cow-ntess" outfitIndex={2} cost={35} status={setStatus(2)}></OutfitCard>
      </Grid>
      <Grid item xs={4}>
        <OutfitCard id={5} outfitName="Cowcow" outfitIndex={4} cost={45} status={setStatus(4)}></OutfitCard>
      </Grid>
      <Grid item xs={4}>
        <OutfitCard id={7} outfitName="Moo-nacle" outfitIndex={6} cost={50} status={setStatus(6)}></OutfitCard>
      </Grid>
      <Grid item xs={4}>
        <OutfitCard id={9} outfitName="Cow Worker" outfitIndex={8} cost={65} status={setStatus(8)}></OutfitCard>
      </Grid>
      <Grid item xs={4}>
        <OutfitCard id={11} outfitName="Mooster Chef" outfitIndex={10} cost={85} status={setStatus(10)}></OutfitCard>
      </Grid>
      <Grid item xs={4}>
        <OutfitCard id={13} outfitName="Kevin Moorant" outfitIndex={12} cost={110} status={setStatus(12)}></OutfitCard>
      </Grid>
      <Grid item xs={4}>
        <OutfitCard id={15} outfitName="Kung Fu Cow" outfitIndex={14} cost={150} status={setStatus(14)}></OutfitCard>
      </Grid>
      <Grid item xs={4}>
        <OutfitCard id={17} outfitName="Doja Cow" outfitIndex={16} cost={195} status={setStatus(16)}></OutfitCard>
      </Grid>
      <Grid item xs={4}>
        <OutfitCard id={19} outfitName="Discow" outfitIndex={18} cost={250} status={setStatus(18)}></OutfitCard>
      </Grid>
    </Grid>
    </center>
    <div className="helpButton" onMouseOver={displayHelp} onMouseOut={displayQuestion}>{helpText}</div>
   </div>
  )
}

export default MooPalShop