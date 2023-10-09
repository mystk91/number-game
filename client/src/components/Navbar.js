import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import update from "immutability-helper";
import uniqid from "uniqid";
import "./Navbar.css";
import "../normalize.css";
import "../custom.css";
import { Link } from "react-router-dom";
import Instructions from "./Instructions";
import ProfileDropdown from "./ProfileDropdown";
import Login from "./Login";

function Navbar(props) {
  const [property, setProperty] = useState("initialValue");
  const propRef = useRef("initialValue");
  function setPropRef(point) {
    propRef.current = point;
  }

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    setGameModesButton(gameModesButtonHTML);
    setGameModesList();
    addInstructions();
    //addLoadingProfileButton();
    addProfileButton();
    return () => {};
  }, []);
  //componentDidUpdate, runs after render
  useEffect(() => {}, [property]);
  //componentDismount
  useEffect(() => {
    return () => {};
  });

  const [gameModesButton, setGameModesButton] = useState();
  const [gameModesList, setGameModesList] = useState();
  const [profileButton, setProfileButton] = useState();

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
      setModal(<Instructions />);
      localStorage.setItem("previouslyVisited", "true");
    }
  }

  //Displays the instruction modal
  function instructionsButton() {
    setModal(<Instructions key={new Date()} />);
  }

  //Adds a temp profile button icon
  function addLoadingProfileButton() {
    let buttonHTML = (
        <button className="login-btn">
          <img src="/images/site/account2.png" />
        </button>
    );
    setProfileButton(buttonHTML);
  }

  //Adds either the login form or the profile dropdown options the webpage
  async function addProfileButton() {
    const url = "/api/isAuthenticated";
    const options = {
      method: "GET",
      body: null,
      withCredentials: true,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    let res = await fetch("/api/isAuthenticated");
    if (res.status == 200) {
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
        <img src={getProfileImage()} />
      </button>
  );

  let profileDropdownHiddenHTML = (
    <div>
      <button className="profile-btn" onClick={showProfileDropdown}>
        <img src={getProfileImage()} />
      </button>
      <ProfileDropdown hidden="true" key="profileDropdownHidden" />
    </div>
  );

  let profileDropdownVisibleHTML = (
    <div>
      <button className="profile-btn clicked">
        <img src={getProfileImage()} />
      </button>
      <ProfileDropdown key="profileDropdownVisisble" />
    </div>
  );

  function getProfileImage() {
    return "./images/account/profile-images/logged-in.png";
  }

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

  //Displays the premium modal
  function premiumButton() {}

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
            <button className="instructions-btn" onClick={instructionsButton}>
              <img src="/images/site/whiteQuestionMark.png" />
            </button>
          </li>
          <li className="profile-btn-container">{profileButton}</li>
          <li>
            <button className="premium-btn" onClick={premiumButton}>
              <img src="/images/site/dollarSign.png" />
            </button>
          </li>
        </ul>
      </nav>
    </nav>
  );
}

export default Navbar;
