import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import Connect4Board from './Connect4Board.jsx';

const SocketComponent = () => {
  const [socket, setSocket] = useState(null);
  const [board, setBoard] = useState(Array(7).fill().map(() => Array(6).fill(null)));
  const [winner, setWinner] = useState(null);
  const [currPlayer, setCurrPlayer] = useState('Red');

  const reset = () => {
    socket.emit('reset-game');
  }

  const areFourConnected = (board, player) => {
    const height = board[0].length; // Assuming board is an array of columns
    const width = board.length;
  
    // Horizontal Check
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width - 3; i++) {
        if (
          board[i][j] === player &&
          board[i + 1][j] === player &&
          board[i + 2][j] === player &&
          board[i + 3][j] === player
        ) {
          return true;
        }
      }
    }
  
    // Vertical Check
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height - 3; j++) {
        if (
          board[i][j] === player &&
          board[i][j + 1] === player &&
          board[i][j + 2] === player &&
          board[i][j + 3] === player
        ) {
          return true;
        }
      }
    }
  
    // Ascending Diagonal Check
    for (let i = 3; i < width; i++) {
      for (let j = 0; j < height - 3; j++) {
        if (
          board[i][j] === player &&
          board[i - 1][j + 1] === player &&
          board[i - 2][j + 2] === player &&
          board[i - 3][j + 3] === player
        ) {
          return true;
        }
      }
    }
  
    // Descending Diagonal Check
    for (let i = 3; i < width; i++) {
      for (let j = 3; j < height; j++) {
        if (
          board[i][j] === player &&
          board[i - 1][j - 1] === player &&
          board[i - 2][j - 2] === player &&
          board[i - 3][j - 3] === player
        ) {
          return true;
        }
      }
    }
  
    return false;
  };
    

  useEffect(() => {

    const newSocket = io("", {
        transports: ["websocket"],
      });      
    setSocket(newSocket);

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('player-move', (sentData) => {
      setBoard(sentData);
    });

    newSocket.on('change-user', (newBoard) => {
      setBoard(newBoard);
      const newPlayer = currPlayer === 'Yellow' ? 'Red' : 'Yellow';
      setCurrPlayer(newPlayer);
      newSocket.emit('current-player', newPlayer);
    });

    newSocket.on('current-player', (sentPlayer) => {
      setCurrPlayer(sentPlayer);
    });

    newSocket.on('fill-board', (newBoard, newPlayer) => {
      setCurrPlayer(newPlayer);
      setBoard(newBoard);
    });

    newSocket.on('reset-board', (newBoard, newPlayer) => {
        setCurrPlayer(newPlayer);
        setWinner(null);
        setBoard(newBoard);
      });

    newSocket.on('other-player', (newPlayer) => {
      setWinner(newPlayer);
    });

    newSocket.on('disconnect', () => {
      console.log(`Player disconnected: ${newSocket.id}`);
    });

    newSocket.on('set-win', (newWinner) => {
        setWinner(newWinner);
    });

    newSocket.on('check-win', (newBoard) => {
        const currentPlayer = currPlayer;
        if (areFourConnected(newBoard, currentPlayer)) {
          setWinner(currentPlayer);
          newWin(currentPlayer);
        }
      });

    return () => {
      newSocket.disconnect();
    };
  }, []); 

  const handleMove = (newBoard) => {
    if (socket) {
      socket.emit('player-move', newBoard);
    }
  };

  const newWin = (winner) => {
    if (socket) {
      socket.emit('set-winner', winner);
    }
  };

  return (
    <Connect4Board
      reset={reset}
      winner={winner}
      setWinner={setWinner}
      newWin={newWin}
      board={board}
      playerMove={handleMove}
      currentPlayer={currPlayer}
    />
  );
};

export default SocketComponent;