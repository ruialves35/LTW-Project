const db = require('./db');

const crypto = require('crypto');
const errors = require('./errors');

let response;
let user;
let gameId;
let cav;

function onPlayerBounds(player, idx, numCavs, player1) {
    if (player == player1) {
        return idx >= 1 && idx <= numCavs;
    } else {
        return idx >= numCavs + 2 && idx <= numCavs*2 + 1;    
    }
}

function correspondentDown(idx, numCavs) {
    return 1 + numCavs - (idx % (numCavs + 1));
}

function correspondentUp(idx, numCavs) {
    return numCavs * 2 + 2 - idx;
}


function process(res, nick, password, game, move) {
    response = res;

    if (typeof nick !== "string") {
        errors.wrongArgument(res, "nick", nick);
        return;
    } else if (typeof password !== "string") {
        errors.wrongArgument(res, "password", password);
        return;
    } else if (typeof game !== "string") {
        errors.wrongArgument(res, "game", game);
        return;
    } else if (typeof move !== "string" && typeof move !== "number") {
        errors.wrongArgument(res, "move", move);
        return;
    } 

    const hash = crypto
        .createHash('md5')
        .update(password)
        .digest('hex');

    if (typeof move === "string") {
        checkMove = parseInt(move);
        if (isNaN(checkMove)) {
            errors.wrongArgument(res, "move", move);
            return;
        }
    }

    user = nick;
    gameId = game;
    cav = move;

    db.verifyUser(response, nick, hash, wrongCredentials, correctCredentials, wrongCredentials);
}

function correctCredentials() {

    // check if there is any game that has that seeds or cavs
    // games -> [[gameId, size, initial, nick1, nick2], [gameId, size, initial, nick1, nick2]...]
    let game = db.getGame(user, gameId);
    
    if (game == -1) {
        response.writeHead(400, {
            'Content-Type': 'application/json',
        });
    
        response.write(JSON.stringify({
            "error": "No game found with id:" + gameId
        }));
    
        response.end();
        return;
    } else if (game == -2) {
        response.writeHead(200, {
            'Content-Type': 'application/json',
        });
    
        response.write(JSON.stringify({}));
    
        response.end();
        return;
    } else {

        let turn = game[6];
        if (turn != user) {
            response.writeHead(400, {
                'Content-Type': 'application/json',
            });
        
            response.write(JSON.stringify({
                "error":"Not your turn to play"
            }));
        
            response.end();
            return;
        } else {

            let numCavs = game[1];
            let nick1 = game[3];
            let nick2 = game[4];

            cav += 1;
            cav += user == nick1 ? 0 : numCavs + 1;

            let board = game[5];
            let seeds = board[cav];  

            initialCav = user == nick1 ? 0 : numCavs;
            finalCav = user == nick1 ? numCavs + 1 : numCavs * 2 + 2;

            if (cav < initialCav || cav > finalCav ) {

                response.writeHead(400, {
                    'Content-Type': 'application/json',
                });
            
                response.write(JSON.stringify({
                    "error":"invalid start position: " + (cav - 1)
                }));
            
                response.end();
                return;
            }

            // sow algorithm 
            board[cav] = 0;
            
            let new_idx = 0;
            for (let i = 1; i <= seeds; i++) {
                new_idx = (cav + i) % (numCavs * 2 + 2);
                
                if ((new_idx == 0 && turn == nick1) || (new_idx == numCavs + 1 && turn == nick2)) {
                    seeds++;
                    continue;
                }

                board[new_idx] += 1;
            }

            let cellIdx = turn == nick1 ? numCavs + 1 : 0;
            
            if (new_idx == cellIdx) {

                game[5] = board;
                
                // não mudar o turn
                db.updateGame(response, game);
                return;

            } else if ( board[new_idx] == 1 && onPlayerBounds(user, new_idx, numCavs, nick1)) {
                let correspondentIdx = turn == nick1 ? correspondentUp(new_idx, numCavs) : correspondentDown(new_idx, numCavs);

                board[cellIdx] = board[cellIdx] + board[correspondentIdx] + 1;
                board[correspondentIdx] = 0;
                board[new_idx] = 0;
            }

            // mudar o turn
            game[5] = board;
            game[6] = turn == nick1 ? nick2 : nick1;

            db.updateGame(response, game);
            return;
        }
    }
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