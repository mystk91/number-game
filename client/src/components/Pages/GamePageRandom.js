import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import "../../normalize.css";
import "../../custom.css";
import NavbarRandom from "../Navbar/NavbarRandom";
import NumberGameRandom from "../Game/NumberGameRandom";

//Creates a standard page for the website that displays the navbar and the game
function GamePageRandom(props) {
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
        <NavbarRandom
          digits={props.digits}
          user={resObj}
        />
        <NumberGameRandom digits={props.digits} attempts={props.attempts} />
      </div>
    );
  }

  return gamePage;
}

export default GamePageRandom;
