const crypto = require('crypto');
const fs = require('fs');

let response;
let games = []; // games -> [[gameId, size, initial, nick1, nick2, board], [gameId, size, initial, nick1, nick2, board]...]

function verifyUser(res, username, hashedPassword, newUser, success, errorFunc) {
    response = res;
    fs.readFile('./db/users.json', function (error, data) {
        const dados = JSON.parse(data);
        if (error) {
            response.writeHead(404);
            response.write('Whoops! File not found!');
        } else {
            if (dados[username]){
                dados[username]["password"] == hashedPassword ? success() : errorFunc();
            } else {
                newUser(username, hashedPassword);
            }
        }
        response.end();
    });
}

function insertUser(username, password) {

    fs.readFile('./db/users.json', function (error, data) {
        if (error) {
            console.log("Error in InsertUser");
        } else {
            const newData = {
                    "password": password,
                    "victories": 0,
                    "games": 0
                }
            //JSON.stringify(newData)
            let dados = JSON.parse(data);
            dados[username] = newData;
            
            fs.writeFile('./db/users.json', JSON.stringify(dados, null, 2), function(err) {
                if (err) {
                    console.log("Error in InsertUser");
                }
            })
        }
    });
}

function getRanking(fn) {

    fs.readFile('./db/users.json', function (error, data) {
        if (error) {
            console.log("Error in InsertUser");
        } else {
            //JSON.stringify(newData)
            let json = JSON.parse(data);

            const rankingData = Object.keys(json).map(function(key) {
                return { nick: key, victories: json[key].victories, games: json[key].games };
            }).sort( (itemA, itemB) => itemB.victories - itemA.victories );

            fn(rankingData)
        }
    });
}

function getGameRequest(nick, size, initial) {
    let foundGame = false;
    let gameId;
    for (let game of games) {
        if (game[3] == nick || game[4] == nick) {
            foundGame = true;
            gameId = game[0];
            break;
        }
    }

    if (!foundGame) {
        for (let game of games) {
            if (game[1] == size && game[2] == initial && game[4] == null){
                game[4] = nick;
                gameId = game[0];
                foundGame = true;
                break;
            }
        }
    }

    if (!foundGame) {
        gameId = crypto
               .createHash('md5')
               .update(Date.now().toString())
               .update(size.toString())
               .update(initial.toString())
               .digest('hex');

        console.log("Pushing: ", [gameId, size, initial, nick]);
        games.push([gameId, size, initial, nick, null]);
    }

    console.log(games[0]);
    return gameId;
}

module.exports = { insertUser, getRanking, verifyUser, getGameRequest }

