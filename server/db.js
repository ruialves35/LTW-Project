const crypto = require('crypto');
const fs = require('fs');

let response;

function verifyUser(res, username, hashedPassword, newUser, success, errorFunc) {
    response = res;
    fs.readFile('./db/users.json', function (error, data) {
        const dados = JSON.parse(data);
        if (error) {
            response.writeHead(404);
            response.write('Whoops! File not found!');
        } else {
            if (dados[username]){
                if (dados[username]["password"] == hashedPassword){
                    success();
                }
                else {
                    errorFunc();
                }
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

async function authenticateUser(username, hashedPassword, success, error) {
    const connect = await connectDb();
    const query = 'SELECT username, password FROM user WHERE username = ?';
    connect.all(query, [username], (err, rows) => {
        if (err) return console.error(err.message);

        if (rows.length == 0) {
            error();
        } else {
            if (rows[0].password == hashedPassword) {
                success();
            } else {
                error();
            }
        }
    })
}

async function getGameRequest(user, seeds, cavs, success) {
    const connect = await connectDb();
    const query = 'SELECT game, user FROM game_request WHERE seeds = ? AND cavs = ?';
    connect.all(query, [seeds, cavs], (err, rows) => {
        if (err) return console.error(err.message);

        if (rows.length == 0) {
            insertGameRequest(user, seeds, cavs);
            return getGameRequest(user, seeds, cavs, success);
        } else {
            if (user != rows[0].user) {
                setMatchedGameRequest(rows[0].game);
            }
            success(rows[0].game);
        }
    })
}

async function insertGameRequest(user, seeds, cavs) {
    const connect = await connectDb();
    const query = 'INSERT INTO game_request(game, seeds, cavs, user) VALUES (?, ?, ?, ?)'

    const hash = crypto
               .createHash('md5')
               .update(user + seeds + cavs)
               .digest('hex');

    return connect.run(
        query, 
        [hash, seeds, cavs, user],
        (err) => {
            if (err) return console.error(err.message);

            console.log("A new row has been created");
        }); 
}

async function setMatchedGameRequest(game) {
    const connect = await connectDb();
    const query = 'UPDATE game_request SET match = True WHERE game_request.game = ?;';

    return connect.run(
        query,
        [game],
        (err) => {
            if (err) return console.error(err.message);

            console.log("A row was updated");
        }
    )
}

async function removeUser(username) {
    const connect = await connectDb();
    const query = 'DELETE FROM user WHERE username = ?'
    connect.run(
        query, 
        [username],
        (err) => {
            if (err) return console.error(err.message);

            console.log("A new row has been deleted");
        }); 
}


async function updateUser(username, victories, games) {
    const connect = await connectDb();
    const query = 'UPDATE user SET victories = ?, games = ? WHERE user.username = ?;';

    return connect.run(
        query,
        [victories, games, username],
        (err) => {
            if (err) return console.error(err.message);

            console.log("A row was updated");
        }
    )
}

async function getRanking(fn) {

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

module.exports = { insertUser, removeUser, updateUser, getRanking, verifyUser, authenticateUser, getGameRequest }

