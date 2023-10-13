import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import './LoginOption.css';
import "../../normalize.css"
import "../../custom.css";
import { Link } from "react-router-dom";

function LoginOption(props) {
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

  function goLogin(site){
    window.location.href=site;
  }

  
  return (
    <button className={props.className + ' login-button'} onClick={()=>goLogin(props.href)}>
      <img src={props.imageURL}/>
      <span>{props.buttonText}</span>
    </button>
  );
}

export default LoginOption;