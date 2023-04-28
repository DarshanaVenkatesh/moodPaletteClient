import React from "react";
import styled from "styled-components";
import MooPalImg from "../shop/outfits/cow.png";
import MooLah from "../shop/moolah.png";
import { Link } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

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

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LogoButton = styled.button`
  width: 110px;
  height: 80px;
  border: none;
  background: none;

  img {
    width: 100%;
    height: 100%;
  }
  cursor: pointer;
`;

const LogoText = styled.h2`
  font-size: 30px;
  margin: 0;
  margin-left: 4px;
  color: #222;
  font-weight: 500;
`;

const PointsText = styled.h2`
  font-size: 20px;
  margin: 0;
  margin-left: 4px;
  color: #222;
  font-weight: 500;
  img {
    position: relative;
    margin: 0;
    top: 5px;
    width: 10%;
    height: 10%;
  }
`;


export default function Logo(props) {
  const { user } = useContext(AuthContext);
  const outfits = [partyprimary, partysecondary, crownprimary, crownsecondary, cowboyprimary, cowboysecondary, fancyprimary, fancysecondary, employeeprimary, employeesecondary, chefprimary, chefsecondary, sportsprimary, sportssecondary, ninjaprimary, ninjasecondary, popstarprimary, popstarsecondary, discoprimary, discosecondary, cow]
  const MooPalImg = outfits[user.mooPalOutfit]
  console.log("moo pal image:", user.mooPalOutfit)
  return (
    <LogoWrapper>
      <Link to="/home">
        <LogoButton>
          <img src={MooPalImg} alt="Cow Logo" />
        </LogoButton>
      </Link>
      <div>
        <LogoText>Mood Palette</LogoText>
        <div>
          <PointsText>Moo Lahs: {user.mooLahs} <img src={MooLah}/></PointsText>
        </div>
      </div>
    </LogoWrapper>
  );
}
