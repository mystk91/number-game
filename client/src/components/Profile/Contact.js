import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ProfileComponents.css";
import "../../normalize.css";
import "../../custom.css";
import LoadingIcon from "../Parts/LoadingIcon";

//Displays contact information for questsions / bugs
function Contact(props) {
  const [currentScreen, setCurrentScreen] = useState();
  const [hideForm, setHideForm] = useState("");

  const [messageValue, setMessageValue] = useState("");
  const [errMessage, setErrMessage] = useState("");
  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    setUp();
    return () => {};
  }, []);

  function setUp() {
    setCurrentScreen();
  }

  //Returns error object with errors if there are any
  function displayMessageErrors() {
    let errors = {
      message: "",
    };

    if (messageValue.length <= 8) {
      errors.message = "Messages is too short";
    }
    if (messageValue.length > 800) {
      errors.message = "Messages is too long";
    }

    if (errors.message) {
      return errors;
    } else {
      return "";
    }
  }

  //Sends a message to the website
  async function sendMessage(e) {
    e.preventDefault();
    setHideForm(" hide");
    setCurrentScreen(<LoadingIcon />);
    let errors = displayMessageErrors();
    if (!errors) {
      const url = "/api/contact-send-message";
      const formData = new FormData(e.target);
      const formDataObj = Object.fromEntries(formData.entries());
      formDataObj.session = props.user.session;
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
      if (resObj.success) {
        setCurrentScreen(
          <div className="message-success">
            <div>Your message was sent.</div>{" "}
            <div> You can check back later for a response. </div>
          </div>
        );
      } else {
        setCurrentScreen();
        setHideForm("");
        setErrMessage(<div>{resObj.errors.message}</div>);
      }
    } else {
      setCurrentScreen();
      setHideForm("");
      setErrMessage(<div>{errors.message}</div>);
    }
  }
  /*
        <div className="contact-text or">
        Or...
      </div>

      <div className="contact-text">
        Send us a message.
      </div>

      {currentScreen}

      <form
        className={"contact-form" + hideForm}
        onSubmit={(e) => sendMessage(e)}
      >
        <div>
          <label htmlFor="subject">Subject: </label>
          <select name="subject" id="subject">
            <option value="bugReport">Bugs / Issues</option>
            <option value="randomMode">Random Mode</option>
            <option value="questions">Questions</option>
          </select>
        </div>

        <div>
          <label htmlFor="message">Message: </label>
          <textarea
            id="message"
            name="message"
            rows="6"
            cols="50"
            maxLength={800}
            placeholder="Write your message..."
            wrap="hard"
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
          />
          {errMessage}
        </div>
        <div>
          <button type="submit" className="submit-btn">
            Send!
          </button>
        </div>
      </form>
  */

  return (
    <div className="contact">
      <h1>Contact Us</h1>

      <h2 className="contact-text">Questions? Issues? Bugs?</h2>

      <div className="contact-text email">
        <div>Send us an email at: </div>
        <a href="mailto:somethingsomething@site.com">
          somethingsomething@site.com
        </a>
      </div>
    </div>
  );
}

export default Contact;
