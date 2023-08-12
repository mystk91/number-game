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
  //Used to update the board state visually
  const [board, setBoard] = useState([]);

  //Used to update the board state
  const boardStateRef = useRef([]);
  function setBoardStateRef(point) {
    boardStateRef.current = point;
  }
  //Used to update the row game is being played on
  const currentRowRef = useRef(0);
  function setCurrentRowRef(point) {
    currentRowRef.current = point;
  }

  //A temporary random number used to test the game
  const targetNumberRef = useRef("");
  function setTargetNumberRef(point) {
    targetNumberRef.current = point;
  }

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    setupGame();
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  //componentDidUpdate, runs after render
  //useEffect(() => {}, [property]);

  function setupGame() {
    //Setting the target number
    let targetNumber = Math.floor(
      Math.random() * Math.pow(10, props.digits)
    ).toString();
    while (targetNumber.length < props.digits) {
      targetNumber = "0" + targetNumber;
    }
    setTargetNumberRef(targetNumber);
    console.log(targetNumberRef.current);

    //Setting the localStorage for the game or loading it
    if (localStorage.getItem(`game-` + props.digits)) {
      //This should load the previously started game from local storage
    } else {
      let board = new Array(props.attempts);
      for (let i = 0; i < props.attempts; i++) {
        board[i] = "";
      }
      setBoardStateRef(board);
      updateLocalStorage();
    }

    /*
    //Creates the rows used during the game
    let rowsTemp = [];
    for (let i = 0; i < props.attempts; i++) {
      let digits = [];
      for (let j = 0; j < props.digits; j++) {
        let digit = (
          <div
            className={`digit digit-${j} ` + setColor()}
            key={"row" + i + "digit" + j}
          >{boardStateRef.current[i]}</div>
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

    //Grabs the game state from local storage if user has attempted this puzzle previously
    */
  }

  //Helper function for setting the game state to the local storage
  function updateLocalStorage() {
    let gameState = {
      board: boardStateRef.current,
      currentRow: currentRowRef.current,
    };
    localStorage.setItem(`game-` + props.digits, JSON.stringify(gameState));
  }

  //Handles pressing keys by using different functions
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

  //Handles number input, also used when pressing keys
  function inputNumber(n) {
    if (boardStateRef.current[currentRowRef.current].length < props.digits) {
      let copy = boardStateRef.current;
      copy[currentRowRef.current] += n;
      setBoardStateRef(copy);
      updateLocalStorage();
    }
  }

  //Handles backpace key
  function backspace() {
    if (boardStateRef.current[currentRowRef.current].length > 0) {
      let copy = boardStateRef.current;
      copy[currentRowRef.current] = copy[currentRowRef.current].slice(
        0,
        copy[currentRowRef.current].length - 1
      );
      setBoardStateRef(copy);
      updateLocalStorage();
    }
  }

  //Checks the users guess
  function checkGuess() {
    if (boardStateRef.current[currentRowRef.current].length == props.digits) {
      let result = checkNumber(boardStateRef.current[currentRowRef.current]);
      if (result == "GGGGGE") {
        victory();
      } else {
        if (currentRowRef != props.guesses - 1) {
          guessAnimation(result);
          setCurrentRowRef(currentRowRef.current + 1);
        } else {
          defeat();
        }
      }
    } else {
      invalidGuess();
    }
  }

  //Checks the number against the users guess, returns a string with the colors the blocks should become, ending with hint telling higher or lower
  // ex. 5 digit number,  gyxxxl
  // G - green
  // Y - yellow
  // X - dark grey
  // L - lower, H - higher, E -equals
  function checkNumber(number) {
    let result = "";
    //Compares the number with target number and applies worlde rules to it
    let target = targetNumberRef.current;
    let tempTarget = "";
    for (let i = 0; i < props.digits; i++) {
      if (number[i] == target[i]) {
        tempTarget += "G";
      } else {
        tempTarget += target[i];
      }
    }
    for (let i = 0; i < props.digits; i++) {
      if (tempTarget[i] == "G") {
        result += "G";
      } else if (tempTarget.includes(number[i])) {
        result += "Y";
      } else {
        result += "X";
      }
    }
    //Compares the number with target number numerically and creates a hint
    target = Number(target);
    number = Number(number);
    if (number > target) {
      result += "L";
    } else if (number < target) {
      result += "H";
    } else if (number == target) {
      result += "E";
    }
    console.log(result);
    return result;
  }

  //Plays an animation when user has invalid length input
  function invalidGuess() {
    console.log("invalid guess");
  }

  //Plays an animation when the user has a valid input
  function guessAnimation(result) {}

  //Occurs when the user wins
  function victory() {}

  //Occurs when user runs out of guesses
  function defeat() {}

  return (
    <main className="gameboard-container">
      <div className="gameboard">
        <div className="headline">
          <div className="instructions">
            Guess from 0 - {Math.pow(10, props.digits) - 1}
          </div>
          <div className="hint-caption">Hint</div>
        </div>

        <div className="rows">{board}</div>

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