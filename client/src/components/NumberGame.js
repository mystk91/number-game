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

  //Used to indicate if the game is still being played, ended in victory, or in defeat
  //Called 'status' in local storage
  //Should be either `playing`, `victory`, or `defeat`
  const gameStatusRef = useRef(`playing`);
  function setGameStatusRef(point) {
    gameStatusRef.current = point;
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
  const keyboardAnimationRef = useRef({
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
  function setKeyboardAnimationRef(point) {
    keyboardAnimationRef.current = point;
  }

  //Used to set the transition delay on the keyboard keys
  const transitionDelayRef = useRef({
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
  function setTransitionDelayRef(point) {
    transitionDelayRef.current = point;
  }

  //Used so animations will only occurs when a new row is moved to
  const newRowRef = useRef(false);
  function setNewRowRef(point) {
    newRowRef.current = point;
  }

  //Used to display error messages when user inputs an invalid number
  const errorMessagesRef = useRef([]);
  function setErrorMessagesRef(point) {
    errorMessagesRef.current = point;
  }

  const [errorMessagesDiv, setErrorMessagesDiv] = useState();
  //Used to add the error-animation class in the spans indicating the rows
  const errorAnimationRef = useRef(false);
  function setErrorAnimationRef(point) {
    errorAnimationRef.current = point;
  }

  //Used to set the class name for the keyboard.
  //It will be set to `keyboard disabled` when the game is over so it won't take inputs
  const keyboardClassNameRef = useRef(`keyboard`);
  function setKeyboardClassNameRef(point) {
    keyboardClassNameRef.current = point;
  }

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    setupGame();
    if (gameStatusRef.current == `playing`) {
      document.addEventListener("keydown", handleKeydown);
    } else {
      disableGame();
    }

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  function setupGame() {
    //Setting the localStorage for the game or loading it
    if (localStorage.getItem(`game` + props.digits)) {
      updateGameStateFromLocalStorage();
    } else {
      //Setting the target number (this part will be changed later)
      let targetNumber = Math.floor(
        Math.random() * Math.pow(10, props.digits)
      ).toString();
      while (targetNumber.length < props.digits) {
        targetNumber = "0" + targetNumber;
      }
      setTargetNumberRef(targetNumber);
      console.log(targetNumberRef.current);
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
        <span className={getRowClassList(i)} key={"row" + i}>
          {digits}
        </span>
      );
      rowsTemp.push(row);
    }
    setBoard(rowsTemp);
  }

  //Helper function that sets the class list for the spans containing the rows.
  //Used to designate the current row.
  function getRowClassList(i) {
    let classList = "";
    if (i > currentRowRef.current) {
      classList += "empty-row";
    } else if (i < currentRowRef.current) {
      classList += "previous-row";
    } else {
      classList += "current-row";
      if (errorAnimationRef.current == true) {
        classList += " error-animation";
        setErrorAnimationRef(false);
      }
    }
    return classList;
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
    } else {
      if (i == currentRowRef.current) {
        if (boardStateRef.current[i].length < j) {
          classList += " next-digit";
        } else if (boardStateRef.current[i].length > j) {
          classList += " previous-digit";
        } else {
          classList += " current-digit";
        }

        if (newRowRef.current == true) {
          classList += " new-row";
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
    if (i == currentRowRef.current) {
      if (newRowRef.current == true) {
        classList += " new-row";
        setNewRowRef(false);
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
      status: gameStatusRef.current,
      targetNumber: targetNumberRef.current,
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
      setGameStatusRef(storageObj.status);
      setTargetNumberRef(storageObj.targetNumber);
      changeKeyboardColors();
    }
  }

  //Used to set up the keyboard on each render
  function updateKeyboard() {
    let keyboardHTML = (
      <div className={keyboardClassNameRef.current}>
        <div className="number-inputs">
          <button
            className={"number-input" + keyboardColorsRef.current["color1"]}
            style={{
              animation: keyboardAnimationRef.current[`key1`],
              transitionDelay: transitionDelayRef.current["key1"],
            }}
            onClick={() => inputNumber(1)}
          >
            1
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color2"]}
            style={{
              animation: keyboardAnimationRef.current[`key2`],
              transitionDelay: transitionDelayRef.current["key2"],
            }}
            onClick={() => inputNumber(2)}
          >
            2
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color3"]}
            style={{
              animation: keyboardAnimationRef.current[`key3`],
              transitionDelay: transitionDelayRef.current["key3"],
            }}
            onClick={() => inputNumber(3)}
          >
            3
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color4"]}
            style={{
              animation: keyboardAnimationRef.current[`key4`],
              transitionDelay: transitionDelayRef.current["key4"],
            }}
            onClick={() => inputNumber(4)}
          >
            4
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color5"]}
            style={{
              animation: keyboardAnimationRef.current[`key5`],
              transitionDelay: transitionDelayRef.current["key5"],
            }}
            onClick={() => inputNumber(5)}
          >
            5
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color6"]}
            style={{
              animation: keyboardAnimationRef.current[`key6`],
              transitionDelay: transitionDelayRef.current["key6"],
            }}
            onClick={() => inputNumber(6)}
          >
            6
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color7"]}
            style={{
              animation: keyboardAnimationRef.current[`key7`],
              transitionDelay: transitionDelayRef.current["key7"],
            }}
            onClick={() => inputNumber(7)}
          >
            7
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color8"]}
            style={{
              animation: keyboardAnimationRef.current[`key8`],
              transitionDelay: transitionDelayRef.current["key8"],
            }}
            onClick={() => inputNumber(8)}
          >
            8
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color9"]}
            style={{
              animation: keyboardAnimationRef.current[`key9`],
              transitionDelay: transitionDelayRef.current["key9"],
            }}
            onClick={() => inputNumber(9)}
          >
            9
          </button>
          <button
            className={"number-input" + keyboardColorsRef.current["color0"]}
            style={{
              animation: keyboardAnimationRef.current[`key0`],
              transitionDelay: transitionDelayRef.current["key0"],
            }}
            onClick={() => inputNumber(0)}
          >
            0
          </button>
          <button
            className={"backspace"}
            style={{ animation: keyboardAnimationRef.current[`keyBackspace`] }}
            onClick={backspace}
          ></button>
        </div>

        <button
          className={"enter-guess"}
          style={{ animation: keyboardAnimationRef.current[`keyEnter`] }}
          onClick={checkGuess}
        >
          Enter
        </button>
      </div>
    );
    setKeyboard(keyboardHTML);
  }

  //Used to set the colors on the keyboard at the bottom of the game
  function changeKeyboardColors() {
    let boardStateCopy = [];
    Object.values(boardStateRef.current).map((x) => {
      boardStateCopy.push(x);
    });
    let hintsCopy = [];
    Object.values(hintsRef.current).map((x) => {
      hintsCopy.push(x);
    });
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
    let keyboardAnimationCopy = [];
    Object.entries(keyboardAnimationRef.current).map((x) => {
      keyboardAnimationCopy[x[0]] = x[1];
    });
    keyboardAnimationCopy[keyName] = ``;
    setKeyboardAnimationRef(keyboardAnimationCopy);
    updateKeyboard();
    let timeout = setTimeout(() => {
      let keyboardAnimationCopy = [];
      Object.entries(keyboardAnimationRef.current).map((x) => {
        keyboardAnimationCopy[x[0]] = x[1];
      });
      if (keyName != "keyEnter") {
        keyboardAnimationCopy[keyName] = `keydown .5s`;
      } else {
        keyboardAnimationCopy[keyName] = `keydown .3s`;
      }
      setKeyboardAnimationRef(keyboardAnimationCopy);
      updateKeyboard();
      setTimeout(() => {
        let keyboardAnimationCopy = [];
        Object.entries(keyboardAnimationRef.current).map((x) => {
          keyboardAnimationCopy[x[0]] = x[1];
        });
        keyboardAnimationCopy[keyName] = ``;
        setKeyboardAnimationRef(keyboardAnimationCopy);
        updateKeyboard();
      }, 500);
    }, 1);
  }

  //Handles number input, also used when pressing keys
  function inputNumber(n) {
    if (boardStateRef.current[currentRowRef.current].length < props.digits) {
      let boardStateCopy = [];
      Object.values(boardStateRef.current).map((x) => {
        boardStateCopy.push(x);
      });
      boardStateCopy[currentRowRef.current] += n;
      setBoardStateRef(boardStateCopy);
      updateGameBoard();
      updateLocalStorage();
      keydownAnimation("key" + n);
    }
  }

  //Handles backpace key
  function backspace() {
    if (boardStateRef.current[currentRowRef.current].length > 0) {
      let boardStateCopy = [];
      Object.values(boardStateRef.current).map((x) => {
        boardStateCopy.push(x);
      });
      boardStateCopy[currentRowRef.current] = boardStateCopy[
        currentRowRef.current
      ].slice(0, boardStateCopy[currentRowRef.current].length - 1);
      setBoardStateRef(boardStateCopy);
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

      let hintsCopy = [];
      Object.values(hintsRef.current).map((x) => {
        hintsCopy.push(x);
      });
      hintsCopy[currentRowRef.current] = result;
      setHintsRef(hintsCopy);

      let correctResult = "";
      for (let i = 0; i < props.digits; i++) {
        correctResult += "G";
      }
      correctResult += "E";

      if (result == correctResult) {
        setGameStatusRef(`victory`);
        disableGame();
        addTransitionDelay();
        changeKeyboardColors();
        removeTransitionDelay();
        updateGameBoard();
        updateLocalStorage();
      } else {
        if (currentRowRef.current != props.attempts - 1) {
          addTransitionDelay();
          changeKeyboardColors();
          removeTransitionDelay();
          setCurrentRowRef(currentRowRef.current + 1);
          setNewRowRef(true);
          updateGameBoard();
          updateLocalStorage();
        } else {
          setGameStatusRef(`defeat`);
          disableGame();
          addTransitionDelay();
          changeKeyboardColors();
          removeTransitionDelay();
          updateGameBoard();
          updateLocalStorage();
        }
      }
    } else {
      updateGameBoard();
      setTimeout(() => {
        invalidGuess();
        setTimeout(() => {
          updateGameBoard();
        }, 400);
      }, 1);
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
  //Occurs after a guess is entered
  function addTransitionDelay() {
    let transitionDelayCopy = {};
    Object.entries(transitionDelayRef).map((x) => {
      transitionDelayCopy[x[0]] = x[1];
    });
    let number = boardStateRef.current[currentRowRef.current];
    for (let i = 0; i < props.digits; i++) {
      transitionDelayCopy[`key` + number[i]] =
        0.4 + (props.digits - 1) * 0.2 - i * 0.2 + "s";
    }
    setTransitionDelayRef(transitionDelayCopy);
  }

  //Removes the transition delay
  //Occurs after a guess is entered
  function removeTransitionDelay() {
    let transitionDelayCopy = {};
    Object.entries(transitionDelayRef).map((x) => {
      transitionDelayCopy[x[0]] = x[1];
    });
    let number = boardStateRef.current[currentRowRef.current];
    for (let i = 0; i < props.digits; i++) {
      transitionDelayCopy[`key` + number[i]] = "";
    }
    setTransitionDelayRef(transitionDelayCopy);
  }

  //Displays an error message and plays an animation when user has invalid length input
  async function invalidGuess() {
    if (errorMessagesRef.current.length < 4) {
      updateGameBoard();
      setErrorAnimationRef(true);
      let errorMessagesCopy = [];
      Object.values(errorMessagesRef.current).map((x) => {
        errorMessagesCopy.push(x);
      });
      let message = (
        <span className="error-message" key={uniqid()}>
          Enter a {props.digits} digit number
        </span>
      );
      errorMessagesCopy.push(message);
      setErrorMessagesRef(errorMessagesCopy);
      let errorMessageDivHTML = (
        <div
          className="error-messages"
          style={{
            inset: 70 + 92 * (currentRowRef.current + 1) + "px 50% 0% 0%",
          }}
        >
          {errorMessagesRef.current}
        </div>
      );
      setErrorMessagesDiv(errorMessageDivHTML);
      updateGameBoard();
      setTimeout(() => {
        let errorMessagesCopy = [];
        Object.values(errorMessagesRef.current).map((x) => {
          errorMessagesCopy.push(x);
        });
        errorMessagesCopy.shift();
        setErrorMessagesRef(errorMessagesCopy);
        let errorMessageDivHTML = (
          <div
            className="error-messages"
            style={{
              inset: 70 + 92 * (currentRowRef.current + 1) + "px 50% 0% 0%",
            }}
          >
            {errorMessagesRef.current}
          </div>
        );
        if (errorMessagesCopy.length == 0) {
          setErrorMessagesDiv();
        } else {
          setErrorMessagesDiv(errorMessageDivHTML);
        }
      }, 1500);
    }
  }

  //Occurs when the user wins
  function victory() {}

  //Occurs when user runs out of guesses
  function defeat() {}

  //Disables the game after the player wins or loses
  function disableGame() {
    document.removeEventListener("keydown", handleKeydown);
    setKeyboardClassNameRef("keyboard disabled");
    updateKeyboard();
  }

  //Resets the game. Good for testing purposes. Will eventually be removed.
  function resetGame() {
    localStorage.removeItem("game" + props.digits);
    setCurrentRowRef(0);
    setKeyboardClassNameRef(`keyboard`);
    if (gameStatusRef.current != `playing`) {
      document.addEventListener("keydown", handleKeydown);
    }
    setGameStatusRef(`playing`);
    setupGame();
    changeKeyboardColors();
  }

  return (
    <main className="game-container">
      <div className="gameboard">
        {errorMessagesDiv}
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
        <button className="reset-game" onClick={resetGame}>
          Reset
        </button>
      </div>
    </main>
  );
}

export default NumberGame;
