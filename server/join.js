const http = require('http');
const db = require('./db');
const crypto = require('crypto');

let response;
let user;
let seeds;
let cavs;

async function process(res, nick, password, size, initial) {
    response = res;
    user = nick;
    seeds = size;
    cavs = initial;

    const hash = crypto
               .createHash('md5')
               .update(password)
        .digest('hex');
    
    await db.authenticateUser(nick, hash, correctCredentials, wrongCredentials);
}

async function correctCredentials() {
    await db.getGameRequest(user, seeds, cavs, answer);
}

function wrongCredentials() {
    response.writeHead(401, {
        'Content-Type': 'application/json',
    });

    response.write(JSON.stringify({
        "error": "Invalid Credentials",
    }));

    response.end();
}

function answer(gameId) {
    response.writeHead(200, {
        'Content-Type': 'application/json',
    });

    response.write(JSON.stringify({
        "game": gameId,
    }));

    response.end();
}

module.exports = { process };