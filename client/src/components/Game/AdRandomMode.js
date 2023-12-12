import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import './AdRandomMode.css';
import "../../normalize.css";
import "../../custom.css";

//A pop up ad for the random-mode of game
//It displays to new users of the website after playing a couple games
function AdRandomMode(props) {
  const [property, setProperty] = useState('initialValue');
  const propRef = useRef('initialValue');
  function setPropRef(point) {
    propRef.current = point;
  }

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    
    return() => {};
  }, []);
  //componentDidUpdate, runs after render
  useEffect(() => {}, [property]);
  //componentDismount
  useEffect(() => {return() => {}})

  
  
  return (
    <div className="random-mode-ad">



    </div>
  );
}

export default AdRandomMode;
