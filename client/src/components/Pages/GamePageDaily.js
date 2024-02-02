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
    let user;
    let profile = localStorage.getItem("profile");
    if (profile) {
      let profileObj = JSON.parse(profile);
      const options = {
        method: "POST",
        body: JSON.stringify(profileObj),
        withCredentials: true,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      let res = await fetch("/api/account-info", options);
      let accountInfo = await res.json();
      user = {
        loggedIn: accountInfo.loggedIn,
        premium: accountInfo.premium,
        imageUrl: accountInfo.imageUrl,
        session: profileObj.session,
      };
    } else {
      user = {
        loggedIn: false,
        premium: false,
        imageUrl: "/images/site/account2.png",
      };
    }

    if (user.loggedIn) {
      console.log("giving you the daily dynamic game page");
      setGamePage(
        <div className="game-page">
          <NavbarDynamic digits={props.digits} user={user} />
          <NumberGameRegular
            digits={props.digits}
            attempts={props.attempts}
            user={user}
          />
        </div>
      );
    } else {
      console.log("giving you the local storage game page");
      localStorage.removeItem("profile");
      setGamePage(
        <div className="game-page">
          <Navbar digits={props.digits} user={user} />
          <NumberGameLocal
            digits={props.digits}
            attempts={props.attempts}
            user={user}
          />
        </div>
      );
    }
  }

  return gamePage;
}

export default GamePageDaily;
