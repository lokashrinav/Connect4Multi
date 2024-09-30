import React, { useEffect, useState } from 'react';
import './Connect4Board.css';

const ROWS = 7;
const COLUMNS = 6;

const Connect4Board = ({winner, setWinner, newWin, reset, playerMove, currentPlayer, board}) => {
    
  const handleClick = (colIndex) => {
    if (winner) return;
    for (let rowIndex = ROWS - 1; rowIndex >= 0; rowIndex--) {
      if (board[colIndex][rowIndex] === null) {
        const newBoard = [...board];
        newBoard[colIndex][rowIndex] = currentPlayer;

        playerMove(newBoard);
        
        return;
      }
    }
  };

  return (
    <div className="game-container">
      <h1>Connect 4</h1>
      {winner ? (
        <h2>{winner} Wins!</h2>
      ) : (
        <h2>Current Player: {currentPlayer}</h2>
      )}
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell}`}
                onClick={() => handleClick(rowIndex)}
              >
                {cell && <div className={`disc ${cell.toLowerCase()}`}></div>}
              </div>
            ))}
          </div>
        ))}
      </div>
       {winner && <button id="resetButton" onClick={() => reset()}>Reset</button>}
      </div>
  );
};

export default Connect4Board