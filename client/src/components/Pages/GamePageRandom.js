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
import SiteMessagePage from "./SiteMessagePage";

//Creates a standard page for the website that displays the navbar and the game
function GamePageRandom(props) {
  let [gamePage, setGamePage] = useState();

  //Runs on mount. Gets users profile pic and starts game
  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

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

    if (user.premium) {
      document.title=`Numbler - ${props.digits} Random`
      setGamePage(
        <div className="game-page">
          <NavbarRandom digits={props.digits} user={user} />
          <NumberGameRandom
            digits={props.digits}
            attempts={props.attempts}
            user={user}
          />
        </div>
      );
    } else if (user.loggedIn) {
      document.title=`Numbler - Error`
      setGamePage(<SiteMessagePage message="You do not have Random Mode" buttonText="Get Random Mode!" buttonUrl="/products/random-mode"/>)
    } else {
      localStorage.removeItem("profile");
      window.location = "/login";
    }
  }

  return gamePage;
}

export default GamePageRandom;
