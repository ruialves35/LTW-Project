var server_url = 'http://twserver.alunos.dcc.fc.up.pt:8008';

function makeRegister() {
    username = $("#username").value;
    password = $("#password").value;
    user = new User(username, password);

    if (register(username, password)) {
        GameController.USER = new User(username, password); 
    };
}

function makeJoin() {
    if (!GameController.USER) {
        alert("Error to join a server. Make sure you are logged in.");
        return;
    }
}

/**
 * Makes a request to register a user to the server
 * 
 * @param nick username
 * @param pass password
 * @returns true when sucessfully registed, false otherwhise
 */
 function register(nick, pass) {
    let url = server_url + "/register";
    let success = false;
    fetch(url,
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
            alert("Invalid credentials. Username is already registed with another password.");
        } else {
            success = true;
            alert("Successfully logged in")
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
function join(group, nick, pass, size, initial) {
    let url = server_url + "/join";
    fetch(url,
    {
        method: "POST",
        body: JSON.stringify({
            group: group, 
            nick: nick, 
            password: pass,
            size: size,
            initial: initial
        })
    })
    .then(function(res) { return res.json;})
    .then(function(data) {
        // TODO: Change this to message box when we do it instead of alerts
        if(data?.error) {
            alert("Error to join a server. Make sure you are logged in and have the right configurations.");
        } else {
            if (data?.game) {
                GameController.GAMECODE = data.game;
                alert("Successfully join a game");
            } else {
                alert("Could not log in to a game")
            }
        }
    })
}

/**
 * Disconnects a player from a game  
 * 
 * @param nick 
 * @param pass 
 * @param game 
 * @param move 
 */
function leave(nick, pass, game, move) {
    let url = server_url + "/leave";
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
    .then(function(res) { return res.json;})
    .then(function(data) {
        // debugging only
        console.log(JSON.stringify(data));
        console.log(data.error);
        
        if (data.error == "User registered with a different password") {
            alert("Invalid credentials. Username is already register with another password.");
            result = false;
        }
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
    .then(function(res) { return res.json;})
    .then(function(data) {
        // debugging only
        console.log(JSON.stringify(data));
        console.log(data.error);
        
        if (data.error == "User registered with a different password") {
            alert("Invalid credentials. Username is already register with another password.");
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
    })
    .then(function(res) { return res.json; })
}



function update(nick, game) {
    let url = server_url + "/update?nick=" + nick + "&game=" + game ;
    let source = new EventSource(url);
    source.onmessage = event => {
        return event.data;
    }
}