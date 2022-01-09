const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const crypto = require('crypto');


function createDbConnection(filename) {
    return open({
        filename,
        driver: sqlite3.Database
    });
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

async function removeUser(username) {
    const connect = await connectDb();
    const query = 'DELETE FROM user WHERE username = ?'
    connect.run(
        query, 
        [username],
        (err) => {
            if (err) return console.error(err.message);

            console.log("A new row has been created");
        }); 
}

async function insertUser(username, password) {
    const connect = await connectDb();
    const query = 'INSERT INTO user(username, password, victories, games) VALUES (?, ?, ?, ?)'

    const algorithm = "aes-256-cbc"; 
    // generate 16 bytes of random data
    const initVector = crypto.randomBytes(16);
    // secret key generate 32 bytes of random data
    const Securitykey = crypto.randomBytes(32);
    // the cipher function
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    // encrypt the message
    // input encoding
    // output encoding
    let encryptedPassword = cipher.update(password, "utf-8", "hex");
    encryptedPassword += cipher.final("hex");

    connect.run(
        query, 
        [username, encryptedPassword, 0, 0],
        (err) => {
            if (err) return console.error(err.message);

            console.log("A new row has been created");
        }); 
}

async function selectUsersByWins() {
    const connect = await connectDb();
    const query = 'SELECT * FROM user ORDER BY victories LIMIT 10;' // just get the first 10 players
    connect.all(query, [], (err, rows) => {

        if (err) return console.error(err.message);

        rows.forEach((row) => {
            console.log("Ola");
            console.log(row);
        });
    });
}

module.exports = { connectDb, insertUser, removeUser, selectUsersByWins }

/*
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
    db.close();
});
*/

