import React, {useState, useContext} from "react"
import {AuthContext} from "../../../context/AuthContext";
import axios from "axios";
import "./dailyQuote.css"
import image from "../colby.png"

import partyprimary from '../../shop/outfits/party-primary.png'
import partysecondary from '../../shop/outfits/party-secondary.png'
import crownprimary from '../../shop/outfits/crown-primary.png'
import crownsecondary from '../../shop/outfits/crown-secondary.png'
import cowboyprimary from '../../shop/outfits/cowboy-primary.png'
import cowboysecondary from '../../shop/outfits/cowboy-secondary.png'
import fancyprimary from '../../shop/outfits/fancy-primary.png'
import fancysecondary from '../../shop/outfits/fancy-secondary.png'
import employeeprimary from '../../shop/outfits/employee-primary.png'
import employeesecondary from '../../shop/outfits/employee-secondary.png'
import chefprimary from '../../shop/outfits/chef-primary.png'
import chefsecondary from '../../shop/outfits/chef-secondary.png'
import sportsprimary from '../../shop/outfits/sports-primary.png'
import sportssecondary from '../../shop/outfits/sports-secondary.png'
import ninjaprimary from '../../shop/outfits/ninja-primary.png'
import ninjasecondary from '../../shop/outfits/ninja-secondary.png'
import popstarprimary from '../../shop/outfits/popstar-primary.png'
import popstarsecondary from '../../shop/outfits/popstar-secondary.png'
import discoprimary from '../../shop/outfits/disco-primary.png'
import discosecondary from '../../shop/outfits/disco-secondary.png'
import cow from '../../shop/outfits/cow.png'

function GetDailyQuote() {
    const [quote,setQuote] = useState('');
    const [author,setAuthor]= useState('');

    pullDailyQuote();

    async function pullDailyQuote() {
        const res = await axios.get("/quote/fetchDailyQuote", {})
        setQuote(res.data.quote_text)
        setAuthor(res.data.quote_author)
    }

    const {user} = useContext(AuthContext);
    const outfits = [partyprimary, partysecondary, crownprimary, crownsecondary, cowboyprimary, cowboysecondary, fancyprimary, fancysecondary, employeeprimary, employeesecondary, chefprimary, chefsecondary, sportsprimary, sportssecondary, ninjaprimary, ninjasecondary, popstarprimary, popstarsecondary, discoprimary, discosecondary, cow]
    const mooPalImg = outfits[user.mooPalOutfit]

    return (
        <div>
            <div className="cow">
                <img className="cowPic" src={mooPalImg}/>
            </div>
            <br />
            <div className="quote">
                <div class="box sb1">
                    {quote}
                    <br/><br/>
                    - {author}
                </div>
            </div>
        </div>
    )
}
export default GetDailyQuote