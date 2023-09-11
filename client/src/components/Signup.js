import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import update from 'immutability-helper';
import uniqid from "uniqid";
import './Signup.css';
import "../normalize.css";
import "../custom.css";
import { Link } from "react-router-dom";

function Signup(props) {
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
    <div className="signup-modal">



    </div>
  );
}

export default Signup;
