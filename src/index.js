const http = require('http');
const socketio = require('socket.io');
const express = require('express');
const cors = require('cors');
const { addPlayer, removePlayer } = require('./game');

const app = express();
const server = http.createServer(app); //creates a new server with express
const PORT = 5000;
const io = socketio(server); //this is an object

app.use(cors()); //cors = middleware, allows to share cross origin resource with client

io.on('connection', (socket) =>{
    socket.on('join', ({name, gameId,playerId}, callback) => {
        const {error, player, opponent} = addPlayer({
            name, playerId: socket.id, gameId
        });
        if (error) {
            return callback({error});
        }
        socket.join(gameId);
        callback({color: player.color})
    })

    //welcome msg and opponent data
    socket.emit('welcome', {
        message: `Hi ${player.name},Welcome to Chess Battle`,
        opponent
    })

    //tell player2 that player1 has joined
    socket.broadcast.to(player.gameId).emit('opponent join', {
        message: `${player.name} has joined`,
        opponent: player,
    })
    if (game(gameId).length >= 2) {
        const white = game(gameId).find((player) => player.color === 'w');
        io.to(gameId).emit('message', {
            message: `Let's start the game. White (${white.name}) goes first)`
        })
    }
    socket.on('move',( {from,to,gameId} ) => {
        socket.broadcast.to(gameId).emit('opponentMove',{ from, to });
    })
    socket.on('disconnect', () => {
        const player = removePlayer(socket.id);
        if(player) {
            io.to(player.game).emit('message',{
                message: `${player.name} has left the game.`,
            })
            socket.broadcast.to(player.game).emit('opponentLeft');
        } 
    })

})
server.listen(PORT, () => console.log('Server running on port ' + PORT));