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

  //Used to update the hints used in the game
  const hintsRef = useRef([]);
  function setHintsRef(point) {
    hintsRef.current = point;
  }

  //Used to update the row game is being played on
  const currentRowRef = useRef(0);
  function setCurrentRowRef(point) {
    currentRowRef.current = point;
  }

  //Used to update the keyboard visually
  const [keyboard, setKeyboard] = useState([]);

  //Used to set the colors of the keys on the keyboard
  const keyboardColorsRef = useRef({
    color1: "",
    color2: "",
    color3: "",
    color4: "",
    color5: "",
    color6: "",
    color7: "",
    color8: "",
    color9: "",
    color0: "",
  });
  function setKeyboardColorsRef(point) {
    keyboardColorsRef.current = point;
  }

  //A temporary random number used to test the game
  const targetNumberRef = useRef("");
  function setTargetNumberRef(point) {
    targetNumberRef.current = point;
  }

  //Used to update the animation visually when user types/clicks the keyboard
  const [keyboardAnimation, setKeyboardAnimation] = useState({
    key1: "",
    key2: "",
    key3: "",
    key4: "",
    key5: "",
    key6: "",
    key7: "",
    key8: "",
    key9: "",
    key0: "",
    keyBackspace: "",
    keyEnter: "",
  });

  //Used to set the transition delay on the keyboard keys
  const [transitionDelay, setTransitionDelay] = useState({
    key1: "",
    key2: "",
    key3: "",
    key4: "",
    key5: "",
    key6: "",
    key7: "",
    key8: "",
    key9: "",
    key0: "",
    keyBackspace: "",
    keyEnter: "",
  });

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
    //Setting the target number (this part will be changed later)
    let targetNumber = Math.floor(
      Math.random() * Math.pow(10, props.digits)
    ).toString();
    while (targetNumber.length < props.digits) {
      targetNumber = "0" + targetNumber;
    }
    setTargetNumberRef(targetNumber);
    console.log(targetNumberRef.current);

    //Setting the localStorage for the game or loading it
    if (localStorage.getItem(`game` + props.digits)) {
      updateGameStateFromLocalStorage();
    } else {
      //Sets up the board
      let board = new Array(props.attempts);
      for (let i = 0; i < props.attempts; i++) {
        board[i] = "";
      }
      setBoardStateRef(board);
      //Sets up the hints
      let hintsArr = new Array(props.attempts);
      for (let i = 0; i < props.attempts; i++) {
        hintsArr[i] = "";
      }
      setHintsRef(hintsArr);
      updateLocalStorage();
    }
    updateGameBoard();
    updateKeyboard();
  }

  //Creates the game board for the app. Call it to rerender the board.
  function updateGameBoard() {
    //Creates the rows used during the game
    let rowsTemp = [];
    for (let i = 0; i < props.attempts; i++) {
      let digits = [];
      for (let j = 0; j < props.digits; j++) {
        let digit = (
          <div
            //className={`digit digit-${j}`}
            className={getDigitClassList(i, j)}
            style={{
              animationDelay: 0.05 + 0.2 * props.digits - 0.2 * j + "s",
            }}
            key={"row" + i + "digit" + j}
          >
            {boardStateRef.current[i].slice(j, j + 1)}
          </div>
        );
        digits.push(digit);
      }
      let hint = <div className={getHintClassList(i)} key={"hint" + i}></div>;
      digits.push(hint);
      let row = (
        <span className={`row`} key={"row" + i}>
          {digits}
        </span>
      );
      rowsTemp.push(row);
    }
    setBoard(rowsTemp);
  }

  //Helper function that sets the class list for the digits using the hints
  function getDigitClassList(i, j) {
    let classList = "digit";
    let colorAbbreviation = hintsRef.current[i].slice(j, j + 1);
    if (colorAbbreviation) {
      switch (colorAbbreviation) {
        case "X": {
          classList += " grey";
          break;
        }
        case "G": {
          classList += " green";
          break;
        }
        case "Y": {
          classList += " yellow";
          break;
        }
      }
    }
    let hintAbbreviation = hintsRef.current[i];
    if (hintAbbreviation) {
      switch (hintAbbreviation[props.digits]) {
        case "L": {
          classList += " lower";
          break;
        }
        case "H": {
          classList += " higher";
          break;
        }
        case "E": {
          classList += " equals";
          break;
        }
      }
    }
    return classList;
  }

  //Helper function that sets the class list for the hint box to the right
  function getHintClassList(i) {
    let classList = "hint";
    let hintAbbreviation = hintsRef.current[i];
    if (hintAbbreviation) {
      switch (hintAbbreviation[props.digits]) {
        case "L": {
          classList += " lower";
          break;
        }
        case "H": {
          classList += " higher";
          break;
        }
        case "E": {
          classList += " equals";
          break;
        }
      }
    }
    return classList;
  }

  //Helper function for setting the game state to the local storage
  function updateLocalStorage() {
    let gameState = {
      board: boardStateRef.current,
      currentRow: currentRowRef.current,
      hints: hintsRef.current,
    };
    localStorage.setItem(`game` + props.digits, JSON.stringify(gameState));
  }

  //Helper function that loads the game state from localStorage when user revists the page
  function updateGameStateFromLocalStorage() {
    let storage = localStorage.getItem("game" + props.digits);
    if (storage) {
      let storageObj = JSON.parse(storage);
      setBoardStateRef(storageObj.board);
      setHintsRef(storageObj.hints);
      setCurrentRowRef(storageObj.currentRow);
      changeKeyboardColors();
    }
  }

  //Used to set up the keyboard on each render
  function updateKeyboard() {
    let keyboardHTML = (
      <div className="keyboard">
        <div className="number-inputs">
          <button
            className={"number-input" + keyboardColorsRef.current["color1"]}
            style={{
              animation: keyboardAnimation[`key1`],
              transitionDelay: transitionDelay["key1"],
            }}
            onClick={() => inputNumber(1)}
          >
            1
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color2"]}
            style={{
              animation: keyboardAnimation[`key2`],
              transitionDelay: transitionDelay["key2"],
            }}
            onClick={() => inputNumber(2)}
          >
            2
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color3"]}
            style={{
              animation: keyboardAnimation[`key3`],
              transitionDelay: transitionDelay["key3"],
            }}
            onClick={() => inputNumber(3)}
          >
            3
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color4"]}
            style={{
              animation: keyboardAnimation[`key4`],
              transitionDelay: transitionDelay["key4"],
            }}
            onClick={() => inputNumber(4)}
          >
            4
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color5"]}
            style={{
              animation: keyboardAnimation[`key5`],
              transitionDelay: transitionDelay["key5"],
            }}
            onClick={() => inputNumber(5)}
          >
            5
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color6"]}
            style={{
              animation: keyboardAnimation[`key6`],
              transitionDelay: transitionDelay["key6"],
            }}
            onClick={() => inputNumber(6)}
          >
            6
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color7"]}
            style={{
              animation: keyboardAnimation[`key7`],
              transitionDelay: transitionDelay["key7"],
            }}
            onClick={() => inputNumber(7)}
          >
            7
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color8"]}
            style={{
              animation: keyboardAnimation[`key8`],
              transitionDelay: transitionDelay["key8"],
            }}
            onClick={() => inputNumber(8)}
          >
            8
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color9"]}
            style={{
              animation: keyboardAnimation[`key9`],
              transitionDelay: transitionDelay["key9"],
            }}
            onClick={() => inputNumber(9)}
          >
            9
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color0"]}
            style={{
              animation: keyboardAnimation[`key0`],
              transitionDelay: transitionDelay["key0"],
            }}
            onClick={() => inputNumber(0)}
          >
            0
          </button>
          <button
            className={"backspace"}
            style={{ animation: keyboardAnimation[`keyBackspace`] }}
            onClick={backspace}
          ></button>
        </div>

        <button
          className={"enter-guess"}
          style={{ animation: keyboardAnimation[`keyEnter`] }}
          onClick={checkGuess}
        >
          Enter
        </button>

        <button className="reset-game" onClick={resetGame}>
          Reset
        </button>
      </div>
    );
    setKeyboard(keyboardHTML);
  }

  //Used to set the colors on the keyboard at the bottom of the game
  function changeKeyboardColors() {
    let boardStateCopy = boardStateRef.current;
    let hintsCopy = hintsRef.current;
    let colorsObj = {
      color1: "",
      color2: "",
      color3: "",
      color4: "",
      color5: "",
      color6: "",
      color7: "",
      color8: "",
      color9: "",
      color0: "",
    };

    let noRows = 0;
    while (boardStateCopy[noRows] != "" && noRows < props.attempts) {
      noRows++;
    }

    for (let i = 0; i < noRows; i++) {
      for (let j = 0; j < props.digits; j++) {
        let hint = hintsCopy[i];
        let letter = hint[j];
        let boardStateRow = boardStateCopy[i];
        let number = boardStateRow[j];

        if (colorsObj["color" + number] == " green") {
          //Do nothing
        } else if (colorsObj["color" + number] == " yellow") {
          if (letter == "G") {
            colorsObj["color" + number] = " green";
          }
        } else if (colorsObj["color" + number] == " grey") {
          if (letter == "G") {
            colorsObj["color" + number] = " green";
          } else if (letter == "Y") {
            colorsObj["color" + number] = " yellow";
          }
        } else {
          if (letter == "G") {
            colorsObj["color" + number] = " green";
          } else if (letter == "Y") {
            colorsObj["color" + number] = " yellow";
          } else if (letter == "X") {
            colorsObj["color" + number] = " grey";
          }
        }
      }
    }
    setKeyboardColorsRef(colorsObj);
    updateKeyboard();
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

  //Sets the keydown animation for the given key
  function keydownAnimation(keyName) {
    //Animation
    let keydownAnimationCopy = keyboardAnimation;
    keydownAnimationCopy[keyName] = ``;
    setKeyboardAnimation(keydownAnimationCopy);
    updateKeyboard();
    let timeout = setTimeout(() => {
      let keydownAnimationCopy = keyboardAnimation;

      keydownAnimationCopy[keyName] = `keydown .5s`;

      setKeyboardAnimation(keydownAnimationCopy);
      updateKeyboard();
    }, 1);
  }

  //Handles number input, also used when pressing keys
  function inputNumber(n) {
    if (boardStateRef.current[currentRowRef.current].length < props.digits) {
      let copy = boardStateRef.current;
      copy[currentRowRef.current] += n;
      setBoardStateRef(copy);
      updateGameBoard();
      updateLocalStorage();
      keydownAnimation("key" + n);
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
      updateGameBoard();
      updateLocalStorage();
      keydownAnimation("keyBackspace");
    }
  }

  //Checks the users guess
  function checkGuess() {
    if (boardStateRef.current[currentRowRef.current].length == props.digits) {
      keydownAnimation("keyEnter");
      let result = checkNumber(boardStateRef.current[currentRowRef.current]);

      let hintsCopy = hintsRef.current;
      hintsCopy[currentRowRef.current] = result;
      setHintsRef(hintsCopy);

      addTransitionDelay();
      removeTransitionDelay();
      changeKeyboardColors();
      updateGameBoard();
      updateLocalStorage();


      //keydownAnimation("keyEnter");
      if (result == "GGGGGE") {
        victory();
      } else {
        if (currentRowRef != props.guesses - 1) {
          guessAnimation(result);
          setCurrentRowRef(currentRowRef.current + 1);
          updateLocalStorage();
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

  //Helper function that adds a transition delay to the keys on the keyboard so they change as gameboard changes
  function addTransitionDelay() {
    let transitionDelayCopy = transitionDelay;
    let number = boardStateRef.current[currentRowRef.current];
    for (let i = 0; i < props.digits; i++) {
      transitionDelayCopy[`key` + number[i]] =
        0.55 + (props.digits - 1) * 0.2 - i * 0.2 + "s";
    }
    setTransitionDelay(transitionDelayCopy);
  }

  function removeTransitionDelay() {
    setTransitionDelay({
      key1: "0s",
      key2: "0s",
      key3: "0s",
      key4: "0s",
      key5: "0s",
      key6: "0s",
      key7: "0s",
      key8: "0s",
      key9: "0s",
      key0: "0s",
      keyBackspace: "0s",
      keyEnter: "0s",
    });
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

  //Resets the game. Good for testing purposes. Will eventually be removed.
  function resetGame() {
    localStorage.removeItem("game" + props.digits);
    setCurrentRowRef(0);
    setupGame();
    changeKeyboardColors();
  }

  return (
    <main className="game-container">
      <div className="gameboard">
        <div className="headline">
          <div className="instructions">
            Guess from 0 - {Math.pow(10, props.digits) - 1}
          </div>
          <div
            className="hint-caption"
            style={{ paddingRight: `${10 * (4 - props.digits) + 6}%` }}
          >
            Hint
          </div>
        </div>

        <div className="rows">{board}</div>
        {keyboard}
      </div>
    </main>
  );
}

export default NumberGame;
