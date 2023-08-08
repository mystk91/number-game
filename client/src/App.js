import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import update from 'immutability-helper';
import uniqid from "uniqid";
//import logo from './logo.svg';
//export const SomeContext = createContext('defaultValue');
import "./normalize.css";
import "./custom.css";
import './App.css';
import NumberGame from './components/NumberGame';
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import styled, { css } from 'styled-components';

function App() {
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
  useEffect(() => {return() => {}});


  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<NumberGame digits={4} attempts={6} />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
