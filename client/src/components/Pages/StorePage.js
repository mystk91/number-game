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

//Creates a page for the website that takes a logged in user w/o random mode to the checkout
function StorePage(props) {
  let [storePage, setStorePage] = useState();

   //Checks if the user is logged in and sends them to checkout if they are
  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

  //Checks if the user is logged in and sends them to checkout if they are
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
      if (user.premium) {
        setStorePage(<div>You have already purchased random mode.</div>);
      } else {
        let profileObj = JSON.parse(profile);
        let res = await fetch("/create-checkout-session", {
          method: "POST",
          body: JSON.stringify(profileObj),
          withCredentials: true,
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        let resObj = await res.json();
        window.location = resObj.url;
      }
    } else {
      window.location = "/login";
    }
  }

  return storePage;
}

export default StorePage;
