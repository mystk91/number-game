import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import uniqid from "uniqid";
import "./Instructions.css";
import "../../normalize.css";
import "../../custom.css";

//A modal that will pop-up when a new user visits the page or hits the question mark button.
//Gives a guide on how to play the game.
function InstructionsFive(props) {
  const [property, setProperty] = useState("initialValue");
  const propRef = useRef("initialValue");
  function setPropRef(point) {
    propRef.current = point;
  }

  //Used to hide the modal after its done being used
  const [displayInstructions, setDisplayInstructions] = useState("");

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    setDigitAnimationTimingRef(setInterval(tickDigitAnimation, 400));
    setFlipAnimationTimingRef(setInterval(tickFlipAnimation, 400));
    return () => {
      clearInterval(digitAnimationTimingRef.current);
      clearInterval(flipAnimationTimingRef.current);
    };
  }, []);
  //componentDidUpdate, runs after render
  useEffect(() => {}, [property]);
  //componentDismount
  useEffect(() => {
    return () => {};
  });

  /* Hides the modal when you click outside the main box */
  function hideInstructionsModal(e) {
    if (e.target.classList[0] === "instructions-modal") {
      setDisplayInstructions(" hide-modal");
      clearInterval(digitAnimationTimingRef.current);
      clearInterval(flipAnimationTimingRef.current);
    }
  }

  /* Hides the modal when you click on the X */
  function hideInstructionsButton(e) {
    setDisplayInstructions(" hide-modal");
    clearInterval(digitAnimationTimingRef.current);
    clearInterval(flipAnimationTimingRef.current);
  }

  /* The following functions are used to animate the first digit box on the page
  /* Used for the tickDigitAnimation */
  const digitAnimationTimingRef = useRef();
  function setDigitAnimationTimingRef(point) {
    digitAnimationTimingRef.current = point;
  }

  const digitAnimationIndexRef = useRef(0);
  function setDigitAnimationIndexRef(point) {
    digitAnimationIndexRef.current = point;
  }

  const exampleNumber = [5, 3, 8, 1, 2];

  const [currentDigitNumber, setCurrentDigitNumber] = useState([
    "",
    "",
    "",
    "",
    "",
  ]);

  const [currentDigit, setCurrentDigit] = useState([
    " current-digit",
    "",
    "",
    "",
    "",
  ]);

  function tickDigitAnimation() {
    if (digitAnimationIndexRef.current > 24) {
      setDigitAnimationIndexRef(0);
    } else if (digitAnimationIndexRef.current > currentDigitNumber.length) {
      setDigitAnimationIndexRef(digitAnimationIndexRef.current + 1);
    } else {
      let newCurrentDigit = [];
      let newCurrentNumbers = [];
      for (let i = 0; i < currentDigitNumber.length; i++) {
        if (i === digitAnimationIndexRef.current) {
          newCurrentDigit.push(" current-digit");
        } else {
          newCurrentDigit.push("");
        }
      }
      let max = Math.min(
        digitAnimationIndexRef.current,
        currentDigitNumber.length
      );
      for (let i = 0; i < max; i++) {
        newCurrentNumbers.push(exampleNumber[i]);
      }
      while (newCurrentNumbers.length < currentDigitNumber.length) {
        newCurrentNumbers.push("");
      }
      setCurrentDigit(newCurrentDigit);
      setCurrentDigitNumber(newCurrentNumbers);
      setDigitAnimationIndexRef(digitAnimationIndexRef.current + 1);
    }
  }

  /* The following functions are used to animate the flip that occurs in examples 2/3
  /* Used for the tickFlipAnimation */
  const flipAnimationTimingRef = useRef();
  function setFlipAnimationTimingRef(point) {
    flipAnimationTimingRef.current = point;
  }

  const flipKeyframe = useRef(0);
  function setFlipKeyframe(point) {
    flipKeyframe.current = point;
  }

  const flipClassList = [
    " yellow delay-4",
    " green delay-3",
    " grey delay-2",
    " yellow delay-1",
    " grey delay-0",
    " higher",
    " lower",
  ];

  const [currentClassList, setCurrentClassList] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  function tickFlipAnimation() {
    if (flipKeyframe.current === 5) {
      setCurrentClassList(flipClassList);
      setFlipKeyframe(flipKeyframe.current + 1);
    } else if (flipKeyframe.current === 26) {
      setCurrentClassList(["", "", "", "", "", "", ""]);
      setFlipKeyframe(1);
    } else {
      setFlipKeyframe(flipKeyframe.current + 1);
    }
  }

  return (
    <div
      className={"instructions-modal" + displayInstructions}
      onClick={(e) => hideInstructionsModal(e)}
    >
      <div className="instructions">
        <span className="instructions-top">
          <button
            className="close-instructions"
            onClick={(e) => hideInstructionsButton(e)}
          >
            X
          </button>
        </span>
        <span className="headline">How to play</span>
        <div className="instructions-text">
          Guess the correct number in six tries.
        </div>
        <div className="game-example current-row">
          <div className={"digit" + currentDigit[0]}>
            {currentDigitNumber[0]}
          </div>
          <div className={"digit" + currentDigit[1]}>
            {currentDigitNumber[1]}
          </div>
          <div className={"digit" + currentDigit[2]}>
            {currentDigitNumber[2]}
          </div>
          <div className={"digit" + currentDigit[3]}>
            {currentDigitNumber[3]}
          </div>
          <div className={"digit" + currentDigit[4]}>
            {currentDigitNumber[4]}
          </div>
          <div className="hint"></div>
        </div>
        <div className="instructions-text">
          Arrows tell you to guess higher or lower.
        </div>
        <div className="game-example previous-row">
          <div className={"digit" + currentClassList[0] + currentClassList[5]}>
            5
          </div>
          <div className={"digit" + currentClassList[1] + currentClassList[5]}>
            3
          </div>
          <div className={"digit" + currentClassList[2] + currentClassList[5]}>
            8
          </div>
          <div className={"digit" + currentClassList[3] + currentClassList[5]}>
            1
          </div>
          <div className={"digit" + currentClassList[4] + currentClassList[5]}>
            2
          </div>
          <div className={"hint" + currentClassList[5]}></div>
        </div>
        <div className="game-example previous-row">
          <div className={"digit" + currentClassList[0] + currentClassList[6]}>
            5
          </div>
          <div className={"digit" + currentClassList[1] + currentClassList[6]}>
            3
          </div>
          <div className={"digit" + currentClassList[2] + currentClassList[6]}>
            8
          </div>
          <div className={"digit" + currentClassList[3] + currentClassList[6]}>
            1
          </div>
          <div className={"digit" + currentClassList[4] + currentClassList[6]}>
            2
          </div>
          <div className={"hint" + currentClassList[6]}></div>
        </div>
        <hr></hr>
        <div className="instructions-text">
          Colors indicate the spot the digit should be in.
        </div>
        <hr></hr>
        <div className="instructions-text">
          Green digits are in the correct spot.
        </div>
        <div className="game-example colors-example">
          <div className="digit">5</div>
          <div className="digit green current-digit">3</div>
          <div className="digit">8</div>
          <div className="digit">1</div>
          <div className="digit">2</div>
          <div className="hint"></div>
        </div>
        <div className="instructions-text">
          Yellow digits are in wrong spot.
        </div>
        <div className="game-example colors-example">
          <div className="digit yellow current-digit">5</div>
          <div className="digit">3</div>
          <div className="digit">8</div>
          <div className="digit yellow current-digit">1</div>
          <div className="digit">2</div>
          <div className="hint"></div>
        </div>
        <div className="instructions-text">Grey digits are not used again.</div>
        <div className="game-example colors-example">
          <div className="digit">5</div>
          <div className="digit">3</div>
          <div className="digit grey current-digit">8</div>
          <div className="digit">1</div>
          <div className="digit grey current-digit">2</div>
          <div className="hint"></div>
        </div>
      </div>
    </div>
  );
}

export default InstructionsFive;
