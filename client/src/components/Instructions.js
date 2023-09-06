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
import "./Instructions.css";
import "../normalize.css";
import "../custom.css";
import { Link } from "react-router-dom";
//import styled, { css, ThemeProvider } from 'styled-components';


//A modal that will pop-up when a new user visits the page or hits the question mark button.
//Gives a guide on how to play the game. 
function Instructions(props) {
  const [property, setProperty] = useState("initialValue");
  const propRef = useRef("initialValue");
  function setPropRef(point) {
    propRef.current = point;
  }

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    return () => {};
  }, []);
  //componentDidUpdate, runs after render
  useEffect(() => {}, [property]);
  //componentDismount
  useEffect(() => {
    return () => {};
  });

  return (
    <div className="instructions">
      <span className="instructions-top">
        <button className="close-instructions">X</button>
      </span>
      <span className="headline">How to play</span>
      <div className="instructions-text">
        Guess a number between 0 and {Math.pow(10, props.digits) - 1}.
      </div>
      <div className="game-example current-row">
        <div className="digit">4</div>
        <div className="digit">6</div>
        <div className="digit">1</div>
        <div className="digit">8</div>
        <div className="hint"></div>
      </div>
      <div className="instructions-text">
        Arrows tell you to guess higher or lower.
      </div>
      <div className="game-example previous-row">
        <div className="digit green higher">4</div>
        <div className="digit yellow higher">6</div>
        <div className="digit grey higher">1</div>
        <div className="digit grey higher">8</div>
        <div className="hint higher"></div>
      </div>
      <div className="game-example previous-row">
        <div className="digit green lower">4</div>
        <div className="digit yellow lower">6</div>
        <div className="digit grey lower">1</div>
        <div className="digit grey lower">8</div>
        <div className="hint lower"></div>
      </div>
      <div className="instructions-text">
        Colors indicate the spot the digit should be in.
      </div>
      <hr></hr>
      <div className="instructions-text">
        Green digits are in the correct spot.
      </div>
      <div className="game-example">
        <div className="digit green current-digit">4</div>
        <div className="digit">6</div>
        <div className="digit">1</div>
        <div className="digit">8</div>
        <div className="hint"></div>
      </div>
      <div className="instructions-text">
        Yellow digits are in wrong spot.
      </div>
      <div className="game-example">
        <div className="digit">4</div>
        <div className="digit yellow current-digit">6</div>
        <div className="digit">1</div>
        <div className="digit">8</div>
        <div className="hint"></div>
      </div>
      <div className="instructions-text">
        Grey digits are not used again.
      </div>
      <div className="game-example">
        <div className="digit">4</div>
        <div className="digit">6</div>
        <div className="digit grey current-digit">1</div>
        <div className="digit grey current-digit">8</div>
        <div className="hint"></div>
      </div>
    </div>
  );
}

export default Instructions;
