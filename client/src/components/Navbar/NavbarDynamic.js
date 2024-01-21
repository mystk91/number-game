import React, { useState, useEffect, useRef } from "react";
import "../../normalize.css";
import "../../custom.css";
import Navbar from "./Navbar";
import NavbarDaily from "./NavbarDaily";
import NavbarRandom from "./NavbarRandom";

/*Creates a navbar based on if user is logged in / signed up to random mode
  props.digits - the number of digits the game has
  props.user - takes a user resObj that was fetched from a higher order component
*/
function NavbarDynamic(props) {
  const [navbar, setNavbar] = useState(
    <div className="navigation-bar-container">
      <nav className="navigation-bar"></nav>
    </div>
  );

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

  //Checks if user is logged in and if they have random mode, sets a Navbar
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
    } else {
      let res = await fetch("/api/profile_picture");
      resObj = await res.json();
    }
    if (resObj.session) {
      if (resObj.premium) {
        if (sessionStorage.getItem("currentMode") === "random") {
          setNavbar(
            <NavbarRandom
              digits={props.digits}
              user={resObj}
              instructions={props.instructions}
              login={props.login}
            />
          );
        } else {
          setNavbar(
            <NavbarDaily
              digits={props.digits}
              user={resObj}
              instructions={props.instructions}
              login={props.login}
            />
          );
        }
      } else {
        setNavbar(
          <Navbar
            digits={props.digits}
            user={resObj}
            instructions={props.instructions}
            login={props.login}
          />
        );
      }
    } else {
      setNavbar(
        <Navbar
          digits={props.digits}
          user={resObj}
          instructions={props.instructions}
          login={props.login}
        />
      );
    }
  }

  return navbar;
}

export default NavbarDynamic;
