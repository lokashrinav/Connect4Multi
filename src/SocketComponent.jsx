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

    newSocket.on('set-win', (newWinner) => {
        setWinner(newWinner);
    });

    newSocket.on('check-win', (newBoard, colIndex, rowIndex) => {
        const directions = [[0,1], [1,0], [1,1], [1,-1]];
        const currentPlayer = newBoard[rowIndex][colIndex];
        
        const checkDirection = (dx, dy) => {
            let count = 1;
            for (let dir of [-1, 1]) {
                let x = colIndex + dir * dx;
                let y = rowIndex + dir * dy;
                while (newBoard[y]?.[x] === currentPlayer) {
                    count++;
                    x += dir * dx;
                    y += dir * dy;
                }
            }
            return count >= 4;
        };
    
        const win = directions.some(([dx, dy]) => checkDirection(dx, dy));
    
        if(win) { 
            setWinner(currPlayer);
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