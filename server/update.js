const db = require('./db');

function process(response, nick, gameId) {
    const game = db.getGameByNick(nick, gameId);
    if (game == -1) {
        console.log(nick);
        response.writeHead(400, {    
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
            'Connection': 'keep-alive'
        });
    
        response.write(JSON.stringify({ 
            "error": "Invalid game reference"
        }));

        response.end();

    } else {
        const cavs = game[1];
        const board = game[5];
        const turn = game[6];
        const user1 = game[3];
        const user2 = game[4];
        const store1 = board[0];
        const store2 = board[cavs];

        let cells1 = [];
        for (let i = 1; i <= cavs; i++) {
            cells1.push(board[i]);
        }

        let cells2 = [];
        for (let i = cavs + 2; i < cavs * 2 + 2; i ++) {
            cells2.push(board[i]);
        }
        
        const user1Info = {"store" : store1, "pits" : cells1};
        const user2Info = {"store" : store2, "pits" : cells2};
        const sidesValue = { user1 : user1Info, user2: user2Info};
        const boardInfo = { "turn" : turn == 1 ? user1 : user2, "sides": sidesValue};

        let winner = null;
        let hasMoveP1 = false;
        let points1 = store1; 
        let points2 = store2;
        for (let i = 1; i <= cavs; i++) {
            if (cells1[i] != 0) {
                hasMoveP1 = true;
            }
            points1 += cells1[i];
        }

        let hasMoveP2 = false;
        for (let i = 1; i <= cavs; i++) {
            if (cells2[i] != 0) {
                hasMoveP2 = true;
                break;
            }
            points2 += cells2[i];
        }

        if (!hasMoveP1 || !hasMoveP2) {
            winner = {"winner" : points1 > points2 ? user1 : user2};
        }

        response.writeHead(200, {    
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
            'Connection': 'keep-alive'
        });
    
        console.log(JSON.stringify({ 
            "board": boardInfo,
            "turn": turn == 1 ? user1 : user2,
            winner
        }));

        response.write(JSON.stringify({ 
            "board": boardInfo,
            "turn": turn == 1 ? user1 : user2,
            winner
        }));
        
        response.end();
    }
}

module.exports = { process };