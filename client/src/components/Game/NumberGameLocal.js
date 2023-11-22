import React, { useState, useEffect, useRef } from "react";
import uniqid from "uniqid";
import "./NumberGame.css";
import "../../normalize.css";
import "../../custom.css";
import Histogram from "./Histogram";
import ShareScore from "./ShareScore";

//Creates a game that stores data using local storage rather than the database
function NumberGameLocal(props) {
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

  //Stores the gameId, used to retrieve the correct number from the database
  const gameIdRef = useRef("");
  function setGameIdRef(point) {
    gameIdRef.current = point;
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
  //This is put at the top of the rows/gameboard to measure its y position on page.
  //This is only being used by the error message when it pops up
  const yPosition = useRef();

  //Used to set the class name for the keyboard.
  //It will be set to `keyboard disabled` when the game is over so it won't take inputs
  const keyboardClassNameRef = useRef(`number-inputs`);
  function setKeyboardClassNameRef(point) {
    keyboardClassNameRef.current = point;
  }

  //Used to display / hide the button at the bottom of the game
  let hideGuessButtonRef = useRef("");
  function setHideGuessButtonRef(point) {
    hideGuessButtonRef.current = point;
  }

  let hideResetButtonRef = useRef("");
  function setHideResetButtonRef(point) {
    hideResetButtonRef.current = point;
  }

  let hideMessageButtonRef = useRef("");
  function setHideMessageButtonRef(point) {
    hideMessageButtonRef.current = point;
  }

  let nextGameAvailableRef = useRef(false);
  function setNextGameAvailableRef(point) {
    nextGameAvailableRef.current = point;
  }

  //A temporary random number used to test the game
  const targetNumberRef = useRef("hidden");
  function setTargetNumberRef(point) {
    targetNumberRef.current = point;
  }

  //The date for the game
  const dateRef = useRef();
  function setDateRef(point) {
    setDateRef.current = point;
  }

  //These functions are used to display / hide the Enter Guess / Message buttons
  //The enter guess is shown until the game ends, then its replaced with the reset button.
  function changeCurrentInputButton() {
    if (gameStatusRef.current === "playing") {
      setHideGuessButtonRef("");
      setHideResetButtonRef(" hide");
      setHideMessageButtonRef(" hide");
    } else {
      if (nextGameAvailableRef.current) {
        setHideGuessButtonRef(" hide");
        setHideResetButtonRef("");
        setHideMessageButtonRef(" hide");
      } else {
        setHideGuessButtonRef(" hide");
        setHideResetButtonRef(" hide");
        setHideMessageButtonRef("");
      }
    }
  }

  //Holds the scores displayed once the game ends
  const scoresObjRef = useRef();
  function setScoresObjRef(point) {
    scoresObjRef.current = point;
  }

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    setupGame();
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  //Sets up the the game
  async function setupGame() {
    console.log("hello");
    let storage = localStorage.getItem("game" + props.digits);
    //Setting the localStorage for the game or loading it
    if (storage) {
      console.log("there is storage");
      let storageObj = JSON.parse(storage);

      const url = "/api/gameId";
      const options = {
        method: "PUT",
        body: JSON.stringify({ digits: props.digits }),
        withCredentials: true,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      let res = await fetch(url, options);
      let resObj = await res.json();
      console.log("got the object");

      if (
        !storageObj.board[0] ||
        (resObj.gameId !== storageObj.gameId && storageObj.status != `playing`)
      ) {
        console.log("resetting");
        resetGame();
      } else {
        console.log("updating game state");
        updateGameStateFromLocalStorage();
        if (gameStatusRef.current !== "playing") {
          disableGame(false);
        }
      }
    } else {
      console.log("there is no storage");
      //Sets up the board
      let board = new Array(props.attempts);
      for (let i = 0; i < props.attempts; i++) {
        board[i] = "";
      }
      setBoardStateRef(board);
      console.log("trying to make things");
      //Sets up the hints
      let hintsArr = new Array(props.attempts);
      for (let i = 0; i < props.attempts; i++) {
        hintsArr[i] = "";
      }
      setHintsRef(hintsArr);
      console.log(hintsRef.current);
      const url = "/api/gameId";
      const options = {
        method: "PUT",
        body: JSON.stringify({ digits: props.digits }),
        withCredentials: true,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      let res = await fetch(url, options);
      let resObj = await res.json();
      setGameIdRef(resObj.gameId);
      updateLocalStorage();
    }

    /*
    await updateGameStateFromBackend(true, null, true);
    if (gameStatusRef.current !== "playing") {
      setCurrentRowRef(currentRowRef.current - 1);
      disableGame(false);
    }
    */

    changeCurrentInputButton();
    updateGameBoard();
    updateKeyboard();
  }

  //Helper function for setting the game state to the local storage
  function updateLocalStorage() {
    let gameState = {
      board: boardStateRef.current,
      currentRow: currentRowRef.current,
      hints: hintsRef.current,
      status: gameStatusRef.current,
      gameId: gameIdRef.current,
      targetNumber: targetNumberRef.current,
    };
    localStorage.setItem(`game` + props.digits, JSON.stringify(gameState));
  }

  //Helper function that loads the game state from localStorage when user revists the page
  async function updateGameStateFromLocalStorage() {
    let storage = localStorage.getItem("game" + props.digits);
    if (storage) {
      let storageObj = JSON.parse(storage);
      setBoardStateRef(storageObj.board);
      setCurrentRowRef(storageObj.currentRow);
      setHintsRef(storageObj.hints);
      setGameStatusRef(storageObj.status);
      setGameIdRef(storageObj.gameId);
      setTargetNumberRef(storageObj.targetNumber);
      changeKeyboardColors();
    }
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
              width: 76 / props.digits + "%",
            }}
            key={"row" + i + "digit" + j}
          >
            {boardStateRef.current[i].slice(j, j + 1)}
          </div>
        );
        digits.push(digit);
      }
      let hint = <div className={getHintClassList(i)} key={"hint" + i}></div>;
      let row = (
        <span className={getRowClassList(i)} key={"row" + i}>
          {digits}
          {hint}
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
      if (errorAnimationRef.current === true) {
        classList += " error-animation";
        setErrorAnimationRef(false);
      }
    }
    classList += " digits-" + props.digits;
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
        default: {
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
        default: {
        }
      }
    } else {
      if (i === currentRowRef.current) {
        if (boardStateRef.current[i].length < j) {
          classList += " next-digit";
        } else if (boardStateRef.current[i].length > j) {
          classList += " previous-digit";
        } else {
          classList += " current-digit";
        }

        if (newRowRef.current === true) {
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
        default: {
        }
      }
    }
    if (i === currentRowRef.current) {
      if (newRowRef.current === true) {
        classList += " new-row";
        setNewRowRef(false);
      }
    }
    return classList;
  }

  //Used to set up the keyboard on each render
  function updateKeyboard() {
    let keyboardHTML = (
      <div className="keyboard">
        <div className={keyboardClassNameRef.current}>
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
          className={"enter-guess" + hideGuessButtonRef.current}
          style={{ animation: keyboardAnimationRef.current[`keyEnter`] }}
          onClick={checkGuess}
        >
          Enter
        </button>
        <button className={"bottom-message" + hideMessageButtonRef.current}>
          {timeToNextGame()}
        </button>
        <button
          className={"reset-game" + hideResetButtonRef.current}
          onClick={resetGame}
        >
          Play Todays Game
        </button>
      </div>
    );
    setKeyboard(keyboardHTML);
  }

  //Used to set the colors on the keyboard at the bottom of the game
  function changeKeyboardColors() {
    let boardStateCopy = [];
    Object.values(boardStateRef.current).forEach((x) => {
      boardStateCopy.push(x);
    });
    let hintsCopy = [];
    Object.values(hintsRef.current).forEach((x) => {
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
    while (boardStateCopy[noRows] !== "" && noRows < props.attempts) {
      noRows++;
    }

    for (let i = 0; i < noRows; i++) {
      for (let j = 0; j < props.digits; j++) {
        let hint = hintsCopy[i];
        let letter = hint[j];
        let boardStateRow = boardStateCopy[i];
        let number = boardStateRow[j];

        if (colorsObj["color" + number] === " green") {
          //Do nothing
        } else if (colorsObj["color" + number] === " yellow") {
          if (letter === "G") {
            colorsObj["color" + number] = " green";
          }
        } else if (colorsObj["color" + number] === " grey") {
          if (letter === "G") {
            colorsObj["color" + number] = " green";
          } else if (letter === "Y") {
            colorsObj["color" + number] = " yellow";
          }
        } else {
          if (letter === "G") {
            colorsObj["color" + number] = " green";
          } else if (letter === "Y") {
            colorsObj["color" + number] = " yellow";
          } else if (letter === "X") {
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
    if (isFinite(parseInt(e.key))) {
      inputNumber(e.key);
    }
    if (e.key === "Backspace") {
      backspace();
    }
    if (e.key === "Enter") {
      checkGuess();
    }
  }

  //Sets the keydown animation for the given key
  function keydownAnimation(keyName) {
    //Animation
    let keyboardAnimationCopy = [];
    Object.entries(keyboardAnimationRef.current).forEach((x) => {
      keyboardAnimationCopy[x[0]] = x[1];
    });
    keyboardAnimationCopy[keyName] = `mars`;
    setKeyboardAnimationRef(keyboardAnimationCopy);
    updateKeyboard();
    setTimeout(() => {
      let keyboardAnimationCopy = [];
      Object.entries(keyboardAnimationRef.current).forEach((x) => {
        keyboardAnimationCopy[x[0]] = x[1];
      });
      if (keyName !== "keyEnter") {
        keyboardAnimationCopy[keyName] = `keydown .5s`;
      } else {
        keyboardAnimationCopy[keyName] = `keydown .3s`;
      }
      setKeyboardAnimationRef(keyboardAnimationCopy);
      updateKeyboard();
      setTimeout(() => {
        let keyboardAnimationCopy = [];
        Object.entries(keyboardAnimationRef.current).forEach((x) => {
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
      Object.values(boardStateRef.current).forEach((x) => {
        boardStateCopy.push(x);
      });
      boardStateCopy[currentRowRef.current] += n;
      setBoardStateRef(boardStateCopy);
      updateGameBoard();
      //updateLocalStorage();
      keydownAnimation("key" + n);
    }
  }

  //Handles backpace key
  function backspace() {
    if (boardStateRef.current[currentRowRef.current].length > 0) {
      let boardStateCopy = [];
      Object.values(boardStateRef.current).forEach((x) => {
        boardStateCopy.push(x);
      });
      boardStateCopy[currentRowRef.current] = boardStateCopy[
        currentRowRef.current
      ].slice(0, boardStateCopy[currentRowRef.current].length - 1);
      setBoardStateRef(boardStateCopy);
      updateGameBoard();
      //updateLocalStorage();
      keydownAnimation("keyBackspace");
    }
  }

  //Checks the users guess
  async function checkGuess() {
    if (boardStateRef.current[currentRowRef.current].length === props.digits) {
      disableInputs();
      setCurrentRowRef(currentRowRef.current + 1);
      let reqObj = {
        digits: props.digits,
        number: boardStateRef.current[currentRowRef.current - 1],
        //number: boardStateRef.current[currentRowRef.current],
        hints: hintsRef.current,
        currentRow: currentRowRef.current - 1,
        gameId: gameIdRef.current,
      };
      const url = "/api/checkGuessLocal";
      const options = {
        method: "PUT",
        body: JSON.stringify(reqObj),
        withCredentials: true,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      let res = await fetch(url, options);
      let resObj = await res.json();
      //resObj.gameObj.currentRow -= 1;
      setCurrentRowRef(currentRowRef.current - 1);
      setHintsRef(resObj.gameObj.hints);
      keydownAnimation("keyEnter");

      enableInputs();

      if (resObj.gameObj.status === `victory`) {
        setGameStatusRef(`victory`);
        if (resObj.gameObj.nextGameAvailable) {
          setNextGameAvailableRef(true);
        } else {
          setNextGameAvailableRef(false);
        }
        //setScoresObjRef(resObj.scoresObj);
        disableGame();
        updateScores();
        setTargetNumberRef(resObj.gameObj.targetNumber);
        setDateRef(resObj.gameObj.date);
        addTransitionDelay();
        changeKeyboardColors();
        //removeTransitionDelay();
        updateGameBoard();
        updateLocalStorage();
      } else {
        if (resObj.gameObj.status === `playing`) {
          addTransitionDelay();
          changeKeyboardColors();
          setCurrentRowRef(currentRowRef.current + 1);
          setNewRowRef(true);
          updateGameBoard();
          updateLocalStorage();
        } else {
          setGameStatusRef(`defeat`);
          console.log(resObj.gameObj.nextGameAvailable);
          if (resObj.gameObj.nextGameAvailable) {
            setNextGameAvailableRef(true);
          } else {
            setNextGameAvailableRef(false);
          }
          disableGame();
          updateScores();
          setTargetNumberRef(resObj.gameObj.targetNumber);
          setDateRef(resObj.gameObj.date);
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

  //Turns off keyboard interactions
  function disableInputs() {
    document.removeEventListener("keydown", handleKeydown);
    setKeyboardClassNameRef("number-inputs disabled");
  }

  //Turns on keyboard interactions
  function enableInputs() {
    document.addEventListener("keydown", handleKeydown);
    setKeyboardClassNameRef("number-inputs");
  }

  //Sets the score for this game next to any previous games and updates the average score among all games
  function updateScores() {
    let score;
    if (gameStatusRef.current === "victory") {
      score = currentRowRef.current + 1;
    } else {
      score = currentRowRef.current + 2;
    }
    let scoresObj;
    let scoresStorage = localStorage.getItem("scores" + props.digits);
    if (!scoresStorage) {
      scoresObj = {
        scores: [],
        average: 0,
      };
    } else {
      scoresObj = JSON.parse(scoresStorage);
    }
    scoresObj.scores.unshift(score);
    scoresObj.average =
      scoresObj.scores.reduce((total, x) => {
        return total + x;
      }, 0) / scoresObj.scores.length;
    localStorage.setItem("scores" + props.digits, JSON.stringify(scoresObj));
  }

  //Helper function that adds a transition delay to the keys on the keyboard so they change as gameboard changes
  //Occurs after a guess is entered
  function addTransitionDelay() {
    setTransitionDelayRef();
    let transitionDelayCopy = {};
    Object.entries(transitionDelayRef).forEach((x) => {
      transitionDelayCopy[x[0]] = x[1];
    });
    let number = boardStateRef.current[currentRowRef.current];
    for (let i = 0; i < props.digits; i++) {
      transitionDelayCopy[`key` + number[i]] =
        0.4 + (props.digits - 1) * 0.2 - i * 0.2 + "s";
    }
    setTransitionDelayRef(transitionDelayCopy);
    setTimeout(removeTransitionDelay, 5000);
  }

  //Removes the transition delay
  //Occurs after a guess is entered
  function removeTransitionDelay() {
    let transitionDelayCopy = {};
    Object.entries(transitionDelayRef).forEach((x) => {
      transitionDelayCopy[x[0]] = x[1];
    });
    let number = boardStateRef.current[currentRowRef.current];
    for (let i = 0; i < props.digits; i++) {
      transitionDelayCopy[`key` + number[i]] = "";
    }
    setTransitionDelayRef(transitionDelayCopy);
    updateKeyboard();
  }

  //Displays an error message and plays an animation when user has invalid length input
  function invalidGuess() {
    let y = yPosition.current.offsetTop;
    if (errorMessagesRef.current.length < 4) {
      updateGameBoard();
      setErrorAnimationRef(true);
      let errorMessagesCopy = [];
      Object.values(errorMessagesRef.current).forEach((x) => {
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
            inset: y + 15 + 82 * (currentRowRef.current + 1) + "px 50% 0% 0%",
          }}
        >
          {errorMessagesRef.current}
        </div>
      );
      setErrorMessagesDiv(errorMessageDivHTML);
      updateGameBoard();
      setTimeout(() => {
        let errorMessagesCopy = [];
        Object.values(errorMessagesRef.current).forEach((x) => {
          errorMessagesCopy.push(x);
        });
        errorMessagesCopy.shift();
        setErrorMessagesRef(errorMessagesCopy);
        let errorMessageDivHTML = (
          <div
            className="error-messages"
            style={{
              inset: y + 15 + 82 * (currentRowRef.current + 1) + "px 50% 0% 0%",
            }}
          >
            {errorMessagesRef.current}
          </div>
        );
        if (errorMessagesCopy.length === 0) {
          setErrorMessagesDiv();
        } else {
          setErrorMessagesDiv(errorMessageDivHTML);
        }
      }, 1500);
    }
  }

  //Occurs when the user wins
  function victory() {
    let rowsTemp = [];
    let digits = [];
    for (let j = 0; j < props.digits; j++) {
      let digit = (
        <div
          className="digit green"
          style={{
            width: 76 / props.digits + "%",
          }}
          key={"defeat-digit" + j}
        >
          {targetNumberRef.current.slice(j, j + 1)}
        </div>
      );
      digits.push(digit);
    }
    let row = (
      <div className="gameboard" key="victory-gameboard">
        <div className="rows">
          <span className="victory-row">{digits}</span>
        </div>
      </div>
    );
    rowsTemp.push(row);

    let victoryHTML = (
      <div className="victory-modal">
        <span className="victory-modal-top">
          <button
            className="close-victory-modal"
            onClick={(e) => closeGameOverModal(e)}
          >
            X
          </button>
        </span>
        <div className="victory-label">Victory!</div>
        <div className="correct-number">{rowsTemp}</div>
        <div className="share-score-container">
          <ShareScore hints={hintsRef.current} date={dateRef.current} />
        </div>
        <Histogram digits={props.digits} attempts={props.attempts} />
      </div>
    );
    setGameOverModalRef(victoryHTML);
  }

  //Occurs when user runs out of guesses
  function defeat() {
    let rowsTemp = [];
    let digits = [];
    for (let j = 0; j < props.digits; j++) {
      let digit = (
        <div
          className="digit next-digit"
          style={{
            width: 76 / props.digits + "%",
          }}
          key={"defeat-digit" + j}
        >
          {targetNumberRef.current.slice(j, j + 1)}
        </div>
      );
      digits.push(digit);
    }
    let row = (
      <div className="gameboard" key="defeat-gameboard">
        <div className="rows">
          <span className="current-row">{digits}</span>
        </div>
      </div>
    );
    rowsTemp.push(row);

    let defeatHTML = (
      <div className="defeat-modal">
        <span className="defeat-modal-top">
          <button
            className="close-defeat-modal"
            onClick={(e) => closeGameOverModal(e)}
          >
            X
          </button>
        </span>
        <div className="defeat-label">Defeat</div>
        <div className="correct-number">{rowsTemp}</div>
        <div className="share-score-container">
          <ShareScore hints={hintsRef.current} />
        </div>
        <Histogram digits={props.digits} attempts={props.attempts} />
      </div>
    );
    setGameOverModalRef(defeatHTML);
  }

  //Closes the modal that pops up at the end of the game
  function closeGameOverModal(e) {
    setGameOverModalRef();
    updateGameBoard();
  }

  //Used to display a modal
  const gameOverModalRef = useRef();
  function setGameOverModalRef(point) {
    gameOverModalRef.current = point;
  }

  //Disables the game after the player wins or loses
  function disableGame(delay = true) {
    let delayTime = 1000 * (0.85 + 0.2 * (props.digits - 1));
    if (!delay) {
      delayTime = 0;
    }
    document.removeEventListener("keydown", handleKeydown);
    setKeyboardClassNameRef("number-inputs disabled");
    updateKeyboard();
    //console.log(gameStatusRef.current);
    setTimeout(() => {
      changeCurrentInputButton();
      updateKeyboard();
      if (gameStatusRef.current === "defeat") {
        defeat();
      } else if (gameStatusRef.current === "victory") {
        victory();
      }
      if (nextGameAvailableRef.current) {
        document.addEventListener("keydown", resetEnter);
      }
    }, delayTime);
  }

  //Returns a message telling how much time until the next game will be available
  //This appears on the button at the bottom once game ends
  function timeToNextGame() {
    let date = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });
    let easternTime = new Date(date).getTime();
    let easternMidnight = new Date(date).setHours(24, 0, 0, 0);
    let timeToNextGame = Math.ceil(
      (easternMidnight - easternTime) / (1000 * 60 * 60)
    );
    let message;
    if (timeToNextGame <= 1) {
      message = "New Game Available Soon";
    } else {
      message = "New Game in " + timeToNextGame + " Hours";
    }
    return message;
  }

  //Event function that makes it so hitting enter will reset the game
  function resetEnter(e) {
    if (e.key === "Enter") {
      resetGame();
    }
  }

  //Resets the game.
  async function resetGame() {
    document.removeEventListener("keydown", resetEnter);
    localStorage.removeItem("game" + props.digits);
    setCurrentRowRef(0);
    setKeyboardClassNameRef(`number-inputs`);
    if (gameStatusRef.current !== `playing`) {
      document.addEventListener("keydown", handleKeydown);
    }
    setGameStatusRef(`playing`);
    setGameOverModalRef();
    setupGame();
    changeKeyboardColors();
    changeCurrentInputButton();
    updateKeyboard();
    updateGameBoard();
  }

  //Displays the button that links to the premium page
  function showPremiumButton() {}

  return (
    <main className="game-container">
      <div className={"gameboard"}>
        {errorMessagesDiv}
        {gameOverModalRef.current}
        <div className="rows" ref={yPosition}>
          {board}
        </div>
        {keyboard}
      </div>
    </main>
  );
}

export default NumberGameLocal;