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
import Login from "./Login";

function Navbar(props) {
  const [property, setProperty] = useState("initialValue");
  const propRef = useRef("initialValue");
  function setPropRef(point) {
    propRef.current = point;
  }

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    addInstructions();
    return () => {};
  }, []);
  //componentDidUpdate, runs after render
  useEffect(() => {}, [property]);
  //componentDismount
  useEffect(() => {
    return () => {};
  });

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

  //Displays the login modal
  function loginButton() {
    setModal(<Login key={new Date()} />);
  }

  //Displays the premium modal
  function premiumButton() {}

  return (
    <div>
      {modal}
      <nav className="navigation-bar">
        <div className="game-modes">
          <label className="game-modes-label">Game Modes</label>
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

        <div className="logo">Numblr</div>

        <ul className="tools">
          <li>
            <button className="instructions-btn" onClick={instructionsButton}>
              <img src="/images/site/whiteQuestionMark.png" />
            </button>
          </li>
          <li>
            <button className="login-btn" onClick={loginButton}>
              <img src="/images/site/account2.png" />
            </button>
          </li>
          <li>
            <button className="premium-btn" onClick={premiumButton}>
              <img src="/images/site/dollarSign.png" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
