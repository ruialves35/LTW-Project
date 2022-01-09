const http = require('http');
const db = require('./db');

let response;

async function get(res) {
    console.log(res);
    response = res;
    await db.getRanking(handleRows);
}

function handleRows(rows) {
    response.writeHead(200, {
        'Content-Type': 'application/json',
    });

    response.write({
        "ranking": rows,
    });

    response.end();
}


module.exports = { get }
