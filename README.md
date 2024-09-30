# Connect 4 Multiplayer Game

This is a multiplayer Connect 4 game built with React, Socket.IO, and Express. Two players can play the game in real-time, and additional users can spectate.

Heroku Link: https://connect-lokashrinav-146496d5537d.herokuapp.com/

(Link Might be Down Because I Am Broke and Can't Afford Hosting Fees for Too Long)

## Features

- Real-time multiplayer functionality using Socket.IO.
- Handles player turns, win conditions, and spectators.
- Automatically detects a win and resets the game on request.
- Responsive game board built using React.
- Players reconnecting to the game can resume from where the game left off.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/connect4-multiplayer.git
    ```

2. Navigate to the project directory:

    ```bash
    cd connect4-multiplayer
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Start the server:

    ```bash
    npm run dev
    ```

5. The app should now be running at:

    ```
    http://localhost:5173
    ```

## Deployment

The application can be deployed using services like Heroku or Fly.io.

### Heroku

1. Make sure you've logged into your Heroku account:

    ```bash
    heroku login
    ```

2. Create a Heroku app:

    ```bash
    heroku create
    ```

3. Push the project to Heroku:

    ```bash
    git push heroku main
    ```

4. The game will be hosted at your Heroku app's URL.

## Technology Stack

- **Frontend**: React
- **Backend**: Express, Socket.IO
- **Deployment**: Heroku

## How It Works

1. When a user connects, they either become one of the two players or a spectator if both player slots are filled.
2. Players take turns dropping discs into columns, and the game automatically switches between them.
3. The server checks for win conditions (horizontal, vertical, diagonal) and notifies all players of the winner.
4. The game can be reset using the reset button.

## Configuration

The server uses the following setup:

- CORS is enabled for the frontend at `https://connect-lokashrinav-146496d5537d.herokuapp.com`.
- Game data (board state, current player, etc.) is synchronized in real-time using Socket.IO events.

## Socket.IO Events

- `fill-board`: Fills the board for a new player or spectator.
- `player-move`: A player makes a move, updating the board.
- `check-win`: Server checks if a player has won.
- `reset-game`: Resets the game to the initial state.
- `set-winner`: Broadcasts the winner.
- `current-player`: Updates the current player's turn.

## Running Locally

To run the game locally:

1. Ensure you have Node.js installed.
2. Start the backend and frontend as described above.
3. Open `http://localhost:5173` in your browser to view the game.

## License

This project is licensed under the MIT License.
