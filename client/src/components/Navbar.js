import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import update from "immutability-helper";
import uniqid from "uniqid";
//import logo from './logo.svg';
//import { SomeContext } from "../App";
//Rename all Boilerplate as your new Component
import "./Navbar.css";
import "../normalize.css";
import "../custom.css";
import { Link } from "react-router-dom";
import Instructions from "./Instructions";
//import styled, { css, ThemeProvider } from 'styled-components';

function Navbar(props) {
  const [property, setProperty] = useState("initialValue");
  const propRef = useRef("initialValue");
  function setPropRef(point) {
    propRef.current = point;
  }

  const [instructions, setInstructions] = useState();

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    addInstructions();
    return () => {};
  }, []);
  //componentDidUpdate, runs after render
  useEffect(() => {}, [property]);
  //componentDismount
  useEffect(() => {
    return () => {};
  });

  function addInstructions() {
    if (!localStorage.getItem("previouslyVisited")) {
      setInstructions(<Instructions />);
      localStorage.setItem("previouslyVisited", "true");
    }
  }

  function instructionsButton() {
    setInstructions(<Instructions key={new Date()} />);
  }

  return (
    <nav className="navigation-bar">
      {instructions}
      <div className="game-modes">
        <label>Game Modes</label>
        <ul className="game-modes-list">
          <li>
            <a href="/2digits">2 Digits</a>
          </li>
          <li>
            <a href="/3digits">3 Digits</a>
          </li>
          <li>
            <a href="/4digits">4 Digits</a>
          </li>
          <li>
            <a href="/5digits">5 Digits</a>
          </li>
          <li>
            <a href="/6digits">6 Digits</a>
          </li>
          <li>
            <a href="/7digits">7 Digits</a>
          </li>
        </ul>
      </div>

      <div className="logo">Numblr</div>

      <ul className="tools">
        <li>
          <button
            className="instructions-btn"
            onClick={instructionsButton}
          ><img src="/images/game/whiteQuestionMark.png" /></button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
