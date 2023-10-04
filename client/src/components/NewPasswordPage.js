import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import "../normalize.css";
import "../custom.css";
import Navbar from "./Navbar";
import NewPassword from "./NewPassword";

//Creates the page used for password reset
function NewPasswordPage(props) {
  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    document.title = "Set New Password";
    return () => {};
  }, []);

  return (
    <div className="new-password-page">
      <Navbar />
      <NewPassword />
    </div>
  );
}

export default NewPasswordPage;
