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
  async function deleteAccount(e) {
    e.preventDefault();
    const url = "/api/delete-my-account";
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    formDataObj.user = props.user;
    const formDataString = JSON.stringify(formDataObj);
    const options = {
      method: "DELETE",
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
    if (resObj.success) {
      localStorage.removeItem("profile");
      window.location = "/login";
    } else {
      setPasswordErrs(<div className="error">{resObj.errors.password}</div>);
    }
  }

  return (
    <div className="delete-account">
      <div className={"delete-account--container"}>
        <div className="delete-account-headline">
          Enter your password to delete your account. This process cannot be reversed. 
        </div>
        <form
          method="post"
          className="delete-account-form"
          onSubmit={(e) => deleteAccount(e)}
        >
          <div className="form-input">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              maxLength={32}
              value={passwordValue}
              ref={inputReference}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
            {passwordErrs}
          </div>

          <div>
            <button
              type="submit"
              className="deleteAccount"
              name="deleteAccount"
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeUsername;
