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
import NavbarDaily from "../Navbar/NavbarDaily";
import NumberGameRegular from "../Game/NumberGameRegular";
import NumberGameLocal from "../Game/NumberGameLocal";

//Creates a page for the website that displays the navbar and the daily game
//The game page will either use localStorage or data from players account
function GamePageDaily(props) {
  let [gamePage, setGamePage] = useState();

  //Runs on mount. Checks if the user is logged in and sets the corresponding game page
  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

  //Checks if the user is logged in and sets the corresponding game page
  async function fetchUser() {
    let res = await fetch("/api/profile_picture");
    let resObj = await res.json();
    if (true){
    //if (resObj.loggedIn) {
      setGamePage(
        <div className="game-page">
          <NavbarDaily digits={props.digits} user={resObj} />
          <NumberGameRegular digits={props.digits} attempts={props.attempts} />
        </div>
      );
    } else {
      setGamePage(
        <div className="game-page">
          <Navbar digits={props.digits} user={resObj} />
          <NumberGameLocal digits={props.digits} attempts={props.attempts} />
        </div>
      );
    }
  }

  return gamePage;
}

export default GamePageDaily;
