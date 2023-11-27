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
import SignupRegular from "../LoginSystem/SignupRegular";

//Creates the page used for password reset
function NewPasswordPage(props) {
  return (
    <div className="new-password-page">
      <Navbar digits={0}/>
      <SignupRegular />
    </div>
  );
}

export default NewPasswordPage;
