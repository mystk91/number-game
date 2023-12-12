import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";
import uniqid from "uniqid";
import "./AdRandomModal.css";
import "../../normalize.css";
import "../../custom.css";

//A modal that will pop-up when a new user visits the page or hits the question mark button.
//Gives a guide on how to play the game.
function AdRandomModal(props) {
  //Used to hide the modal after its done being used
  const [displayInstructions, setDisplayInstructions] = useState("");

  //Stops the game from being played when the modal is open
  const stopOtherKeydowns = useCallback((e) => {
    e.stopPropagation();
  }, []);

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    document.addEventListener("keydown", stopOtherKeydowns, true);
    return () => {
      document.removeEventListener("keydown", stopOtherKeydowns, true);
    };
  }, [stopOtherKeydowns]);


  /* Hides the modal when you click on the X */
  function hideInstructionsButton(e) {
    document.removeEventListener("keydown", stopOtherKeydowns, true);
    setDisplayInstructions(" hide-modal");
  }



  return (
    <div className={"random-mode-modal" + displayInstructions}>
      <div className="random-mode-info">
        <span className="random-mode-top">
          <button
            className="close-random-mode"
            onClick={(e) => hideInstructionsButton(e)}
          >
            X
          </button>
        </span>
        <div className="random-mode-info-body">
          <div className="headline-container">
        <h1 className="headline">Random Mode</h1>
        </div>
        <div className="random-info-text">Play unlimited games with Random Mode!</div>
        <hr></hr>
        <div className="random-info-text">Start a new game after you win!</div>
        <img src="./images/site/reset-every-time1.png" alt="Reset button at bottom of the game" className="reset-game-img"></img>

        <div className="random-info-text">Guess random numbers with 2 - 7 digits</div>
        <img src="./images/site/random-modes.png" alt="Different Random Game Modes" className="random-modes-img"></img>
        <div className="random-info-text product">6 Random Game Modes for $6</div>
        <a href="/products/random-mode"><button className="random-modal-btn sign-up">Sign me up!</button></a>
        <button className="continue random-modal-btn" onClick={(e) => hideInstructionsButton(e)}>Maybe Later</button>


        <hr></hr>
        </div>

      </div>
    </div>
  );
}

export default AdRandomModal;
