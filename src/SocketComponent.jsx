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

    return () => {
      newSocket.disconnect();
    };
  }, []); 

  const handleMove = (newBoard) => {
    if (socket) {
      socket.emit('player-move', newBoard);
    }
  };

  return (
    <Connect4Board
      reset={reset}
      winner={winner}
      setWinner={setWinner}
      board={board}
      playerMove={handleMove}
      currentPlayer={currPlayer}
    />
  );
};

export default SocketComponent;