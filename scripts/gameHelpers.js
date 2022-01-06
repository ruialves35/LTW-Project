function correspondentDown(idx, numCavs) {
    return 1 + numCavs - (idx % (numCavs + 1));
}

function correspondentUp(idx, numCavs) {
    return numCavs * 2 + 2 - idx;
}

function getNewIndex(idx, seeds, numCavs, turn) {
    let new_idx = 0;
    for (let i = 1; i <= seeds; i++) {
        new_idx = (idx + i) % (numCavs * 2 + 2);
        //jump enemy storage
        if ((new_idx == 0 && turn == "P1") || (new_idx == numCavs + 1 && turn == "P2")) {
            seeds++;
            continue;
        }
    }
        
    return new_idx;
}

function setFirstPlayer() {
    const first = document.getElementById("first_turn");
    if (first !== null) {
        GameController.DEFAULT_FIRST_PLAYER = first.value;
    }
}

function setNumSeeds () {
    const getSeedsElem = document.getElementById("seeds_number");
    const seeds = parseInt(getSeedsElem.value);
    if (isNaN(seeds)) return;
    if (seeds > 0) {
        GameBoard.DEFAULT_SEEDS_NUM = seeds;
    } else {
        alert("You must have at least 1 seed in each cavity");
    }
    
}

function setNumCavs() {
    const cavs = parseInt(document.getElementById("cavs_number").value);
    
    if (isNaN(cavs)) return;
    if (cavs > 1) { 
        GameBoard.DEFAULT_CAVS_NUM = cavs;
    } else {
        alert("You must have at least 2 cavity on each side");
    }
}

function setOpponent() {
    const opponent = document.getElementsByName("opponent");

    for(let i = 0; i < opponent.length; i++) {
        if(opponent[i].checked)
            GameController.OPPONENT = opponent[i].value;
        }
}

function setAILevel() {
    const level = document.getElementById("AI_level");
    GameController.LEVEL = level.value;
}

function onPlayerBounds(player, idx, numCavs) {
    if (player == "P1") {
        return idx >= 1 && idx <= numCavs;
    } else if (player == "P2") {
        return idx >= numCavs + 2 && idx <= numCavs*2 + 1;    
    }
    return false;
}

function makePlay(gameController, board, idx) {
    gameController.sow_at(board, idx); 
    if (gameController.checkEndGame(board)) {
        gameController.endGame(board);
        return false;
    }
    return true;
}


function updatePlayerInfo(playerId, username) {
    let playerInfo = document.getElementById(playerId);
    playerInfo.innerHTML = username + "<br>"
}

function updateScore(name, score) {
    let scoreP = document.getElementById(name + "-score");

    if (scoreP != null) {
        scoreP.innerHTML = score + " seeds";
    }
}

function createRanking() {
    //limpar filhos
    let table = document.getElementById('ranking-table');
    let child = table.lastElementChild; 
    while (child) {
        table.removeChild(child);
        child = table.lastElementChild;
    }

    //adicionar Header
    let tableHeader = document.createElement("tr");
    tableHeader.id = "ranking-table-header";
    let nick = document.createElement("th");
    let victories = document.createElement("th");
    let games = document.createElement("th");

    nick.innerHTML = "Nick";
    victories.innerHTML = "Victories";
    games.innerHTML = "Games";

    tableHeader.appendChild(nick);
    tableHeader.appendChild(victories);
    tableHeader.appendChild(games);

    table.appendChild(tableHeader);
}

function addRankingRow(username, victories, games) {
    let table = document.getElementById('ranking-table');

    let row = document.createElement("tr");
    row.className = "ranking-table-entry";

    let nick = document.createElement("td");
    let vic = document.createElement("td");
    let g = document.createElement("td");

    //adicionar information
    nick.innerHTML = username;
    vic.innerHTML = victories;
    g.innerHTML = games;

    row.appendChild(nick);
    row.appendChild(vic);
    row.appendChild(g);

    //adicionar row
    table.appendChild(row);
}

function addLocalRanking() {
    const data = localStorage.getItem('data');
    let item;
    if (data === null) {
        //...
        item = {nick: 'player', victories: 0, games: 0} ;
        localStorage.setItem('data', JSON.stringify(item));
    } else {
        item = JSON.parse(data);
    }
    
    addRankingRow(item["nick"], item["victories"], item["games"]);
}

function updateLocalRanking(win) {
    const data = localStorage.getItem('data');
    let item;
    if (data === null) {
        //...
        item = {nick: 'player', victories: 0, games: 0} ;
        localStorage.setItem('data', JSON.stringify(item));
    } else {
        item = JSON.parse(data);
        const newItem = {
            nick: 'player', 
            victories: parseInt(item["victories"]) + win,
            games: parseInt(item["games"]) + 1
        };
        localStorage.setItem('data', JSON.stringify(newItem));
    }
}
