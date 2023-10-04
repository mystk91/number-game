import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import "./NewPassword.css";
import "../normalize.css";
import "../custom.css";
import { useParams } from "react-router-dom";

//Used for the page that DOES the password reset.
function NewPassword(props) {
  //Sets the verification code so it can be passed in while changing password
  const verficationCodeRef = useRef();
  function setVerificationCodeRef(point) {
    verficationCodeRef.current = point;
  }
  setVerificationCodeRef(useParams().verificationCode);

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
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
      if (res.status == 302) {
        window.location = "/login";
      } else {
        let errors = await res.json();
        setErrPassword(<div className="error">{errors.password}</div>);
      }
    }
  }

  return (
    <div className="new-password">
      <div className="reset-password-form-container">
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
