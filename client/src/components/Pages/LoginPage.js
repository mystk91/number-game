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
import LoginRegular from "../LoginSystem/LoginRegular";

//Creates the page used for password reset
function NewPasswordPage(props) {
  return (
    <div className="new-password-page">
      <Navbar digits={0} login={false}/>
      <LoginRegular />
    </div>
  );
}

export default NewPasswordPage;
