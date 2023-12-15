import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ProfileComponents.css";
import "../../normalize.css";
import "../../custom.css";

//Displays contact information for questsions / bugs
function Contact(props) {
  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {

    return () => {};
  }, []);

  return <div className="contact">
    This is the contact panel.

  </div>;
}

export default Contact;
