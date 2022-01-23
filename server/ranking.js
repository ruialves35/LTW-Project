const db = require('./db');

let response;

async function get(res) {
    response = res;
    db.getRanking(handleRows);
}

function handleRows(rows) {
    response.writeHead(200, {
        'Content-Type': 'application/json',
    });
    
    response.write(JSON.stringify({
        "ranking": rows,
    }));

    response.end();
}

module.exports = { get }
