# Tic-Tac-Toe

This repository contains a simple Tic-Tac-Toe game application built with Node.js. The game allows two players to play against each other in real-time across different devices.

## Features

- **Real-time Gameplay**: Play against another player in real-time.
- **Cross-Device Compatibility**: Play from different devices with seamless synchronization.
- **User-Friendly Interface**: Simple and intuitive UI for an enjoyable experience.
- **Node.js Backend**: Efficient backend logic implemented using Node.js.

## Getting Started

These instructions will help you set up and run the Tic-Tac-Toe application on your local machine.

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v12.x or later)
- [npm](https://www.npmjs.com/)

### Installation

Follow these steps to get the application up and running:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/ridwansulaiman/tic-tac-toe.git
    ```

2. **Navigate into the project directory**:
    ```bash
    cd tic-tac-toe
    ```

3. **Install the dependencies**:
    ```bash
    npm install
    ```

### Running the Application

1. **Start the server**:
    ```bash
    npm start
    ```

2. **Open your browser** and navigate to `http://localhost:3000` to start playing the game.

## Project Structure

- `public/`: Contains static assets like HTML, CSS, and client-side JavaScript.
- `src/`: Contains server-side JavaScript files.
- `src/index.js`: Entry point for the Node.js server.
- `package.json`: Lists the project's dependencies and scripts.

## Main Logic and Important Code Explanation

### Server-Side (Node.js)

The server-side logic is implemented in `src/index.js`. Here are some key components:

1. **Setting up the server**:
    ```javascript
    const express = require('express');
    const http = require('http');
    const socketIo = require('socket.io');

    const app = express();
    const server = http.createServer(app);
    const io = socketIo(server);
    ```

    - **Express.js** is used to create the server.
    - **Socket.io** is used for real-time communication between clients.

2. **Serving static files**:
    ```javascript
    app.use(express.static('public'));
    ```

    - Static assets from the `public` directory are served to the clients.

3. **Handling socket connections**:
    ```javascript
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        // Additional event handlers
    });
    ```

    - Handles new connections and disconnections.
    - Additional events can be handled within the connection callback.

### Client-Side

The client-side logic is implemented in `public/script.js`. Here are some key components:

1. **Connecting to the server**:
    ```javascript
    const socket = io();
    ```

    - Establishes a connection to the server using Socket.io.

2. **Handling game state**:
    ```javascript
    socket.on('gameState', (state) => {
        // Update UI based on the game state
    });
    ```

    - Listens for the `gameState` event from the server and updates the UI accordingly.

3. **Sending player moves**:
    ```javascript
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', () => {
            const cellIndex = cell.getAttribute('data-index');
            socket.emit('playerMove', cellIndex);
        });
    });
    ```

    - When a player clicks on a cell, the move is sent to the server.

## Contributing

We welcome contributions to enhance the Tic-Tac-Toe game. Please follow these steps to contribute:

1. **Fork the repository**.
2. **Create a new branch**:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. **Make your changes** and commit them:
    ```bash
    git commit -m 'Add some feature'
    ```
4. **Push to the branch**:
    ```bash
    git push origin feature/your-feature-name
    ```
5. **Create a pull request**.
