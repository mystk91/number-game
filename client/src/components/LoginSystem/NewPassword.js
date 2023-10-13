import React, { useState, useEffect, useRef } from "react";
import "./NewPassword.css";
import "../../normalize.css"
import "../../custom.css";
import { useParams } from "react-router-dom";
import LoadingIcon from "../Parts/LoadingIcon";

//Used for the page that DOES the password reset.
function NewPassword(props) {
  //Used to switch screens after the user inputs
  const [currentScreen, setCurrentScreen] = useState();
  const [hideForm, setHideForm] = useState("");

  //Sets the verification code so it can be passed in while changing password
  const verficationCodeRef = useRef();
  function setVerificationCodeRef(point) {
    verficationCodeRef.current = point;
  }
  setVerificationCodeRef(useParams().verificationCode);

  //Used to give focus to the form input on load
  const inputReference = useRef(null);

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    inputReference.current.focus();
    return () => {};
  }, []);

  //Used to keep track of the inputed values
  const [passwordValue, setPasswordValue] = useState("");

  //Used to set the errors that occur if password is invalid.
  const [errPassword, setErrPassword] = useState();

  //Used to display Password input errors
  function displayPasswordErrors() {
    let passwordRegExp = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$"
    );
    if (!passwordRegExp.test(passwordValue)) {
      setErrPassword(
        <div className="error">
          Passwords must be at least 8 characters and have an uppercase and
          lowercase letter, a number, and a special character.
        </div>
      );
      return false;
    } else {
      setErrPassword();
      return true;
    }
  }
  //Resets the password if there is a valid password reset request
  async function resetPasswordSubmit(e) {
    e.preventDefault();
    let noPasswordErrors = displayPasswordErrors();
    if (noPasswordErrors) {
      setHideForm(" hide");
      setCurrentScreen(loadingScreen);
      const url = "/api/change-password";
      const formData = new FormData(e.target);
      const formDataObj = Object.fromEntries(formData.entries());
      formDataObj.verificationCode = verficationCodeRef.current;
      const formDataString = JSON.stringify(formDataObj);
      const options = {
        method: "POST",
        body: formDataString,
        withCredentials: true,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      let res = await fetch(url, options);
      if (res.status == 200) {
        setCurrentScreen(successScreen);
        document.addEventListener("keydown", closeSuccessScreen, true);
      } else {
        let errors = await res.json();
        if (errors.errorFound) {
          setCurrentScreen();
          setHideForm("");
          setErrPassword(<div className="error">{errors.password}</div>);
        } else {
          setCurrentScreen(failureScreen);
        }
      }
    }
  }

  //A spinning wheel that indicates loading
  let loadingScreen = <LoadingIcon />;

  //The screen that appears if the password change failed
  let failureScreen = (
    <div className="reset-password-failure-container">
      <div className="reset-failure-message">
        This password reset link has expired or does not exist.
      </div>
    </div>
  );

  //The screen that appears if the password change was successfull
  let successScreen = (
    <div className="reset-password-success-container">
      <div className="reset-success-message">Your password has been reset.</div>
      <a href="/login">
        <button className="submit-btn">Go to Login</button>
      </a>
    </div>
  );

  //An event function that will redirect you to the login page by pressing "Enter"
  function closeSuccessScreen(e) {
    e.stopPropagation();
    if (e.key == "Enter") {
      setCurrentScreen();
      document.removeEventListener("keydown", closeSuccessScreen, true);
      window.location = "/login";
    }
  }

  return (
    <div className="new-password">
      {currentScreen}
      <div className={"reset-password-form-container" + hideForm}>
        <form
          method="POST"
          className="reset-password-form"
          onSubmit={(e) => resetPasswordSubmit(e)}
        >
          <div>
            <label htmlFor="password" className="reset-password-label">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              onBlur={displayPasswordErrors}
              ref={inputReference}
            />
            {errPassword}
          </div>
          <div>
            <button type="submit" className="submit-btn">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewPassword;
