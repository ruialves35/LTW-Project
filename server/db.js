const sqlite3 = require('sqlite3');
const crypto = require('crypto');

function createDbConnection(filename) {
    return new sqlite3.Database(filename);
}

async function connectDb() {
    try {
        const connection = await createDbConnection('mancalaDb.db');
        console.log('Connected to mancalaDb.db SQlite database.');
        return connection;
    } catch (error) {
        console.error(error);
    }
}

async function verifyUser(username, hashedPassword, newUser, success, error) {
    const connect = await connectDb();
    const query = 'SELECT username, password FROM user WHERE username = ?';
    connect.all(query, [username], (err, rows) => {
        if (err) return console.error(err.message);

        if (rows.length == 0) {
            newUser(username, hashedPassword);
        } else {
            if (rows[0].password == hashedPassword) {
                success();
            } else {
                error();
            }
        }
    })
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

async function insertUser(username, password) {
    const connect = await connectDb();
    const query = 'INSERT INTO user(username, password, victories, games) VALUES (?, ?, ?, ?)'

    const hash = crypto
               .createHash('md5')
               .update(password)
               .digest('hex');

    return connect.run(
        query, 
        [username, hash, 0, 0],
        (err) => {
            if (err) return console.error(err.message);

            console.log("A new row has been created");
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
    const connect = await connectDb();
    const query = 'SELECT username as nick, victories, games FROM user ORDER BY victories DESC, games ASC, username ASC LIMIT 10;' // just get the first 10 players
    connect.all(query, [], (err, rows) => {

        if (err) return console.error(err.message);
        fn(rows);
    });

}

module.exports = { connectDb, insertUser, removeUser, updateUser, getRanking, verifyUser}

/*
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
    db.close();
});
*/

