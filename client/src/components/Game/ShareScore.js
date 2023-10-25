import React, { useState, useEffect, useRef } from "react";
import "./ShareScore.css";
import "../../normalize.css";
import "../../custom.css";

//Copies the gameboard as unicode emojis so it can be pasted elsewhere
//props.hints - for the game that was just completed
function ShareScore(props) {
  const hintsRef = useRef();
  function setHintsRef(point) {
    hintsRef.current = point;
  }

  //Used to swap the text on the button to tell user it copied their gameboard
  let [shareButtonText, setShareButtonText] = useState("Copy & Share");

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    if (props.hints) {
      setHintsRef(props.hints);
    }
  }, []);

  //Copys the user's board for that game
  async function shareMyScore(e) {
    let copiedText = "Numblr\n";

    const upArrow = `\u{2B06}`;
    const downArrow = `\u{2B07}`;
    let equals = `\u{2705}`

    const grey = `\u{2B1C}`;
    const green = `\u{1F7E9}`;
    const yellow = `\u{1F7E8}`;

    let attempts = 1;
    props.hints.forEach((x) => {
      for (let i = 0; i < x.length - 1; i++) {
        switch (x[i]) {
          case "G": {
            copiedText += green;
            break;
          }
          case "Y": {
            copiedText += yellow;
            break;
          }
          default: {
            copiedText += grey;
            break;
          }
        }
      }

      switch (x[x.length - 1]) {
        case "E": {
          copiedText += equals + "\n";
          break;
        }
        case "H": {
          copiedText += upArrow + "\n";
          attempts++;
          break;
        }
        case "L": {
          copiedText += downArrow + "\n";
          attempts++;
          break;
        }
        default: {
        }
      }

      if (!x) {
        for (let i = 0; i < props.hints[0].length - 1; i++) {
          copiedText += green;
        }
        copiedText += equals + "\n";
      }
    });
    if(attempts === 7){
      attempts = "x";
    }
    copiedText += attempts + "/" + props.hints.length + " - " + getDate();
    await navigator.clipboard.writeText(copiedText);
    e.target.style.cursor = "default";
    e.target.style.pointerEvents = "none";
    e.target.classList = "share clicked";
    setShareButtonText("Copied to Clipboard!");
    setTimeout(() => {
      setShareButtonText("Copy & Share");
      e.target.classList = "share";
      e.target.style.cursor = "copy";
      e.target.style.pointerEvents = "auto";
    }, 2000);
  }

  //Gets the date in EST
  function getDate(){
    let date = new Date();
    let easternTime = new Date(date.getTime() - 5 * 60 * 60 * 1000);
    return date;


  }

  return (
    <button className="share" onClick={shareMyScore}>
      {shareButtonText}
    </button>
  );
}

export default ShareScore;
