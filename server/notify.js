const db = require('./db');

const crypto = require('crypto');
const errors = require('./errors');

let response;
let user;
let gameId;
let cav;

function process(res, nick, password, game, move) {
    response = res;
    user = nick;
    gameId = game;
    cav = move;
    
    if (typeof nick !== "string") {
        errors.wrongArgument(res, "nick", nick);
        return;
    } else if (typeof password !== "string") {
        errors.wrongArgument(res, "password", password);
        return;
    } else if (typeof game !== "string") {
        errors.wrongArgument(res, "game", game);
        return;
    } else if (typeof move !== "string" && typeof initial !== "number") {
        errors.wrongArgument(res, "move", move);
    }        

    const hash = crypto
        .createHash('md5')
        .update(password)
        .digest('hex');

    if (typeof move === "string") {
        move = parseInt(move);
    }
    
    db.verifyUser(response, nick, hash, wrongCredentials, correctCredentials, wrongCredentials);
}

function correctCredentials() {

    // check if there is any game that has that seeds or cavs
    // games -> [[gameId, size, initial, nick1, nick2], [gameId, size, initial, nick1, nick2]...]
    let gameId = db.getGameRequest(user, cavs, seeds);

    response.writeHead(200, {
        'Content-Type': 'application/json',
    });

    response.write(JSON.stringify({
        "game": gameId,
    }));

    response.end();
}

function wrongCredentials() {

    response.writeHead(401, {
        'Content-Type': 'application/json',
    });

    response.write(JSON.stringify({
        "error": "User registered with a different password",
    }));

    response.end();
}


module.exports = { process };