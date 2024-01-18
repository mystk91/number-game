import React, { useState, useEffect, useRef, useCallback } from "react";
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
    <div className={"random-mode-modal" + displayInstructions} aria-label="Random Mode Info Modal">
      <div className="random-mode-info" aria-label="Random Mode Info">
        <span className="random-mode-top">
          <button
            className="close-random-mode"
            onClick={(e) => hideInstructionsButton(e)}
            aria-label="Close Random Mode Info"
          >
            X
          </button>
        </span>
        <div className="random-mode-info-body">
          <div className="headline-container">
            <h1 className="headline">Random Mode</h1>
          </div>
          <div className="random-mode-features">
            <div className="random-info-text">
              Play unlimited games with Random Mode!
            </div>
            <div>
              <div className="video-container">
                <video
                  src="./images/site/randomMode.mp4"
                  poster="./images/site/random-mode-video-poster.png"
                  className="random-mode-video"
                  autoPlay={true}
                  loop={true}
                  playsInline={true}
                  type="video/mp4"
                  id="random-mode-video"
                  rel="preload"
                  alt="Numbler game is being reset after a game is completed. A new game begins."
                ></video>
              </div>
            </div>
          </div>

          <div className="random-mode-features leaderboard-feature">
            <div className="random-info-text">Climb the Leaderboards!</div>
            <img
              src="./images/site/leaderboard-example3.png"
              alt="A leaderboard filled with player names and scores."
              className="leaderboard-img"
            />
          </div>
          <hr></hr>
          <div className="random-mode-features">
            <img
              src="./images/site/random-modes.png"
              alt="Buttons showing the 6 different game modes. 2-7 random digits."
              className="random-modes-img"
            ></img>
            <div className="random-info-text product">
              6 Random Game Modes for $6
            </div>
          </div>
          <a href="/products/random-mode">
            <button className="random-modal-btn sign-up">Sign me up!</button>
          </a>

          <button
            className="continue random-modal-btn"
            onClick={(e) => hideInstructionsButton(e)}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdRandomModal;
