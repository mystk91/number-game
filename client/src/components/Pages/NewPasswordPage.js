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
  return (
    <div className="new-password-page">
      <Navbar />
      <NewPassword />
    </div>
  );
}

export default NewPasswordPage;
