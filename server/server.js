import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, '../dist')));

app.use(cors({
    origin: ["https://connect-lokashrinav-146496d5537d.herokuapp.com"],
    methods: ["GET", "POST"],
    credentials: true
}));

const io = new Server(server, {
    cors: {
        origin: ["https://connect-lokashrinav-146496d5537d.herokuapp.com"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

let board = Array(7).fill().map(() => Array(6).fill(null));
let currPlayer = 'Red';
let players = [];

io.on('connection', (socket) => {
    if (players.length < 2) {
        players.push(socket.id);
        io.to(socket.id).emit('fill-board', board, currPlayer);
    } else {
        io.to(socket.id).emit('game-full');
        console.log("Disconnected: ", socket.id);
        socket.disconnect();
    }

    console.log(players);

    socket.on('player-move', (data) => {
        if ((currPlayer === 'Red' && socket.id === players[0]) || 
            (currPlayer === 'Yellow' && socket.id === players[1])) {
            board = data;
            io.emit('player-move', data);
            
            currPlayer = currPlayer === 'Red' ? 'Yellow' : 'Red';
            io.emit('current-player', currPlayer);
        }
    });

    socket.on('reset-game', () => {
        board = Array(7).fill().map(() => Array(6).fill(null));
        currPlayer = 'Red';
        players.forEach(player => {
            io.to(player).emit('fill-board', board, currPlayer);
        });
    });

    socket.on('current-player', (data) => {
        currPlayer = data;
        socket.broadcast.emit('current-player', data);
    });
      
    socket.on('disconnect', () => {      
        let disconnectedPlayerIndex = players.indexOf(socket.id);
        let winner;

        if (disconnectedPlayerIndex === 0) {
            winner = 'Yellow';
        } else if (disconnectedPlayerIndex === 1) {
            winner = 'Red';
        }
        socket.broadcast.emit('other-player', winner);
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 8080; 
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running and listening on 0.0.0.0:${PORT}`);
});