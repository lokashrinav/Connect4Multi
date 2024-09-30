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

let players = [null, null];

let spectators = [];

io.on('connection', (socket) => {
    const playerIndex = players.indexOf(null);

    if (playerIndex !== -1) {
        players[playerIndex] = socket.id; 
        io.to(socket.id).emit('fill-board', board, currPlayer); 
    } else {
        io.to(socket.id).emit('fill-board', board, currPlayer); 
        spectators.push(socket.id);
    }

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
        io.emit('reset-board', board, currPlayer);
    });

    socket.on('current-player', (data) => {
        currPlayer = data;
        socket.broadcast.emit('current-player', data);
    });
      
    socket.on('disconnect', () => {
        let playerIndex = players.indexOf(socket.id);

        if (playerIndex !== -1) {
            players[playerIndex] = null;

            if (spectators.length > 0) {
                const nextPlayer = spectators.shift();
                players[playerIndex] = nextPlayer;
            }
            else {
                if (playerIndex === 0) {
                    winner = 'Yellow';
                } else if (playerIndex === 1) {
                    winner = 'Red';
                }
                socket.broadcast.emit('other-player', winner);
            }
        } else {
            const spectatorIndex = spectators.indexOf(socket.id);
            if (spectatorIndex !== -1) {
                spectators.splice(spectatorIndex, 1);
            }
        }
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 8080; 
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running and listening on 0.0.0.0:${PORT}`);
});