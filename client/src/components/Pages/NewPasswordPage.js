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
import NewPassword from "../LoginSystem/NewPassword";

//Creates the page used for password reset
function NewPasswordPage(props) {
  let [passwordPage, setPasswordPage] = useState();

  //Runs on mount. Gets users profile pic and starts game
  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

  async function fetchUser() {
    let res = await fetch("/api/profile_picture");
    let resObj = await res.json();
    setPasswordPage(
      <div className="new-password-page">
        <Navbar digits={0} profilePic={resObj} />
        <NewPassword />
      </div>
    );
  }
}

export default NewPasswordPage;
