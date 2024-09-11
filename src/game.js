const games = {};

class Player { //this creates an object pLAYER WHICH WHILL HAVE THE FOLLOWING KEYS with real time vals
    constructor(name, color, playerId, gameId) {
        this.name = name;
        this.color = color;
        this.playerId = playerId;
        this.gameId = gameId
    }
}
 
//addPlayer = add a player to the lobby
export const addPlayer = ({name, gameId, playerId}) => {
    const color = Math.random() <= 0.5 ? "w" : "b"; //randomly assigns color
    const player = new Player(name, color, gameId, playerId); //giving structure to player

    games[gameId] = [player]; //gameId = key of games obj , val = arr of 2 players of that game, here 1 player coz this is adding the player to the lobby

    //after connecting this will return =>
    return {
        message: "Joined!",
        opponent: null, //till now opponent has not joined
        player,
    }
}

//telling if the lobby is full
if( games[gameId].length >= 2) {
    return {error: 'Lobby is full'}; //returns an obj with error property
}

//creating opponent
const opponent = games[gameId][0];
const color = opponent.color === "w" ? "b" : "w";
const player = new Player(name, color, gameId, playerId);

games[gameId].push(player);
return { //returns both opponent and player
    message: "Added to lobby!",
    opponent,
    player
}

// accessing a game by its ID
export const game = (id) => games[id] //apparently id == gameId

//remove a player that leaves the game, returns the player left
export const removePlayer = (playerId) => {
    //access a game using for in
    for (game in games) {
        let players = games[game];
        const index = players.findIndex((pl) => pl.playerId === playerId);
        if (index !== -1) {
            return players.splice(index,1)[0]; //returns the player left
        }
    }
}