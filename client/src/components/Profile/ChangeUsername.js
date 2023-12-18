import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ChangeUsername.css";
import "../../normalize.css";
import "../../custom.css";

//Displays contact information for questsions / bugs
function ChangeUsername(props) {
  //Used to keep track of the inputed values
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  //Used to display errors on the form
  let [usernameErrs, setUsernameErrs] = useState();
  let [passwordErrs, setPasswordErrs] = useState();

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

  //Attempts to change the username
  async function changeUsername(e) {
    e.preventDefault();
    const url = "/api/new-username";
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
    console.log(resObj.errors);
    if (!resObj.errors) {
      console.log("meat council approved");
      setHideThis(" hide");
      setCurrentScreen(successScreen);
    } else {
      setUsernameErrs(<div className="error">{resObj.errors.username}</div>);
      setPasswordErrs(<div className="error">{resObj.errors.password}</div>);
    }
  }

  let successScreen = (
    <div className="success-screen">
      <div className="username-success-container">
        <div className="username-success-message">
          Your username has been updated.
        </div>
      </div>
    </div>
  );

  return (
    <div className="new-username">
      {currentScreen}
      <div className={"new-username-container" + hideThis}>
        <div className="username-info">
          Your username will appear on the leaderboards if you get a top 50
          average score in Random Mode.
        </div>
        <div className="username-info">
          You can only change your username once a month. Inappropriate names
          may lead to account suspensions.
        </div>
        <form
          method="post"
          className="change-username-form"
          onSubmit={(e) => changeUsername(e)}
        >
          <div className="form-input">
            <label htmlFor="newUsername">New Username</label>
            <input
              id="newUsername"
              name="newUsername"
              type="text"
              maxLength={16}
              value={usernameValue}
              onChange={(e) => setUsernameValue(e.target.value)}
              ref={inputReference}
            />
            {usernameErrs}
          </div>

          <div className="form-input">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              maxLength={32}
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
            {passwordErrs}
          </div>

          <div>
            <button
              type="submit"
              className="change-username"
              name="change-username"
            >
              Change Username
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeUsername;
