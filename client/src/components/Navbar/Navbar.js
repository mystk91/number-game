import React, { useState, useEffect, useRef } from "react";
import uniqid from "uniqid";
import "./Navbar.css";
import "../../normalize.css";
import "../../custom.css";
import Instructions from "./Instructions";
import InstructionsFive from "./InstructionsFive";
import ProfileDropdown from "./ProfileDropdown";
import Login from "../LoginSystem/Login";

//Creates the Navbar at the top of the page.
//Contains links for other game modes, the instructions, the login system
// props.digits - used to display either instructions either with 4 digits or 5 digits
function Navbar(props) {
  //Used to set the profile button / image
  const [profileButton, setProfileButton] = useState();
  const profileImageRef = useRef();
  function setProfileImageRef(point) {
    profileImageRef.current = point;
  }

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    setGameModesButton(gameModesButtonHTML);
    setGameModesList();
    addInstructions();
    addProfileButton();
    if (props.digits === 0) {
      setInvisibleInstructions(" invisible");
    }
    return () => {};
  }, [profileImageRef.current]);

  //Used to display and reveal the game modes
  const [gameModesButton, setGameModesButton] = useState();
  const [gameModesList, setGameModesList] = useState();

  //Used to hide the instructions button on pages that don't have the game on them
  const [invisibleInstructions, setInvisibleInstructions] = useState("");

  let gameModesButtonHTML = (
    <button className="game-modes-button" onClick={displayGameModes}>
      Game Modes
    </button>
  );

  let gameModesButtonHTMLClicked = (
    <button className="game-modes-button clicked">Game Modes</button>
  );

  let listVisible = (
    <ul className="game-modes-list-mobile visible">
      <li>
        <a href="/2digits">2 Digits</a>
      </li>
      <li>
        <a href="/3digits">3 Digits</a>
      </li>
      <li>
        <a href="/4digits">4 Digits</a>
      </li>
      <li>
        <a href="/5digits">5 Digits</a>
      </li>
      <li>
        <a href="/6digits">6 Digits</a>
      </li>
      <li>
        <a href="/7digits">7 Digits</a>
      </li>
    </ul>
  );

  let listHidden = (
    <ul className="game-modes-list-mobile hidden">
      <li>
        <a href="/2digits">2 Digits</a>
      </li>
      <li>
        <a href="/3digits">3 Digits</a>
      </li>
      <li>
        <a href="/4digits">4 Digits</a>
      </li>
      <li>
        <a href="/5digits">5 Digits</a>
      </li>
      <li>
        <a href="/6digits">6 Digits</a>
      </li>
      <li>
        <a href="/7digits">7 Digits</a>
      </li>
    </ul>
  );

  //Shows the game modes list
  function displayGameModes(e) {
    setGameModesList(listVisible);
    setGameModesButton(gameModesButtonHTMLClicked);
    e.stopPropagation();
    document.addEventListener("click", hideGameModes);
  }

  //Hides the game list
  function hideGameModes(e) {
    setGameModesList(listHidden);
    setGameModesButton(gameModesButtonHTML);
    document.removeEventListener("click", hideGameModes);
    setTimeout(() => {
      setGameModesList();
    }, 300);
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
    let res = await fetch("/api/profile_picture");
    let resObj = await res.json();
    if (resObj.loggedIn) {
      setProfileImageRef(resObj.imageURL);
      setProfileButton(profileDropdownInitialHTML);
    } else {
      let buttonHTML = (
        <button className="login-btn" onClick={loginButton}>
          <img src="/images/site/account2.png" />
        </button>
      );
      setProfileButton(buttonHTML);
    }
  }

  let profileDropdownInitialHTML = (
    <button className="profile-btn" onClick={showProfileDropdown}>
      <img src={profileImageRef.current} />
    </button>
  );

  let profileDropdownHiddenHTML = (
    <div>
      <button className="profile-btn" onClick={showProfileDropdown}>
        <img src={profileImageRef.current} />
      </button>
      <ProfileDropdown hidden="true" key="profileDropdownHidden" />
    </div>
  );

  let profileDropdownVisibleHTML = (
    <div>
      <button className="profile-btn clicked">
        <img src={profileImageRef.current} />
      </button>
      <ProfileDropdown key="profileDropdownVisisble" />
    </div>
  );

  //Shows the profile Dropdown
  function showProfileDropdown(e) {
    setProfileButton(profileDropdownVisibleHTML);
    e.stopPropagation();
    document.addEventListener("click", hideProfileDropdown);
  }

  //Hides the profile dropdown on click
  function hideProfileDropdown(e) {
    setProfileButton(profileDropdownHiddenHTML);
    document.removeEventListener("click", hideProfileDropdown);
  }

  //Displays the login modal
  function loginButton() {
    setModal(<Login key={new Date()} />);
  }

  return (
    <nav className="navigation-bar-container">
      {modal}
      <nav className="navigation-bar">
        <div className="game-modes">
          <ul className="game-modes-list">
            <li>
              <a href="/2digits">2 Digits</a>
            </li>
            <li>
              <a href="/3digits">3 Digits</a>
            </li>
            <li>
              <a href="/4digits">4 Digits</a>
            </li>
            <li>
              <a href="/5digits">5 Digits</a>
            </li>
            <li>
              <a href="/6digits">6 Digits</a>
            </li>
            <li>
              <a href="/7digits">7 Digits</a>
            </li>
          </ul>
        </div>

        <div className="game-modes-mobile">
          {gameModesButton}
          {gameModesList}
        </div>

        <div className="logo">Numblr</div>

        <ul className="tools">
          <li>
            <button
              className={"instructions-btn" + invisibleInstructions}
              onClick={instructionsButton}
            >
              <img src="/images/site/whiteQuestionMark.png" />
            </button>
          </li>
          <li className="profile-btn-container">{profileButton}</li>
          <li>
            <a href="/leaderboards">
              <button className="leaderboards-btn">
                <img src="/images/site/trophy.png" />
              </button>
            </a>
          </li>
          <li>
            <a href="/random/info">
              <button className="randomMode-btn">
                <img src="/images/site/randomDice.png" />
              </button>
            </a>
          </li>
        </ul>
      </nav>
    </nav>
  );
}

export default Navbar;
