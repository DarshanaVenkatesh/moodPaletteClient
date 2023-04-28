import styled from "styled-components";
import NavLinks from "./navLinks";
import { useMediaQuery } from "react-responsive";
import Accessibility from "./accessibility";
import Logo from "./logo";
import React, { useState } from "react";
import MenuToggle from "./menuToggle";

const NavBarOuterContainer = styled.div`
`;

const NavBarContainer = styled.div`
    width: 100%;
    height: 100px;
    box-shadow: 0 1px 3px rgba(15, 15, 15, 0.13);
    display: flex;
    align-items: center;
    padding: 0 1.5em;
    box-sizing: border-box;
    margin-top: 50px;
`;

const LeftSection = styled.div`
    display: flex;
`;

const MiddleSection = styled.div`
    display: flex;
    flex: 2;
    height: 100%;
    justify-content: center;
`;

const RightSection = styled.div`
    display: flex;
`;

const NavButtonContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const MobileNavContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const LinksWrapper = styled.ul`
  display: flex;
  height: 100%;
  list-style: none;
  background-color: ;
  width: 100%;
  flex-direction: column;
  top: 65px;
  left: 0;
`;

const LinkItem = styled.li`
  width: 100%;
  padding: 0 1.1em;
  color: #5A5A5A;
  font-weight: 400;
  font-size: 18px;
  display: flex;
  margin-bottom: 15px;
  transition: all 220ms ease-in-out;

  &:hover {
    font-weight: 700;
    color: #000000;
  }
`;

const Link = styled.a`
  text-decoration: none;
  color: inherit;
  font-size: inherit;
`;

const Marginer = styled.div`
  height: 2em;
`;
const DeviceSize = {
    mobile: 768,
    tablet: 992,
    laptop: 1324,
    desktop: 2024,
};

export default function NavBar(props) {
    const isMobile = useMediaQuery({maxWidth: DeviceSize.tablet});
    const [isOpen, setOpen] = useState(false);
    return <NavBarOuterContainer>
        <NavBarContainer>
            <LeftSection>
                <Logo />
            </LeftSection>
            <MiddleSection>
                {!isMobile && <NavLinks></NavLinks>}
            </MiddleSection>
            <RightSection>
                {!isMobile && <Accessibility />}
                {isMobile && <NavButtonContainer>
                    <MenuToggle isOpen={isOpen} toggle={() => setOpen(!isOpen)} />
                </NavButtonContainer>}
            </RightSection>
        </NavBarContainer>
        {isMobile && <MobileNavContainer>
            {isOpen && <LinksWrapper>
                    <LinkItem><Link href="/calendar-view">Calendar View</Link></LinkItem>
                    <LinkItem><Link href="/habit">Habit Tracker</Link></LinkItem>
                    <LinkItem><Link href="/shop">MooMart</Link></LinkItem>
                    <LinkItem><Link href="/profile">My Profile</Link></LinkItem>
                    <Accessibility />
                </LinksWrapper>}
        </MobileNavContainer>}
    </NavBarOuterContainer>
}
