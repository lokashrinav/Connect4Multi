import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import Connect4Board from './Connect4Board.jsx';

const SocketComponent = () => {
  const [socket, setSocket] = useState(null);
  const [board, setBoard] = useState(Array(7).fill().map(() => Array(6).fill(null)));
  const [winner, setWinner] = useState(null);
  const [currPlayer, setCurrPlayer] = useState('Red');

  useEffect(() => {
    const newSocket = io("https://connect-nameless-dew-6770.fly.dev", {
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

    newSocket.on('current-player', (sentPlayer) => {
      setCurrPlayer(sentPlayer);
    });

    newSocket.on('fill-board', (newBoard, newPlayer) => {
      setCurrPlayer(newPlayer);
      setBoard(newBoard);
      setWinner(null); // Reset winner state on fill-board
    });

    newSocket.on('other-player', (newPlayer) => {
      setWinner(newPlayer);
    });

    newSocket.on('disconnect', () => {
      console.log(`Player disconnected: ${newSocket.id}`);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []); // Empty dependency array to run only once

  const handleMove = (newBoard) => {
    if (socket) {
      socket.emit('player-move', newBoard);
    }
  };

  const handleReset = () => {
    if (socket) {
      socket.emit('reset-game');
    }
  };

  return (
    <div>
      <button onClick={handleReset}>Reset Game</button>
      <Connect4Board
        winner={winner}
        setWinner={setWinner}
        board={board}
        playerMove={handleMove}
        currentPlayer={currPlayer}
      />
    </div>
  );
};

export default SocketComponent;