import React, { useState, useEffect, useRef } from "react";
import "./Histogram.css";
import "../../normalize.css";
import "../../custom.css";

/*
    Used to create a histogram for a game with different digits / different no. of attempts
    props.digits - number of digit on the game
    props.attempts - number of attempts allowed on the game, usually 6
    props.scoresObj - an object containing scores used in the histogram
      scoresObj.average30
      scoresObj.average1000
      scoresObj.scores30
      scoresObj.scores1000
  */
function Histogram30Random(props) {
  const [histogram, setHistogram] = useState();
  const histogramDataRef = useRef();
  function setHistogramDataRef(point) {
    histogramDataRef.current = point;
  }

  const averageScoreRef = useRef();
  function setAverageScoreRef(point) {
    averageScoreRef.current = point;
  }

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    updateHistogram();

    return () => {};
  }, []);

  function updateHistogram() {
    let scoresObj = props.scoresObj;
    if (scoresObj) {
      let histogramArr = [];
      let histogramData = new Array(props.attempts + 1);
      for (let i = 0; i < histogramData.length; i++) {
        histogramData[i] = 0;
      }
      scoresObj.scores30.forEach((x) => {
        histogramData[x.score - 1] += 1;
      });

      let highestHist = 0;
      histogramData.forEach((x) => {
        if (x > highestHist) {
          highestHist = x;
        }
      });

      let pixelData = new Array(props.attempts + 1);
      let histoLength = 250;
      for (let i = 0; i < pixelData.length; i++) {
        if (histogramData[i] > 0) {
          pixelData[i] = Math.max(
            Math.ceil(histoLength * (histogramData[i] / highestHist)),
            10
          );
        } else {
          pixelData[i] = 0;
        }
      }
      let displayedFrequency = new Array(props.attempts + 1);
      for (let i = 0; i < displayedFrequency.length; i++) {
        if (histogramData[i] === 0) {
          displayedFrequency[i] = "";
        } else {
          displayedFrequency[i] = histogramData[i];
        }
      }
      let barStyle = new Array(props.attempts + 1);
      for (let i = 0; i < barStyle.length; i++) {
        if (histogramData[i] === 0) {
          barStyle[i] = "";
        } else {
          barStyle[i] = ".5px solid black";
        }
      }

      for (let i = 0; i < props.attempts + 1; i++) {
        let row = (
          <div className="histogram-row" key={"histogram-row-" + i}>
            <div className="histogram-score">{i + 1}</div>
            <div
              className={"histogram-bar" + " score-" + (i + 1)}
              style={{ width: pixelData[i] + "px", borderRight: barStyle[i] }}
            ></div>
            <div className="histogram-frequency">{displayedFrequency[i]}</div>
          </div>
        );
        histogramArr.push(row);
      }
      setHistogram(histogramArr);
      //Calculate the average score
      let average = scoresObj.average30.average.toFixed(3);
      setAverageScoreRef(average);
    }
  }

  return (
    <div className="histogram-container">
      <div className="average-score">
        30 Average: {averageScoreRef.current}{" "}
      </div>
      {histogram}
    </div>
  );
}

export default Histogram30Random;
