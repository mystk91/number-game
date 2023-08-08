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
//Rename all NumberGame as your new Component
import "./NumberGame.css";
import "../normalize.css";
import "../custom.css";
import { Link } from "react-router-dom";
//import styled, { css, ThemeProvider } from 'styled-components';

function NumberGame(props) {
  const [property, setProperty] = useState("initialValue");
  const propRef = useRef("initialValue");
  function setPropRef(point) {
    propRef.current = point;
  }

  const [rows, setRows] = useState([]);

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    setupGame();
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  //componentDidUpdate, runs after render
  useEffect(() => {}, [property]);

  function setupGame() {
    //Creates the rows used during the game
    let rowsTemp = [];
    for (let i = 0; i < props.attempts; i++) {
      let digits = [];
      for (let j = 0; j < props.digits; j++) {
        let digit = (
          <div
            className={`digit digit-${j}`}
            key={"row" + i + "digit" + j}
          ></div>
        );
        digits.push(digit);
      }
      let hint = <div className={`hint hint-${i}`} key={"hint" + i}></div>;
      digits.push(hint);
      let row = (
        <span className={`row row-${i}`} key={"row" + i}>
          {digits}
        </span>
      );
      rowsTemp.push(row);
    }
    setRows(rowsTemp);
  }

  //Handles pressing keys
  function handleKeydown(e) {
    if (isFinite(e.key)) {
      inputNumber(e.key);
    }
    if (e.key == "Backspace") {
      backspace();
    }
    if (e.key == "Enter") {
      checkGuess();
    }
  }

  function inputNumber(n) {}

  function backspace() {}

  function checkGuess() {
    return 3927;
  }

  function invalidGuess() {}

  function guessAnimation() {}

  return (
    <main className="gameboard-container">
      <div className="gameboard">

        <div className='headline'>
           <div className='instructions'>Guess from 1 - {Math.pow(10, props.digits) - 1}</div>
           <div className="hint-caption">Hint</div>
        </div>

        <div className="rows">{rows}</div>

        <div className="keyboard">
          <div className="number-inputs">
            <button className="number-input" onClick={() => inputNumber(1)}>
              1
            </button>
            <button className="number-input" onClick={() => inputNumber(2)}>
              2
            </button>
            <button className="number-input" onClick={() => inputNumber(3)}>
              3
            </button>
            <button className="number-input" onClick={() => inputNumber(4)}>
              4
            </button>
            <button className="number-input" onClick={() => inputNumber(5)}>
              5
            </button>
            <button className="number-input" onClick={() => inputNumber(6)}>
              6
            </button>
            <button className="number-input" onClick={() => inputNumber(7)}>
              7
            </button>
            <button className="number-input" onClick={() => inputNumber(8)}>
              8
            </button>
            <button className="number-input" onClick={() => inputNumber(9)}>
              9
            </button>
            <button className="number-input" onClick={() => inputNumber(0)}>
              0
            </button>
            <button className="backspace" onClick={backspace}></button>
          </div>

          <button className="enter-guess" onClick={checkGuess}>
            Enter
          </button>
        </div>
      </div>
    </main>
  );
}

export default NumberGame;
