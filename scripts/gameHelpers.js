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