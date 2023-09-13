import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import update from 'immutability-helper';
import uniqid from "uniqid";
//import logo from './logo.svg';
//import { SomeContext } from "../App";
//Rename all Boilerplate as your new Component
import './GamePage.css';
import "../normalize.css";
import "../custom.css";
import Navbar from "./Navbar";
import NumberGame from "./NumberGame";
import { Link } from "react-router-dom";

function Boilerplate(props) {
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
    <div className="game-page">
      <Navbar/>
      <NumberGame digits={props.digits} attempts={props.attempts} />
    </div>
  );
}

export default Boilerplate;
