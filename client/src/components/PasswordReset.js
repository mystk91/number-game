import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import update from "immutability-helper";
import uniqid from "uniqid";
import "./PasswordReset.css";
import "../normalize.css";
import "../custom.css";
import { Link } from "react-router-dom";

//Used for the page that DOES the password reset.
function PasswordReset(props) {
  const [property, setProperty] = useState("initialValue");
  const propRef = useRef("initialValue");
  function setPropRef(point) {
    propRef.current = point;
  }

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    return () => {};
  }, []);

  //Resets the password if there is a valid password reset request
  function resetPasswordSubmit(){

  }

  return (
    <form
      method="POST"
      className="reset-password-form"
      onSubmit={(e) => resetPasswordSubmit(e)}
    >
      <div>
        <label htmlFor="password">New Password</label>
        <input
          id="email"
          name="email"
          type="text"
          value={passwordValue}
          onChange={(e) => setPasswordValue(e.target.value)}
          onBlur={displayPasswordErrors}
        />
        {errPassword}
      </div>
      <div>
        <button type="submit" className="submit-btn">
          Reset Password
        </button>
      </div>
    </form>
  );
}

export default PasswordReset;
