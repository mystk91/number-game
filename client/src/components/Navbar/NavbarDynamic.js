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
  const [navbar, setNavbar] = useState();

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
        if (sessionStorage.getItem("currentMode") === "random") {
          setNavbar(<NavbarRandom digits={props.digits} user={resObj} />);
        } else {
          setNavbar(<NavbarDaily digits={props.digits} user={resObj} />);
        }
      } else {
        setNavbar(<Navbar digits={props.digits} user={resObj} />);
      }
    } else {
      setNavbar(<Navbar digits={props.digits} user={resObj} />);
    }
  }

  return navbar;
}

export default NavbarDynamic;
