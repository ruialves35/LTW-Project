function correspondentDown(idx, numCavs) {
    return 1 + numCavs - (idx % (numCavs + 1));
}

function correspondentUp(idx, numCavs) {
    return numCavs * 2 + 2 - idx;
}

function getFirstPlayer() {
    const first = document.getElementById("first_turn");
    if (first !== null) {
        GameController.DEFAULT_FIRST_PLAYER = first.value;
    }
}

function getNumSeeds () {
    const getSeedsElem = document.getElementById("seeds_number");
    const seeds = parseInt(getSeedsElem.value);
    if (isNaN(seeds)) return;
    if (seeds > 0) {
        GameBoard.DEFAULT_SEEDS_NUM = seeds;
    } else {
        alert("You must have at least 1 seed in each cavity");
    }
    
}

function getNumCavs() {
    const cavs = parseInt(document.getElementById("cavs_number").value);
    
    if (isNaN(cavs)) return;
    if (cavs > 0) { 
        GameBoard.DEFAULT_CAVS_NUM = cavs;
    } else {
        alert("You must have at least 1 cavity");
    }
}

function onPlayerBounds(player, idx, numCavs) {
    if (player == "p1") {
        return idx >= 1 && idx <= numCavs;
    } else if (player == "p2") {
        return idx >= numCavs + 2 && idx <= numCavs*2 + 1;    
    }
    return false;
}