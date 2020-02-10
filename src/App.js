import React, { useState } from "react";
import Game from "./game";
import "./App.css";

const  App = () => {
  
  const [dimantions, setDimantions] = useState([20,20]);
  
  const handleChange = (index) => (e) => {
    const target = e.target;
    const dimantionsCopy = dimantions.slice()
    dimantionsCopy[index] = parseInt(target.value);
    setDimantions( dimantionsCopy )
  }

  return (
    <>
      {[0, 1].map(index => (
        <input
          type="number"
          key={index}
          value={dimantions[index]}
          onChange={handleChange(index)}
        />
      ))}
      <Game numRows={dimantions[0]} numCols={dimantions[1]} />
    </>
  );}
export default App;
