import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import './Store.css';
import "../normalize.css";
import "../custom.css";

function Store(props) {
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
    <div className="Boilerplate">



    </div>
  );
}

export default Store;
