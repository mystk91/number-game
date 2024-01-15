import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Navbar.css";
import "../../normalize.css";
import "../../custom.css";
import Instructions from "./Instructions";
import InstructionsFive from "./InstructionsFive";
import ProfileDropdown from "./ProfileDropdown";
import CalendarIcon from "../Parts/CalendarIcon";
import Login from "../LoginSystem/Login";

//Creates the Random Navbar at the top of the page.
//Contains links for other game modes, the instructions, the login system
// props.digits - used to display either instructions either with 4 digits or 5 digits
function NavbarRandom(props) {
  //Used to set the profile button / image
  const [profileButton, setProfileButton] = useState();
  const profileImageRef = useRef();
  function setProfileImageRef(point) {
    profileImageRef.current = point;
  }

  //Used to hide the instructions button on pages that don't have the game on them
  const [invisibleInstructions, setInvisibleInstructions] = useState("");
  //Used to hide the login / profile button on the login page
  const [invisibleLogin, setInvisibleLogin] = useState("");

  //Used to add the button that swaps from random mode to daily mode
  const [swapButtonLink, setSwapButtonLink] = useState(`digits${props.digits}`);

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    if (props.digits === 0) {
      setInvisibleInstructions(" invisible");
    }
    if (props.login === false) {
      setInvisibleLogin(" invisible");
    }
    addInstructions();
    addProfileButton();
    highlightDigitButton();
    setGameModesButton(gameModesButtonHTML);
    setGameModesList();
    if (!props.digits) {
      setSwapButtonLink("/digits5");
    }
    return () => {};
  }, [profileImageRef.current]);

  //Used to display and reveal the game modes
  const [gameModesButton, setGameModesButton] = useState();
  const [gameModesList, setGameModesList] = useState();

  let gameModesButtonHTML = (
    <button
      className="game-modes-button"
      onClick={displayGameModes}
      onMouseOver={displayGameModes}
      aria-label="Game Modes"
    >
      Game Modes
    </button>
  );

  let gameModesButtonHTMLClicked = (
    <button className="game-modes-button clicked" aria-label="Game Modes">
      Game Modes
    </button>
  );

  let listVisible = (
    <ul className="game-modes-list-mobile visible" aria-label="Game Modes">
      <li>
        <a href="/random2">2 Random</a>
      </li>
      <li>
        <a href="/random3">3 Random</a>
      </li>
      <li>
        <a href="/random4">4 Random</a>
      </li>
      <li>
        <a href="/random5">5 Random</a>
      </li>
      <li>
        <a href="/random6">6 Random</a>
      </li>
      <li>
        <a href="/random7">7 Random</a>
      </li>
      <li>
        <a href={swapButtonLink}>Daily Games</a>
      </li>
    </ul>
  );

  let listHidden = (
    <ul className="game-modes-list-mobile hidden">
      <li>
        <a href="/random2">2 Random</a>
      </li>
      <li>
        <a href="/random3">3 Random</a>
      </li>
      <li>
        <a href="/random4">4 Random</a>
      </li>
      <li>
        <a href="/random5">5 Random</a>
      </li>
      <li>
        <a href="/random6">6 Random</a>
      </li>
      <li>
        <a href="/random7">7 Digits</a>
      </li>
      <li>
        <a href={swapButtonLink}>Daily Games</a>
      </li>
    </ul>
  );

  //Hides the game list
  const hideGameModes = useCallback((e) => {
    if (hoverDropUpRef.current) {
      setHoverDropUpRef(false);
      setGameModesList(listHidden);
      setGameModesButton(gameModesButtonHTML);
      document.removeEventListener("click", hideGameModes);
      setTimeout(() => {
        setGameModesList();
      }, 300);
    }
  }, []);

  //Shows the game modes list
  function displayGameModes(e) {
    setGameModesList(listVisible);
    setGameModesButton(gameModesButtonHTMLClicked);
    setHoverDropUpRef(true);
    e.stopPropagation();
    document.addEventListener("click", hideGameModes);
  }

  //Used to display the modals from the buttons on the tool-bar
  const [modal, setModal] = useState();

  //Adds the instructions the first time user visits the page
  function addInstructions() {
    if (!localStorage.getItem("previouslyVisited")) {
      if (props.digits >= 5) {
        setModal(<InstructionsFive key={new Date()} />);
        localStorage.setItem("previouslyVisited", 1);
      } else if (props.digits >= 2) {
        setModal(<Instructions key={new Date()} />);
        localStorage.setItem("previouslyVisited", 1);
      }
    }
  }

  //Displays the instruction modal
  function instructionsButton() {
    if (props.digits >= 5) {
      setModal(<InstructionsFive key={new Date()} />);
    } else if (props.digits >= 2) {
      setModal(<Instructions key={new Date()} />);
    }
  }

  //Adds either the login form or the profile dropdown option
  async function addProfileButton() {
    if (props.user.loggedIn) {
      setProfileImageRef(props.user.imageUrl);
      setProfileButton(profileDropdownInitialHTML());
    } else {
      let buttonHTML = (
        <button
          className="login-btn"
          onClick={loginButton}
          aria-label="Login or Sign up"
        >
          <img src={props.user.imageUrl} alt="Icon of a person" />
        </button>
      );
      setProfileButton(buttonHTML);
    }
  }

  //Used to control the profile dropdown
  const profileHoverUpRef = useRef();
  function setProfileHoverUpRef(point) {
    profileHoverUpRef.current = point;
  }

  //Hides the profile dropdown on click
  const hideProfileDropdown = useCallback((e) => {
    if (profileHoverUpRef.current) {
      setProfileHoverUpRef(false);
      setProfileButton(profileDropdownHiddenHTML());
      document.removeEventListener("click", hideProfileDropdown);
    }
  }, []);

  //Shows the profile Dropdown
  function showProfileDropdown(e) {
    setProfileHoverUpRef(true);
    setProfileButton(profileDropdownVisibleHTML());
    e.stopPropagation();
    document.addEventListener("click", hideProfileDropdown);
  }

  function profileDropdownInitialHTML() {
    return (
      <button
        className="profile-btn"
        onClick={showProfileDropdown}
        onMouseOver={showProfileDropdown}
        aria-label="Profile Dropdown"
      >
        <img src={profileImageRef.current} alt="Your Profile Icon" />
      </button>
    );
  }

  function profileDropdownHiddenHTML() {
    return (
      <div>
        <button
          className="profile-btn"
          aria-label="Profile Dropdown"
          onClick={showProfileDropdown}
          onMouseOver={showProfileDropdown}
        >
          <img src={profileImageRef.current} alt="Your Profile Icon" />
        </button>
        <ProfileDropdown hidden="true" key="profileDropdownHidden" />
      </div>
    );
  }

  function profileDropdownVisibleHTML() {
    return (
      <div onMouseLeave={hideProfileDropdown}>
        <button className="profile-btn clicked" aria-label="Profile Dropdown">
          <img src={profileImageRef.current} alt="Your Profile Icon" />
        </button>
        <ProfileDropdown key="profileDropdownVisisble" user={props.user} />
      </div>
    );
  }

  //Displays the login modal
  function loginButton() {
    setModal(<Login key={new Date()} />);
  }

  //Used to turn off drop-up animation when button is clicked again
  let hoverDropUpRef = useRef(false);
  function setHoverDropUpRef(point) {
    hoverDropUpRef.current = point;
  }

  //Used to highlight the currently selected digit button
  const currentDigitRef = useRef({
    digits2: "",
    digits3: "",
    digits4: "",
    digits5: "",
    digits6: "",
    digits7: "",
  });
  function setCurrentDigitRef(point) {
    currentDigitRef.current = point;
  }
  //Highlights the "digits" button for the current page
  //Called when page loads
  function highlightDigitButton() {
    let objCopy = {};
    Object.entries(currentDigitRef.current).forEach((x) => {
      objCopy[x[0]] = x[1];
    });
    objCopy[`digits${props.digits}`] = "current";
    setCurrentDigitRef(objCopy);
  }

  return (
    <div className="navigation-bar-container">
      {modal}
      <nav className="navigation-bar random">
        <div className="game-modes" aria-label="Game Modes Container">
          <ul
            className="game-modes-list random-game-modes-list"
            aria-label="Game Modes"
          >
            <li>
              <a
                href="/random2"
                className={currentDigitRef.current["digits2"]}
                aria-label="2 Random"
              >
                2 <img src="/images/site/randomDice.png" alt="" />
              </a>
            </li>
            <li>
              <a
                href="/random3"
                className={currentDigitRef.current["digits3"]}
                aria-label="3 Random"
              >
                3 <img src="/images/site/randomDice.png" alt="" />
              </a>
            </li>
            <li>
              <a
                href="/random4"
                className={currentDigitRef.current["digits4"]}
                aria-label="4 Random"
              >
                4 <img src="/images/site/randomDice.png" alt="" />
              </a>
            </li>
            <li>
              <a
                href="/random5"
                className={currentDigitRef.current["digits5"]}
                aria-label="5 Random"
              >
                5 <img src="/images/site/randomDice.png" alt="" />
              </a>
            </li>
            <li>
              <a
                href="/random6"
                className={currentDigitRef.current["digits6"]}
                aria-label="6 Random"
              >
                6 <img src="/images/site/randomDice.png" alt="" />
              </a>
            </li>
            <li>
              <a
                href="/random7"
                className={currentDigitRef.current["digits7"]}
                aria-label="7 Random"
              >
                7 <img src="/images/site/randomDice.png" alt="" />
              </a>
            </li>
            <li>
              <a href={swapButtonLink} aria-label="Swap to Random Mode">
                <CalendarIcon />
              </a>
            </li>
          </ul>
        </div>

        <div className="game-modes-container" aria-label="Game Modes Container">
          <div className="game-modes-mobile" onMouseLeave={hideGameModes}>
            {gameModesButton}
            {gameModesList}
          </div>
        </div>

        <div className="logo random" aria-label="Website Banner">
          <img
            src="/images/site/randomDice.png"
            className="random-mode left"
            alt=""
          />
          <div className="logo-banner">
            <img
              className="site-banner"
              src="/images/site/site-banner.png"
              alt="Website banner that says 'Numbler'"
            />
          </div>
          <div className="logo-small">
            <img
              src="/images/site/logo.png"
              alt="Website banner that says 'Numbler'"
            />
          </div>
          <img
            src="/images/site/randomDice.png"
            className="random-mode right"
            alt=""
          />
        </div>

        <ul className="tools" aria-label="Links">
          <li>
            <button
              aria-label="Instructions"
              className={"instructions-btn" + invisibleInstructions}
              onClick={instructionsButton}
            >
              <img
                src="/images/site/whiteQuestionMark.png"
                alt="Question Mark Icon"
              />
            </button>
          </li>
          <li className={"profile-btn-container" + invisibleLogin}>
            {profileButton}
          </li>
          <li>
            <a href="/leaderboards" aria-label="Leaderboards">
              <button className="leaderboards-btn">
                <img src="/images/site/trophy.png" alt="Trophy Icon" />
              </button>
            </a>
          </li>
          <li>
            <a
              href={swapButtonLink}
              className="swap-modes"
              aria-label="Swap to Daily mode"
            >
              <button className="dailyMode-btn">
                <CalendarIcon />
              </button>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavbarRandom;
