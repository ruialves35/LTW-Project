const db = require('./db');
const crypto = require('crypto');

let response;

function process(res, nick, password) {
    response = res;
    const hash = crypto
        .createHash('md5')
        .update(password)
        .digest('hex');

    db.verifyUser(response, nick, hash, register, correctCredentials, wrongCredentials);
}

function register(nick, hashedPassword) {
    db.insertUser(nick, hashedPassword);

    response.writeHead(200, {
        'Content-Type': 'application/json',
    });

    response.end();
}

function correctCredentials() {

    response.writeHead(200, {
        'Content-Type': 'application/json',
    });

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