import React, { useEffect, useState } from 'react';
import './Connect4Board.css'; // You can style this later

const ROWS = 7;
const COLUMNS = 6;

const Connect4Board = ({winner, setWinner, playerMove, currentPlayer, board}) => {
    
  const handleClick = (colIndex) => {
    if (winner) return;

    for (let rowIndex = ROWS - 1; rowIndex >= 0; rowIndex--) {
      if (board[colIndex][rowIndex] === null) {
        const newBoard = [...board];
        newBoard[colIndex][rowIndex] = currentPlayer;

        playerMove(newBoard);

        if (checkForWinner(newBoard, rowIndex, colIndex, currentPlayer)) {
          setWinner(currentPlayer);
        }
        
        return;
      }
    }
  };

  // Check if the current player has won
  const checkForWinner = (board, col, row, player) => {
    return (
      checkDirection(board, row, col, player, 1, 0) || // Horizontal
      checkDirection(board, row, col, player, 0, 1) || // Vertical
      checkDirection(board, row, col, player, 1, 1) || // Diagonal (bottom-left to top-right)
      checkDirection(board, row, col, player, 1, -1)   // Diagonal (top-left to bottom-right)
    );
  };

  // Check a direction for 4 consecutive tokens
  const checkDirection = (board, row, col, player, rowInc, colInc) => {
    let count = 0;
    for (let i = -3; i <= 3; i++) {
      const r = row + i * rowInc;
      const c = col + i * colInc;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLUMNS && board[r][c] === player) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }
    return false;
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
    </div>
  );
};

export default Connect4Board