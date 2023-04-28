import React from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const AccessibilityContainer = styled.div`
  display: flex;
  margin-left: 10px;
`;

const LogoutButton = styled.button`
  border: 0;
  outline: 0;
  padding: 8px 1em;
  color: #5A5A5A;
  font-size: 18px;
  font-weight: 500;
  border-radius: 20px;
  background-color: transparent;
  border: 2px solid darkseagreen;
  transition: all 240ms ease-in-out;
  cursor: pointer;

  &:hover {
    color: #fff;
    background-color: darkseagreen;
  }

  &:not(:last-of-type) {
    margin-right: 7px;
  }
`;

export default function Accessibility(props) {
  const navigate = useNavigate();
  const {user, dispatch} = useContext(AuthContext);

    const logoutRedirect = () => {
      console.log("in here")
      // user.authenticated=false;
      dispatch({type:"LOGOUT", payload: user})
      navigate('/login');
    };

  return (
    <AccessibilityContainer>
      <LogoutButton onClick={logoutRedirect}>Logout</LogoutButton>
    </AccessibilityContainer>
  );
}