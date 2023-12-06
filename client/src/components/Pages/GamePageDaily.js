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
import NavbarDynamic from "../Navbar/NavbarDynamic";

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
    let resObj;
    let profile = localStorage.getItem("profile");
    if (props.user) {
      resObj = props.user;
    } else if (profile) {
      let profileObj = JSON.parse(profile);
      resObj = {
        session: profileObj.session,
        imageUrl: profileObj.profile_picture,
        loggedIn: true,
      };
      console.log("using local object " + resObj);
    } else {
      let res = await fetch("/api/profile_picture");
      resObj = await res.json();
    }
    if (resObj.loggedIn) {
      console.log("giving you the daily dynamic game page");
      setGamePage(
        <div className="game-page">
          <NavbarDynamic digits={props.digits} user={resObj} />
          <NumberGameRegular digits={props.digits} attempts={props.attempts} user={resObj} />
        </div>
      );
    } else {
      console.log("giving you the local storage page");
      setGamePage(
        <div className="game-page">
          <Navbar digits={props.digits} user={resObj} />
          <NumberGameLocal digits={props.digits} attempts={props.attempts} user={resObj} />
        </div>
      );
    }
  }

  return gamePage;
}

export default GamePageDaily;
