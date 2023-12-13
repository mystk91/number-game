import React, { useState, useEffect, useRef, useCallback } from "react";
import uniqid from "uniqid";
import "./NumberGame.css";
import "../../normalize.css";
import "../../custom.css";
import HistogramRegular from "./HistogramRegular";
import ShareScore from "./ShareScore";
import AdRandomModal from "../Navbar/AdRandomModal";

function NumberGameRegular(props) {
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
  //This is put at the top of the rows/gameboard to measure its y position on page.
  //This is only being used by the error message when it pops up
  const yPosition = useRef();

  //Used to set the class name for the keyboard.
  //It will be set to `keyboard disabled` when the game is over so it won't take inputs
  const keyboardClassNameRef = useRef(``);
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

  //The date for the game
  const dateRef = useRef();
  function setDateRef(point) {
    setDateRef.current = point;
  }

  //These functions set the links of the arrows at the bottom of the keyboard to go to other games
  let linkRightRef = useRef("");
  function setLinkRightRef(point) {
    linkRightRef.current = point;
  }

  let linkLeftRef = useRef("");
  function setLinkLeftRef(point) {
    linkLeftRef.current = point;
  }

  function setUpArrowLinks() {
    let maxDigits = 7;
    if (props.digits === maxDigits) {
      setLinkLeftRef(`/digits${maxDigits - 1}`);
      setLinkRightRef(`/digits${2}`);
    } else if (props.digits === 2) {
      setLinkLeftRef(`/digits${maxDigits}`);
      setLinkRightRef(`/digits${3}`);
    } else {
      setLinkLeftRef(`/digits${props.digits - 1}`);
      setLinkRightRef(`/digits${props.digits + 1}`);
    }
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
    sessionStorage.setItem("currentMode", "daily");
    setupGame();
    document.addEventListener("keydown", handleKeydown);
    completeLogin();

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  //Sets up the the game
  async function setupGame() {
    await updateGameStateFromBackend(true, null, true);
    if (gameStatusRef.current !== "playing") {
      setCurrentRowRef(currentRowRef.current - 1);
      disableGame(false);
    }
    changeCurrentInputButton();
    updateGameBoard();
    setUpArrowLinks();
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

  //Retrieves the users game from backend so it game be displayed visually
  //You can set shouldFetch to false & use a gameObj as a parameter to skip server call
  async function updateGameStateFromBackend(
    shouldFetch = true,
    resObj = null,
    firstCall = false
  ) {
    if (shouldFetch) {
      //let userRes = await fetch("/api/current_user");
      //let user = await userRes.json();
      let user = props.user;
      let reqObj = {
        session: user.session,
        digits: props.digits,
        firstCall: firstCall,
      };
      const url = "/api/getCurrentGameRegular";
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
      resObj = await res.json();
    }
    if (resObj) {
      setBoardStateRef(resObj.gameObj.board);
      setHintsRef(resObj.gameObj.hints);
      setCurrentRowRef(resObj.gameObj.currentRow);
      setGameStatusRef(resObj.gameObj.status);
      if (resObj.gameObj.status !== "playing") {
        setTargetNumberRef(resObj.gameObj.targetNumber);
        setScoresObjRef(resObj.scoresObj);
        setDateRef(resObj.date);
        console.log(resObj.gameObj.nextGameAvailable);
        if (resObj.gameObj.nextGameAvailable) {
          setNextGameAvailableRef(true);
        } else {
          setNextGameAvailableRef(false);
        }
      }
      changeKeyboardColors();
    }
  }

  //Used to set up the keyboard on each render
  function updateKeyboard() {
    let keyboardHTML = (
      <div className="keyboard">
        <div className={"number-inputs" + keyboardClassNameRef.current}>
          <button
            className={
              "number-input" +
              keyboardColorsRef.current["color1"] +
              keyboardAnimationRef.current[`key1`]
            }
            style={{
              transitionDelay: transitionDelayRef.current["key1"],
            }}
            onClick={(e) => {
              e.target.blur();
              inputNumber(1);
            }}
            onKeyDown={(e) => {
              handleKeyboardKeyDown(e, 1);
            }}
            tabIndex={1}
          >
            1
          </button>
          <button
            className={
              "number-input" +
              keyboardColorsRef.current["color2"] +
              keyboardAnimationRef.current[`key2`]
            }
            style={{
              transitionDelay: transitionDelayRef.current["key2"],
            }}
            onClick={(e) => {
              e.target.blur();
              inputNumber(2);
            }}
            onKeyDown={(e) => {
              handleKeyboardKeyDown(e, 2);
            }}
            tabIndex={1}
          >
            2
          </button>
          <button
            className={
              "number-input" +
              keyboardColorsRef.current["color3"] +
              keyboardAnimationRef.current[`key3`]
            }
            style={{
              transitionDelay: transitionDelayRef.current["key3"],
            }}
            onClick={(e) => {
              e.target.blur();
              inputNumber(3);
            }}
            onKeyDown={(e) => {
              handleKeyboardKeyDown(e, 3);
            }}
            tabIndex={1}
          >
            3
          </button>
          <button
            className={
              "number-input" +
              keyboardColorsRef.current["color4"] +
              keyboardAnimationRef.current[`key4`]
            }
            style={{
              transitionDelay: transitionDelayRef.current["key4"],
            }}
            onClick={(e) => {
              e.target.blur();
              inputNumber(4);
            }}
            onKeyDown={(e) => {
              handleKeyboardKeyDown(e, 4);
            }}
            tabIndex={1}
          >
            4
          </button>
          <button
            className={
              "number-input" +
              keyboardColorsRef.current["color5"] +
              keyboardAnimationRef.current[`key5`]
            }
            style={{
              transitionDelay: transitionDelayRef.current["key5"],
            }}
            onClick={(e) => {
              e.target.blur();
              inputNumber(5);
            }}
            onKeyDown={(e) => {
              handleKeyboardKeyDown(e, 5);
            }}
            tabIndex={1}
          >
            5
          </button>
          <button
            className={
              "number-input" +
              keyboardColorsRef.current["color6"] +
              keyboardAnimationRef.current[`key6`]
            }
            style={{
              transitionDelay: transitionDelayRef.current["key6"],
            }}
            onClick={(e) => {
              e.target.blur();
              inputNumber(6);
            }}
            onKeyDown={(e) => {
              handleKeyboardKeyDown(e, 6);
            }}
            tabIndex={1}
          >
            6
          </button>
          <button
            className={
              "number-input" +
              keyboardColorsRef.current["color7"] +
              keyboardAnimationRef.current[`key7`]
            }
            style={{
              transitionDelay: transitionDelayRef.current["key7"],
            }}
            onClick={(e) => {
              e.target.blur();
              inputNumber(7);
            }}
            onKeyDown={(e) => {
              handleKeyboardKeyDown(e, 7);
            }}
            tabIndex={1}
          >
            7
          </button>
          <button
            className={
              "number-input" +
              keyboardColorsRef.current["color8"] +
              keyboardAnimationRef.current[`key8`]
            }
            style={{
              transitionDelay: transitionDelayRef.current["key8"],
            }}
            onClick={(e) => {
              e.target.blur();
              inputNumber(8);
            }}
            onKeyDown={(e) => {
              handleKeyboardKeyDown(e, 8);
            }}
            tabIndex={1}
          >
            8
          </button>
          <button
            className={
              "number-input" +
              keyboardColorsRef.current["color9"] +
              keyboardAnimationRef.current[`key9`]
            }
            style={{
              transitionDelay: transitionDelayRef.current["key9"],
            }}
            onClick={(e) => {
              e.target.blur();
              inputNumber(9);
            }}
            onKeyDown={(e) => {
              handleKeyboardKeyDown(e, 9);
            }}
            tabIndex={1}
          >
            9
          </button>
          <button
            className={
              "number-input" +
              keyboardColorsRef.current["color0"] +
              keyboardAnimationRef.current[`key0`]
            }
            style={{
              transitionDelay: transitionDelayRef.current["key0"],
            }}
            onClick={(e) => {
              e.target.blur();
              inputNumber(0);
            }}
            onKeyDown={(e) => {
              handleKeyboardKeyDown(e, 0);
            }}
            tabIndex={1}
          >
            0
          </button>
          <button
            className={
              "backspace" + keyboardAnimationRef.current[`keyBackspace`]
            }
            onClick={(e) => {
              e.target.blur();
              backspace();
            }}
            onKeyDown={(e) => {
              handleBackspaceKeyDown(e);
            }}
            tabIndex={1}
          ></button>
        </div>
        <div className="keyboard-bottom">
          <a href={linkLeftRef.current} tabIndex={2}>
            <button className={"arrow-left"} tabIndex={0} />
          </a>
          <button
            className={
              "enter-guess" +
              hideGuessButtonRef.current +
              keyboardAnimationRef.current[`keyEnter`] +
              keyboardClassNameRef.current
            }
            onClick={(e) => {
              e.target.blur();
              checkGuess();
            }}
            onKeyDown={(e) => {
              handleEnterKeyDown(e);
            }}
            tabIndex={1}
          >
            Enter
          </button>
          <button
            className={"bottom-message" + hideMessageButtonRef.current}
            tabIndex={1}
          >
            {timeToNextGame()}
          </button>
          <button
            className={"reset-game" + hideResetButtonRef.current}
            onClick={resetGame}
            tabIndex={1}
          >
            Play Todays Game
          </button>
          <a href={linkRightRef.current} tabIndex={2}>
            <button className={"arrow-right"} tabIndex={0} />
          </a>
        </div>
      </div>
    );
    setKeyboard(keyboardHTML);
  }

  //Used to handle the keydown when number is tab-selected
  function handleKeyboardKeyDown(e, number) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (
        boardStateRef.current[currentRowRef.current].length === props.digits
      ) {
        checkGuess();
      } else {
        inputNumber(number);
      }
    }
  }

  //Used to handle the keydown when backspace is tab-selected
  function handleBackspaceKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      backspace();
    }
  }

  //Used to handle the keydown when enter is tab-selected
  function handleEnterKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      checkGuess();
    }
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
    keyboardAnimationCopy[keyName] = ``;
    setKeyboardAnimationRef(keyboardAnimationCopy);
    updateKeyboard();
    setTimeout(() => {
      let keyboardAnimationCopy = [];
      Object.entries(keyboardAnimationRef.current).forEach((x) => {
        keyboardAnimationCopy[x[0]] = x[1];
      });
      keyboardAnimationCopy[keyName] = ` keydown`;
      setKeyboardAnimationRef(keyboardAnimationCopy);
      updateKeyboard();
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
    keydownAnimation("keyEnter");
    if (boardStateRef.current[currentRowRef.current].length === props.digits) {
      disableInputs();
      setCurrentRowRef(currentRowRef.current + 1);
      //let userRes = await fetch("/api/current_user");
      //let user = await userRes.json();
      let user = props.user;
      let reqObj = {
        session: user.session,
        digits: props.digits,
        number: boardStateRef.current[currentRowRef.current - 1],
      };
      const url = "/api/checkGuessRegular";
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
      resObj.gameObj.currentRow -= 1;

      await updateGameStateFromBackend(false, resObj);
      enableInputs();

      if (resObj.gameObj.status === `victory`) {
        setGameStatusRef(`victory`);
        setDateRef(resObj.gameObj.date);
        if (resObj.gameObj.nextGameAvailable) {
          setNextGameAvailableRef(true);
        } else {
          setNextGameAvailableRef(false);
        }
        //setScoresObjRef(resObj.scoresObj);
        //updateScores();
        //setTargetNumberRef(resObj.gameObj.targetNumber);
        disableGame();
        addTransitionDelay();
        changeKeyboardColors();
        //removeTransitionDelay();
        updateGameBoard();
        //updateLocalStorage();
        updateTimesVisited();
      } else {
        if (resObj.gameObj.status === `playing`) {
          addTransitionDelay();
          changeKeyboardColors();
          setCurrentRowRef(currentRowRef.current + 1);
          setNewRowRef(true);
          updateGameBoard();
        } else {
          setGameStatusRef(`defeat`);
          setDateRef(resObj.gameObj.date);
          console.log(resObj.gameObj.nextGameAvailable);
          if (resObj.gameObj.nextGameAvailable) {
            setNextGameAvailableRef(true);
          } else {
            setNextGameAvailableRef(false);
          }
          disableGame();
          addTransitionDelay();
          changeKeyboardColors();
          removeTransitionDelay();
          updateGameBoard();
          updateTimesVisited();
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
    setKeyboardClassNameRef(" disabled");
  }

  //Turns on keyboard interactions
  function enableInputs() {
    document.addEventListener("keydown", handleKeydown);
    setKeyboardClassNameRef("");
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
      if (number[i] === target[i]) {
        tempTarget += "G";
      } else {
        tempTarget += target[i];
      }
    }
    for (let i = 0; i < props.digits; i++) {
      if (tempTarget[i] === "G") {
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
    } else if (number === target) {
      result += "E";
    }
    return result;
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
        <HistogramRegular
          digits={props.digits}
          attempts={props.attempts}
          scoresObj={scoresObjRef.current}
        />
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
        <HistogramRegular
          digits={props.digits}
          attempts={props.attempts}
          scoresObj={scoresObjRef.current}
        />
      </div>
    );
    setGameOverModalRef(defeatHTML);
  }

  //Closes the modal that pops up at the end of the game
  function closeGameOverModal(e) {
    setGameOverModalRef();
    updateGameBoard();
    addShowScoresButton();
  }

  //Used to create a shows scores button if the scores modal is closed
  let [showScoresButton, setShowScoresButton] = useState();
  let scoresWindowRevealedRef = useRef(false);
  function setScoresWindowRevealRef(point) {
    setScoresWindowRevealRef.current = point;
  }

  //Adds a button to the bottom of the page the will reshow the scores after that window has been closed
  function addShowScoresButton() {
    if (setScoresWindowRevealRef.current) {
      setShowScoresButton(
        <button className={"show-scores"} onClick={scoresButtonClicked}>
          Show Scores
        </button>
      );
    } else {
      setShowScoresButton(
        <button
          className={"show-scores float-down"}
          onClick={scoresButtonClicked}
        >
          Show Scores
        </button>
      );
      setScoresWindowRevealRef(true);
    }
  }

  function scoresButtonClicked() {
    if (gameStatusRef.current === "victory") {
      victory();
    } else {
      defeat();
    }
    setShowScoresButton(
      <button className={"show-scores"} onClick={scoresButtonClicked}>
        Show Scores
      </button>
    );
    setTimeout(() => {
      setShowScoresButton(
        <button className={"show-scores keydown"} onClick={scoresButtonClicked}>
          Show Scores
        </button>
      );
    }, 1);
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
    setKeyboardClassNameRef(" disabled");
    updateKeyboard();
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
      message = "New Game Soon";
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
    //let userRes = await fetch("/api/current_user");
    //let user = await userRes.json();
    let user = props.user;
    let reqObj = {
      session: user.session,
      digits: props.digits,
    };
    const url = "/api/resetGameRegular";
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

    document.removeEventListener("keydown", resetEnter);
    setKeyboardClassNameRef(``);
    if (gameStatusRef.current !== `playing`) {
      document.addEventListener("keydown", handleKeydown);
    }
    setGameOverModalRef();
    await updateGameStateFromBackend(false, resObj);

    changeKeyboardColors();
    changeCurrentInputButton();
    setTransitionDelayRef({
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
    setKeyboardAnimationRef({
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
    updateKeyboard();
    updateGameBoard();
    setShowScoresButton();
    showAd();
  }

  //External logins like from google will redirect to this page. This will put the profile info into local storage
  async function completeLogin() {
    if (!localStorage.getItem("profile")) {
      let profile = await fetch("/api/current_user");
      let profileObj = await profile.json();
      if (profileObj) {
        localStorage.setItem(
          "profile",
          JSON.stringify({
            session: profileObj.session,
            profile_picture: profileObj.profile_picture,
          })
        );
      }
    }
  }

  //Used for showing a popup ad before game starts
  const [adPopup, setAdPopup] = useState();

  //Stops the game from being played when the ad modal is open
  const stopOtherKeydowns = useCallback((e) => {
    e.stopPropagation();
  }, []);

  //Displays a popup ad for the random mode of the game after visitor has visited site a couple times
  //Starts displaying ordinary ads afterwards at random intervals
  function showAd() {
    let previouslyVisited = Number.parseInt(
      localStorage.getItem("previouslyVisited")
    );
    if (previouslyVisited < 4) {
      //Do nothing
    } else if (previouslyVisited === 4) {
      document.addEventListener("keydown", stopOtherKeydowns, true);
      let adHTML = (
        <div class="ad-modal">
          <div className="ad-modal-box">
            <span className="ad-modal-top">
              <button className="close-ad-modal" onClick={closeAdModal}>
                X
              </button>
            </span>
            <AdRandomModal />
            <button className="confirmation-btn" onClick={closeAdModal}>
              Maybe Later
            </button>
          </div>
        </div>
      );
      setAdPopup(adHTML);
      localStorage.setItem("previouslyVisited", "5");
    }
    /* This is where an ad could be inserted
   else {
     let randomNum = Math.floor(Math.random() * 9);
     if (randomNum === 0) {
       document.addEventListener("keydown", stopOtherKeydowns, true);
       let adHTML = (
         <div className="ad-modal">
           <span className="ad-modal-top">
             <button
               className="close-ad-modal"
               onClick={(e) => closeAdModal(e)}
             >
               X
             </button>
           </span>
           <AdRandomMode />
           <button className="confirmation-btn" onClick={closeAdModal}>
             Go to Game
           </button>
         </div>
       );
       setAdPopup(adHTML);
     }
   }
   */
  }

  //Closes the modal that pops up at the end of the game
  function closeAdModal(e) {
    document.removeEventListener("keydown", stopOtherKeydowns, true);
    setKeyboardClassNameRef("");
    updateKeyboard();
    setAdPopup();
  }

  function updateTimesVisited() {
    if (!props.user.premium) {
      let previouslyVisited = Number.parseInt(
        localStorage.getItem("previouslyVisited")
      );
      if (previouslyVisited < 4) {
        previouslyVisited++;
        localStorage.setItem("previouslyVisited", previouslyVisited);
      }
    }
  }

  return (
    <div className="number-game">
      {adPopup}
      <main className="game-container">
        <div className={"gameboard"}>
          {errorMessagesDiv}
          {gameOverModalRef.current}
          <div className="rows" ref={yPosition}>
            {board}
          </div>
          {keyboard}
          <div className="show-scores-container">{showScoresButton}</div>
        </div>
      </main>
    </div>
  );
}

export default NumberGameRegular;
