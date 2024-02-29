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
import SiteMessagePage from "./SiteMessagePage";
import SuccessMessage from "../Store/SuccessMessage";

//Used as a landing page after user completes Random Mode purchase
function StoreSuccessPage(props) {
  let [page, setPage] = useState();

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

    if (user.premium) {
      setPage(
        <div className="game-page">
          <NavbarRandom digits={props.digits} user={user} />
          <SuccessMessage />
        </div>
      );
    } else {
      setPage(<SiteMessagePage message="You do not have Random Mode" buttonText="Get Random Mode!" buttonUrl="/products/random-mode"/>)
    }
  }

  return page;
}

export default StoreSuccessPage;
