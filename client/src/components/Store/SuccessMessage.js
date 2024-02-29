import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  useCallback,
} from "react";
import "./SuccessMessage.css";
import "../../normalize.css";
import "../../custom.css";
import CalendarIcon from "../Parts/CalendarIcon";

//Used to create a confirmation / update message for the user.
//Redirects the user to a different page when they click on the confirmation button
function SuccessMessage(props) {
  const [buttonText, setButtonText] = useState("Play a Game");
  const [buttonUrl, setButtonUrl] = useState("/random5");

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    document.addEventListener("keydown", confirmMessage, true);
    return () => {
      document.removeEventListener("keydown", confirmMessage, true);
    };
  }, []);

  //Goes to the link when you hit enter
  const confirmMessage = useCallback((e) => {
    e.stopPropagation();
    if (e.key == "Enter") {
      window.location = buttonUrl;
    }
  }, []);

  return (
    <div className="site-message">
      <div className="success-message-container" aria-label="Message Container">
        <div className="random-mode-success-message">
          <h1>Success!</h1>
          <div className="message-text">
            <p>You have signed up for Random Mode!</p>
          </div>

          <div className="game-mode-icons" aria-label="Game Mode Icons">
            <CalendarIcon />
            <div className="random-mode-icon" aria-label="Random Mode Icon">
              <img
                src="/images/site/randomDice.png"
                alt="Random mode icon with a six sided dice"
              />
            </div>
          </div>

          <p>
            You can switch between Daily Mode and Random Mode by clicking the
            calendar/dice icons respectively.
          </p>
        </div>
        <a href={buttonUrl}>
          <button className="confirmation-btn">{buttonText}</button>
        </a>
      </div>
    </div>
  );
}

export default SuccessMessage;
