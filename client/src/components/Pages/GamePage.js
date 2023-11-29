import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import "../../normalize.css";
import "../../custom.css";
import Navbar from "../Navbar/Navbar";
import NumberGame from "../Game/NumberGame";

//Creates a standard page for the website that displays the navbar and the game
function GamePage(props) {
  let [gamePage, setGamePage] = useState();

  //Runs on mount. Gets users profile pic and starts game
  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

  async function fetchUser() {
    let res = await fetch("/api/profile_picture");
    let resObj = await res.json();
    setGamePage(
      <div className="game-page">
        <Navbar digits={props.digits} user={resObj} />
        <NumberGame digits={props.digits} attempts={props.attempts} />
      </div>
    );
  }

  return gamePage;
}

export default GamePage;
