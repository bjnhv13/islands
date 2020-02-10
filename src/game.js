import React, { useState, useEffect, useCallback } from "react";
import produce from "immer";
import { ReactComponent as Tree } from "./Palm Trees.svg";
console.log(Tree)
const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [-1, 0],
  [1, 0]
];
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const generateGrid = (numRows, numCols, random) => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(
      Array.from(Array(numCols), () => ({
        color: null,
        value: random ? (Math.random() > 0.7 ? 1 : 0) : 0,
        visited: false
      }))
    );
  }
  return rows;
};

const useGame = (numRows, numCols) => {
  const [grid, setGrid] = useState([]);
  useEffect(() => {
    setGrid(generateGrid(numRows, numCols, false));
  }, [numRows, numCols]);
  const resetGrid = () => {
    setGrid(generateGrid(numRows, numCols, false));
  };
  const setRandomGrid = () => {
    setGrid(generateGrid(numRows, numCols, true));
  };
  return { grid, setRandomGrid, resetGrid, setGrid };
};

const Game = ({numRows, numCols}) => {
  const [islandsNum, setInslandNum] = useState(0);
  const { grid, setRandomGrid, resetGrid, setGrid } = useGame(numRows, numCols);
  const solveGame = useCallback(() => {
    let num = 0;
    setGrid(g => {
      return produce(g, gridCopy => {
        let color = "";
        const findNeighbours = (cell, i, k) => {
          cell.color = color;
          operations.forEach(([y, x]) => {
            y += i;
            x += k;
            if (y < 0 || x < 0 || y >= numRows || x >= numCols) {
              // check boundaries
              return;
            }
            if (!gridCopy[y][x].visited) {
              gridCopy[y][x].visited = true;
              if (gridCopy[y][x].value) {
                findNeighbours(gridCopy[y][x], y, x);
              }
            }
          });
        };
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            if (!gridCopy[i][k].visited) {
              gridCopy[i][k].visited = true;
              if (gridCopy[i][k].value) {
                num = num + 1;
                color = getRandomColor();
                findNeighbours(gridCopy[i][k], i, k);
              }
            }
          }
        }
        setInslandNum(num);
      });
    });
  }, [numRows, numCols]);
    const handleClick = (e) => {
      e.stopPropagation();
      console.log(e.target.dataset.index);
      if(e.target.dataset.index){
        const [i,k] = e.target.dataset.index.split(",").map(index => parseInt(index));
        console.log("old", grid[i][k]);
        const newGrid = grid.map((row, index) => {
          if (index !== i) {
            return [...row];
          } else {
            const copyRow = [...row];
            const copyCell = Object.assign({}, copyRow[k]);
            copyCell.value = copyCell.value ? 0 : 1;
            copyRow[k] = copyCell;
            return copyRow;
          }
        });
        console.log(newGrid[i][k])
        setGrid(newGrid);
      };
    }

  return (
    <>
      <button onClick={solveGame}>Solve</button>
      <button onClick={setRandomGrid}>Random</button>
      <button onClick={resetGrid}>clear</button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}
        onClick={handleClick}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => <Cell key={`${i}-${k}`} y={i} x={k} data={col} />)
        )}
      </div>
      {islandsNum}
    </>
  );
};

export default Game;

const Cell = React.memo(
  ({ data, x ,y }) => {
    console.log(data)
    return (
      <div
        style={{
          width: 20,
          height: 20,
          textAlign: "center",
          backgroundColor: data.color,
          border: "solid 1px black"
        }}
        data-index={[y, x]}
      >
        {data.value ? <Tree /> : null}
      </div>
    );},
  (prevProps, nextProps) => (prevProps.data.value === nextProps.data.value && prevProps.data.color === nextProps.data.color)
);
