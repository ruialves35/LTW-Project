const $ = (selector) => document.querySelector(selector)

class Seed {
    #element;

    constructor() {
        const angle = Math.floor(Math.random() * 360)
        const offsetX = Math.floor(Math.random() * 100 - 50)
        const offsetY = Math.floor(Math.random() * 200 - 50)
        const offsetMultiplier = Math.floor(Math.random()*2 - 1);
        
        this.element = document.createElement('div');
        this.element.classList.add("seed");
        this.element.style.transform = "translateX(" + offsetX + "%) translateY(" + offsetMultiplier*offsetY +"%) rotate(" + angle + "deg)";
    }

    getElement() { return this.element; }
}

class Cell {
    #seeds;
    #element;
    #id;

    constructor(seeds, id, className) {
        this.seeds = seeds;
        this.id = id;
        this.build(className);
    }

    setSeeds(seeds) {
        this.seeds = seeds;
        this.update_element();
    }

    getSeeds() {
        return this.seeds;
    }

    build(className) {
        this.element = document.createElement("div");
        this.element.className = className;
        this.element.id = this.id;

        for (let i = 0; i < this.seeds; i++) {
            const seed = new Seed();
            this.element.appendChild(seed.getElement());
        }
    }

    // Testar isto so a fazer build, sem precisar de dar remove, para reutilizar o for
    update_element() {
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }

        for (let i = 0; i < this.seeds; i++) {
            const seed = new Seed();
            this.element.appendChild(seed.getElement());
        }
    }

    addCellOnClick(gameController, board, id) {
        this.element.onclick = function () { 
            gameController.sow_at(board, id); 
            if (gameController.checkEndGame(board)) {
                gameController.endGame(board);
            }
        };
    }

    getElement() { return this.element; }
}

class StorageContainer {
    #element;
    #storageCell;
    #id;

    constructor(id) {
        this.id = id;
        this.build();
    }

    build() {
        this.element = document.createElement("div");
        this.element.className = "storage-container";
        
        this.storageCell = new Cell(0, this.id, "storage-cell");
        this.element.appendChild(this.storageCell.getElement());
    }

    getElement() { return this.element; }

    getCell() { return this.storageCell; };

    addSeeds(seeds) { this.storageCell.setSeeds(this.storageCell.getSeeds() + seeds); }
}

class CellContainer {
    #element;
    #numCavs;
    #startId;
    #cells;
    #asc;

    constructor(numCavs, startId, asc) {
        this.numCavs = numCavs;
        this.startId = startId;
        this.asc = asc;
        this.cells = [];
        this.build();
    }

    setNumCavs(numCavs) {
        this.numCavs = numCavs;
    }

    build() {
        this.element = document.createElement("div");
        this.element.className = "cell-container";

        for (let i = 0; i < this.numCavs; i++) {
            let id = this.asc ? this.startId + i : this.startId + this.numCavs - 1 - i;

            const new_cell = new Cell(GameBoard.DEFAULT_SEEDS_NUM, id.toString(), "board-cell");
            
            this.cells.push(new_cell);

            this.element.appendChild(new_cell.getElement());
        }
    }

    getElement() { return this.element; }

    getCells() { return this.cells; }
}

class GameBoard {
    static DEFAULT_SEEDS_NUM = 5;
    static DEFAULT_CAVS_NUM = 6;
    #numSeeds;
    #numCavs
    #element;
    #leftStorage;
    #rightStorage;
    #upCellContainer;
    #downCellContainer;
    #cells;

    constructor() {
        this.numSeeds = GameBoard.DEFAULT_SEEDS_NUM;
        this.numCavs = GameBoard.DEFAULT_CAVS_NUM;
        this.cells = [];
        this.build();
    } 

    build() {
        this.leftStorage = new StorageContainer("0");
        this.rightStorage = new StorageContainer((this.numCavs + 1).toString());
        
        this.upCellContainer = new CellContainer(this.numCavs, this.numCavs + 2, false);
        this.downCellContainer = new CellContainer(this.numCavs, 1, true);        
        
        this.cells.push(this.leftStorage.getCell());
        
        let downCells = this.downCellContainer.getCells();
        for (let i = 0; i < downCells.length; i++) {
            this.cells.push(downCells[i]);
        }
        
        this.cells.push(this.rightStorage.getCell());
        
        let upCells = this.upCellContainer.getCells();
        for (let i = upCells.length - 1; i >= 0; i--) {
            this.cells.push(upCells[i]);
        }

        this.element = document.createElement("div");
        this.element.id = "game-container";

        let child  = document.createElement("section");
        child.id = "board";
        child.appendChild(this.leftStorage.getElement());
        child.appendChild(this.upCellContainer.getElement()); 
        child.appendChild(this.rightStorage.getElement());
        child.appendChild(this.downCellContainer.getElement());
    
        this.element.appendChild(child);
    }

    getNumCavs() { return this.numCavs; }

    getNumSeeds() { return this.numSeeds; }

    getUpCellContainer() { return this.upCellContainer; }

    getDownCellContainer() { return this.downCellContainer; }

    getLeftStorage() { return this.leftStorage; }

    getRightStorage() { return this.rightStorage; }

    getCells() {
        return this.cells;
    }
    
    getElement() { return this.element; }
}


class PlayerContainer {
    #element;
    #points;
    #name;

    constructor(name) {
        this.name = name;
        this.points = 0;

        this.build();
    }

    build() {
        this.element = document.createElement("div");
        this.element.className = "player-container";

        const title = document.createElement("h2");
        title.innerHTML = this.name;
        this.element.appendChild(title);
    }

    getElement() { return this.element; }
}

class GameController {
    static DEFAULT_FIRST_PLAYER = "p1";
    #player1Container;
    #player2Container;
    #gameBoardController;
    #numCavs;
    #numSeeds;
    #turn;

    constructor(board) {
        this.turn = GameController.DEFAULT_FIRST_PLAYER;
        this.numCavs = board.getNumCavs();
        this.numSeeds = board.getNumSeeds();
        this.build(board);
    }

    build(board) {
        this.player1Container = new PlayerContainer('player1');
        this.gameBoardController = new GameBoardController(board);
        this.gameBoardController.addCellOnClick(this);
        this.player2Container = new PlayerContainer('player2'); // Must change the name after that;
    }

    getPlayer1Container() {
        return this.player1Container;
    }

    getPlayer2Container() {
        return this.player2Container;
    }

    getGameBoardController() {
        return this.gameBoardController;
    }

    sow_at(board, idx) {
        let nextPlayer = this.turn == "p1" ? "p2" : "p1";
        
        if (onPlayerBounds(this.turn, idx, this.numCavs)) {
            let replay = this.gameBoardController.sow_at(board, idx, this.turn);
            if (!replay) {
                console.log(nextPlayer);
                this.turn = nextPlayer;
            }
        } 
    }


    checkEndGame(board) {

        let canPlayP1 = false;
        let canPlayP2 = false;

        let downCells = board.getDownCellContainer().getCells();
        for (let i = 0; i < downCells.length; i++) {
            let seeds = downCells[i].getSeeds();

            if (seeds > 0) {
                canPlayP1 = true;
                break;
            }
        }

        let upCells = board.getUpCellContainer().getCells();
        for (let i = upCells.length - 1; i >= 0; i--) {
            let seeds = upCells[i].getSeeds();

            if (seeds > 0) {
                canPlayP2 = true;
                break;
            }
        }

        return !(canPlayP1 && canPlayP2);
    }

    endGame(board) {
        console.log("END GAME");


        let p1StorageCell = board.getLeftStorage();
        
        let downCells = board.getDownCellContainer().getCells();
        for (let i = 0; i < downCells.length; i++) {
            let seeds = downCells[i].getSeeds();

            p1StorageCell.addSeeds(seeds);
            downCells[i].setSeeds(0);
        }
        console.log("Player1: " + p1StorageCell.getCell().getSeeds());

        let p2StorageCell = board.getRightStorage();

        let upCells = board.getUpCellContainer().getCells();
        for (let i = upCells.length - 1; i >= 0; i--) {
            let seeds = upCells[i].getSeeds();

            p2StorageCell.addSeeds(seeds);
            upCells[i].setSeeds(0);
        }
        console.log("Player2: " + p2StorageCell.getCell().getSeeds());

    }

}

class GameBoardController {
    #board;

    constructor(board) {
        this.board = board;
    }

    sow_at (board, idx, turn) {
        let cells = board.getCells();
        let seeds = cells[idx].getSeeds();
        cells[idx].setSeeds(0);


        let new_idx = 0;
        for (let i = 1; i <= seeds; i++) {
            new_idx = (idx + i) % (board.getNumCavs() * 2 + 2);
            if ((new_idx == 0 && turn == "p1") || (new_idx == board.getNumSeeds() + 1 && turn == "p2")) {
                seeds++;
                continue;
            }
            cells[new_idx].setSeeds(cells[new_idx].getSeeds() + 1);
        }
        
        let cellIdx = turn == "p1" ? board.getNumCavs() + 1 : 0;
        if (new_idx == cellIdx) {
            return true;
        } else if (cells[new_idx].getSeeds() == 1 && onPlayerBounds(turn, new_idx, board.getNumCavs())) {

            let correspondentIdx = turn == "p1" ? correspondentUp(new_idx, board.getNumCavs()) : correspondentDown(new_idx, board.getNumCavs());

            cells[cellIdx].setSeeds(cells[cellIdx].getSeeds() + cells[correspondentIdx].getSeeds() + 1);
            cells[correspondentIdx].setSeeds(0);
            cells[new_idx].setSeeds(0);
        }

        return false;
    }

    addCellOnClick(gameController) {
        let cells = this.board.getCells();
        for (let i = 0; i < cells.length; i++) {
            cells[i].addCellOnClick(gameController, this.board, i);
        }
    }

    getBoard() {
        return this.board;
    }
}


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


function load () {

    document.getElementById("body").classList.remove("preload");
    const container = document.getElementById("container");
    
    let board = new GameBoard();
    let gameController = new GameController(board);

    if(container.hasChildNodes()) {
        container.replaceChild(gameController.getPlayer1Container().getElement(), container.children[0]); 
        container.replaceChild(gameController.getGameBoardController().getBoard().getElement(), container.children[1]);
        container.replaceChild(gameController.getPlayer2Container().getElement(), container.children[2]);
    } else {
        container.appendChild(gameController.getPlayer1Container().getElement());
        container.appendChild(gameController.getGameBoardController().getBoard().getElement());
        container.appendChild(gameController.getPlayer2Container().getElement());
    }
};

window.load(load);
