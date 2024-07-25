document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const restartButton = document.getElementById('restart');
    const playerChoice = document.getElementById('playerChoice');
    const gameDiv = document.getElementById('game');
    const chooseXButton = document.getElementById('chooseX');
    const chooseOButton = document.getElementById('chooseO');
    const socket = io();

    let player = 'Spectator';
    let currentPlayer = 'X';
    let gameActive = true;

    chooseXButton.addEventListener('click', () => {
        socket.emit('choosePlayer', 'X');
    });

    chooseOButton.addEventListener('click', () => {
        socket.emit('choosePlayer', 'O');
    });

    socket.on('playerAssigned', (assignedPlayer) => {
        player = assignedPlayer;
        console.log(`Player assigned: ${player}`);

        if (player === 'Spectator') {
            playerChoice.style.display = 'none';
            gameDiv.style.display = 'none';
            status.innerHTML = 'All player slots are filled. You are a spectator.';
        } else {
            playerChoice.style.display = 'none';
            gameDiv.style.display = 'block';
        }
    });

    socket.on('boardUpdate', ({ board, currentPlayer: serverCurrentPlayer, gameActive: serverGameActive, players, winner }) => {
        updateBoard(board);
        currentPlayer = serverCurrentPlayer;
        gameActive = serverGameActive;
        updateStatus(winner);

        // Reset the game UI properly when game is active
        if (gameActive) {
            cells.forEach(cell => cell.classList.remove('cell-disabled'));
        } else {
            // Disable cells if game is not active
            cells.forEach(cell => cell.classList.add('cell-disabled'));
        }
    });

    function updateBoard(board) {
        cells.forEach((cell, index) => {
            cell.innerHTML = board[index];
        });
    }

    function updateStatus(winner) {
        if (gameActive) {
            if (players.X && players.O) {
                status.innerHTML = `It's ${currentPlayer}'s turn`;
            } else {
                status.innerHTML = 'Waiting for players to join...';
            }
        } else {
            if (winner === 'Draw') {
                status.innerHTML = 'It\'s a draw!';
            } else if (winner) {
                status.innerHTML = `${winner} wins!`; // Show the actual winner
            }
        }
    }

    cells.forEach(cell => cell.addEventListener('click', (event) => {
        const clickedCellIndex = parseInt(event.target.getAttribute('data-index'));
        console.log(`Cell clicked: ${clickedCellIndex}, Player: ${player}, Current Player: ${currentPlayer}, Game Active: ${gameActive}`);
        
        if (player === currentPlayer && gameActive && event.target.innerHTML === '') {
            socket.emit('cellClick', clickedCellIndex);
        } else {
            console.log(`Invalid move or not ${player}'s turn`);
        }
    }));

    restartButton.addEventListener('click', () => {
        socket.emit('restartGame');
        playerChoice.style.display = 'block';
        gameDiv.style.display = 'none';
    });
});
