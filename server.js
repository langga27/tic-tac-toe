const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let players = {};

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on('choosePlayer', (player) => {
        if (!players.X && player === 'X') {
            players.X = socket.id;
            socket.emit('playerAssigned', 'X');
            console.log(`Player X assigned: ${socket.id}`);
        } else if (!players.O && player === 'O') {
            players.O = socket.id;
            socket.emit('playerAssigned', 'O');
            console.log(`Player O assigned: ${socket.id}`);
        } else {
            socket.emit('playerAssigned', 'Spectator');
            console.log(`Spectator connected: ${socket.id}`);
        }

        io.emit('boardUpdate', { board, currentPlayer, gameActive, players });
    });

    socket.on('cellClick', (index) => {
        console.log(`Received cellClick from ${socket.id} for index ${index}`);

        if (board[index] === '' && gameActive && socket.id === players[currentPlayer]) {
            board[index] = currentPlayer;
            const winner = checkWin();

            if (winner) {
                if (winner === 'Draw') {
                    console.log('Game is a draw!');
                    gameActive = false;
                } else {
                    console.log(`Player ${winner} wins!`);
                    gameActive = false;
                }
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }

            io.emit('boardUpdate', { board, currentPlayer, gameActive, players, winner });
        } else {
            console.log(`Invalid move or not ${currentPlayer}'s turn: ${socket.id}`);
        }
    });

    socket.on('restartGame', () => {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        players = {};
        console.log('Game restarted');
    
        // Inform all clients of the new game state
        io.emit('boardUpdate', { board, currentPlayer, gameActive, players, winner: null });
    });
    

    socket.on('disconnect', () => {
        console.log(`Disconnected: ${socket.id}`);
        if (socket.id === players.X) {
            delete players.X;
        } else if (socket.id === players.O) {
            delete players.O;
        }
        io.emit('boardUpdate', { board, currentPlayer, gameActive, players, winner: null });
    });
});

function checkWin() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return the winning player ('X' or 'O')
        }
    }
    return !board.includes('') ? 'Draw' : null; // Return 'Draw' if no empty spaces are left
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
