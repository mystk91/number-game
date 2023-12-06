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
    if (resObj.session) {
      const options = {
        method: "POST",
        body: JSON.stringify(resObj),
        withCredentials: true,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      let checkPremium = await fetch("/api/checkPremium", options);
      let checkPremiumObj = await checkPremium.json();

      if (checkPremiumObj.premium) {
        console.log("giving you the random game page");
        setGamePage(
          <div className="game-page">
            <NavbarRandom digits={props.digits} user={resObj} />
            <NumberGameRandom
              digits={props.digits}
              attempts={props.attempts}
              user={resObj}
            />
          </div>
        );
      } else {
        window.location = "/random/info";
      }
    } else {
      window.location = "/login";
    }
  }

  return gamePage;
}

export default GamePageRandom;
