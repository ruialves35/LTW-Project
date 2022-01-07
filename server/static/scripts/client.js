var server_url = 'http://localhost:5000';
var GROUP = 49;

function makeRegister() {
    username = $("#username").value;
    password = $("#password").value;
    user = new User(username, password);

    if (register(username, password)) {
        GameController.USER = new User(username, password); 
        updatePlayerInfo("p1", GameController.USER.getUsername());
    };
}

function makeJoin() {
    if (!GameController.USER) {
        sendNotification("Error", "Error to join a server. Make sure you are logged in.");
        return;
    } else {
        // basically join the game, create a GameController and start the game
        join(GROUP, GameController.USER.getUsername(), GameController.USER.getPassword(), GameBoard.DEFAULT_CAVS_NUM, GameBoard.DEFAULT_SEEDS_NUM);
    }
}

/**
 * Makes a request to register a user to the server
 * 
 * @param nick username
 * @param pass password
 * @returns true when sucessfully registed, false otherwhise
 */
 async function register(nick, pass)  {
    let url = server_url + "/register";
    let success = false;
    await fetch(url,
    {
        method: "POST",
        body: JSON.stringify({
            nick: nick, 
            password: pass
        })
    })
    .then(function(res) { return res.json();})
    .then(function(data) {
        // TODO: Change this to message box when we do it instead of alerts
        if(data?.error) {
            sendNotification("Login Error", data.error);
        } else {
            success = true;
            sendNotification("Login", "Successfully logged in");
        }
    })

    return success;
}

/**
 * Connects a player to a game
 * 
 * @param group
 * @param nick
 * @param pass
 * @param size
 * @param initial
 */
async function join(group, nick, pass, size, initial) {
    let url = server_url + "/join";
    const res = await fetch(url,
    {
        method: "POST",
        body: JSON.stringify({
            group: group, 
            nick: nick, 
            password: pass,
            size: parseInt(size),
            initial: parseInt(initial)
        })
    })
    .then(function(res) { return res.json();})
    .then(function(data) {
        // TODO: Change this to message box when we do it instead of alerts
        if(data?.error) {
            sendNotification("Join Error", data.error);
            return -1;
        } else {
            if (data?.game) {
                GameController.GAME = data.game;
                sendNotification("Join", "You joinned a game successfully");
                return 1;
            } else {
                sendNotification("Join Error", "Couldn't join a game");
                return -1;
            }
        }
    })
    return res;
}

/**
 * Disconnects a player from a game  
 * 
 * @param nick 
 * @param pass 
 * @param game 
 * @param move 
 */
function leave(nick, pass, game) {
    let url = server_url + "/leave";
    fetch(url,
    {
        method: "POST",
        body: JSON.stringify({
            nick: nick, 
            password: pass,
            game: game,
        })
    })
}

/**
 * Notifies the server that a move was done by a player
 * 
 * @param nick 
 * @param pass 
 * @param game 
 * @param move 
 */
function notify(nick, pass, game, move) {
    let url = server_url + "/notify";
    fetch(url,
    {
        method: "POST",
        body: JSON.stringify({
            nick: nick, 
            password: pass,
            game: game,
            move: move
        })
    })
    .then(function(res) { return res.json();})
    .then(function(data) {
        if (data?.error) {
            sendNotification("Erro", data.error);
            result = false;
        }
    })
}

/**
 * @returns 
 */
function ranking() {
    let url = server_url + "/ranking";
    fetch(url,
    {
        method: "POST",
        body: JSON.stringify({})
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if(data?.error) {
            sendNotification("Ranking error", data.error);
            return -1;
        } else if (data?.ranking) {
            createRanking();
            let entry = Object.entries(data.ranking);
            for (let i = 0; i < entry.length; i++) {
                const information = entry[i][1];
                const username = information["nick"];
                const victories = information["victories"];
                const games = information["games"];

                addRankingRow(username, victories, games);
            }
        }
    })
}


