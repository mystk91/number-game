import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ProfileComponents.css";
import "../../normalize.css";
import "../../custom.css";


//Displays various game stasitics for user. Lets them reset / delete their stats
//    props.statistics - a statistics object containing info for the user
function Statistics(props) {

  
  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {

    return () => {};
  }, []);

  return <div className="statistics">
    This is the statistics panel.
  </div>;
}

export default Statistics;
