import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ChangePassword.css";
import "../../normalize.css";
import "../../custom.css";

//Displays contact information for questsions / bugs
function ChangePassword(props) {
  //Used to keep track of the inputed values
  const [currentPasswordValue, setCurrentPasswordValue] = useState("");
  const [newPasswordValue, setNewPasswordValue] = useState("");

  //Used to display errors on the form
  let [currentPasswordErrs, setCurrentPasswordErrs] = useState();
  let [newPasswordErrs, setNewPasswordErrs] = useState();

  //Used for displaying success screen
  const [currentScreen, setCurrentScreen] = useState();
  const [hideThis, setHideThis] = useState("");

  //Used to give focus to the form input on load
  const inputReference = useRef(null);

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    inputReference.current.focus();
    return () => {};
  }, []);

  //Used to display Password input errors
  function displayPasswordErrors() {
    let passwordRegExp = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[!@#$%^&*_0-9]).{10,32}$"
    );
    if (!passwordRegExp.test(newPasswordValue)) {
      setNewPasswordErrs(
        <div className="error">
          Passwords must have at least 10 characters, an upper and lowercase
          letter, and a number or special character.
        </div>
      );
      return false;
    } else {
      setNewPasswordErrs();
      return true;
    }
  }

  //Attempts to change the password
  async function changePassword(e) {
    e.preventDefault();
    if (displayPasswordErrors()) {
      const url = "/api/profile-change-password";
      const formData = new FormData(e.target);
      const formDataObj = Object.fromEntries(formData.entries());
      formDataObj.user = props.user;
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
      let resObj = await res.json();
      if (!resObj.errors) {
        setHideThis(" hide");
        setCurrentScreen(successScreen);
      } else {
        setCurrentPasswordErrs(
          <div className="error">{resObj.errors.currentPassword}</div>
        );
        setNewPasswordErrs(
          <div className="error">{resObj.errors.newPassword}</div>
        );
      }
    }
  }

  let successScreen = (
    <div className="success-screen">
      <div className="username-success-container">
        <div className="username-success-message">
          Your password has been changed.
        </div>
      </div>
    </div>
  );

  return (
    <div className="change-password">
      {currentScreen}
      <div className={"new-username-container" + hideThis}>
        <form
          method="post"
          className="change-password-form"
          onSubmit={(e) => changePassword(e)}
        >
          <div className="form-input">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              maxLength={32}
              value={newPasswordValue}
              onChange={(e) => setNewPasswordValue(e.target.value)}
            />
            {newPasswordErrs}
          </div>

          <div className="form-input">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              maxLength={32}
              value={currentPasswordValue}
              onChange={(e) => setCurrentPasswordValue(e.target.value)}
              ref={inputReference}
            />
            {currentPasswordErrs}
          </div>

          <div>
            <button
              type="submit"
              className="change-password-input"
              name="change-password-input"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
