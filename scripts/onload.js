const $ = (selector) => document.querySelector(selector)

class Seed {
    element;

    constructor() {
        const angle = Math.floor(Math.random() * 360);
        const offsetX = Math.floor(Math.random() * 100 - 50);
        const offsetY = Math.floor(Math.random() * 200 - 50);
        const offsetMultiplier = Math.floor(Math.random()*3 - 1);
        
        this.element = document.createElement('div');
        this.element.classList.add("seed");
        this.element.style.transform = "translateX(" + offsetX + "%) translateY(" + offsetMultiplier*offsetY +"%) rotate(" + angle + "deg)";
    }

    getElement() { return this.element; }
}

class Cell {
    seeds;
    element;
    id;

    constructor(seeds, id, className) {
        this.seeds = seeds;
        this.id = id;
        this.build(className);
    }

    setSeeds(seeds) {
        this.seeds = seeds;
        this.update_element();
    }

    getId() {
        return this.id;
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

    change_borders() {
        var rand = (Math.random() * 20 + 35);
        this.element.style.borderTopLeftRadius = rand.toString() + "vh";
        rand = (Math.random() * 20 + 35);
        this.element.style.borderTopRightRadius = rand.toString() + "vh";
        rand = (Math.random() * 20 + 35);
        this.element.style.borderBottomLeftRadius = rand.toString() + "vh";
        rand = (Math.random() * 20 + 35);
        this.element.style.borderBottomRightRadius = rand.toString() + "vh";
    }

    update_element() {
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }

        for (let i = 0; i < this.seeds; i++) {
            const seed = new Seed();
            this.element.appendChild(seed.getElement());
        }
    }

    addCellOnClick(gameController, fn, board, id) {
        this.element.onclick = function () { 
            fn(gameController, board, id);
        };
    }

    getElement() { return this.element; }
}

class StorageContainer {
    element;
    storageCell;
    id;

    constructor(id) {
        this.id = id;
        this.build();
    }

    build() {
        this.element = document.createElement("div");
        this.element.className = "storage-container";
        
        var wrapper = document.createElement("div");
        wrapper.className = "storage-wrapper";

        var line = document.createElement("div");
        line.className = "storage-line";

        this.storageCell = new Cell(0, this.id, "storage-cell");
        this.element.appendChild(wrapper);
        this.element.appendChild(line);
        this.element.appendChild(this.storageCell.getElement());
    }

    getElement() { return this.element; }

    getCell() { return this.storageCell; };

    addSeeds(seeds) { this.storageCell.setSeeds(this.storageCell.getSeeds() + seeds); }
}

class CellContainer {
    element;
    numCavs;
    startId;
    cells;
    asc;

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
            new_cell.change_borders();
            
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
    static GAMECODE;
    numSeeds;
    numCavs
    element;
    leftStorage;
    rightStorage;
    upCellContainer;
    downCellContainer;
    cells;

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

    getNotEmptyUpCellsIndexes() {
        let indexes = [];
        let upCells = this.upCellContainer.getCells();
        for (let i = upCells.length - 1; i >= 0; i--) {
            if (upCells[i].getSeeds() != 0) {
                indexes.push(parseInt(upCells[i].getId()));
            }
        }
        return indexes;
    }

    getLeftStorage() { return this.leftStorage; }

    getRightStorage() { return this.rightStorage; }

    getCells() { return this.cells; }
    
    getElement() { return this.element; }
}


class PlayerContainer {
    element;
    points;
    name;

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
    static DEFAULT_FIRST_PLAYER = "P1";
    static OPPONENT = "Player";
    static LEVEL = "Easy";
    static USER;
    static GAME;
    player1Container;
    player2Container;
    gameBoardController;
    numCavs;
    numSeeds;
    turn;
    strategy;

    constructor(board) {
        this.turn = GameController.DEFAULT_FIRST_PLAYER;
        this.numCavs = board.getNumCavs();
        this.numSeeds = board.getNumSeeds();
        this.setStrategy();
        this.build(board);
    }

    getComputerStrategy() {
        const strategy = new Strategy();         
        if (GameController.LEVEL == "Easy") {   
            return strategy.easyStrategy();
        } else if (GameController.LEVEL == "Medium") {
            return strategy.mediumStrategy();
        } else {
            // hard level 
        }
    }


    setStrategy() {
        if (GameController.OPPONENT == "Player") {
            const strategy = new Strategy();
            this.strategy = strategy.playerStrategy();
        } else {
            this.strategy = (gameController, board, idx) => { 
                gameController.getComputerStrategy()(gameController, board, idx); 
            };
        }
    }

    build(board) {
        this.player1Container = new PlayerContainer('player1');
        this.gameBoardController = new GameBoardController(board);
        this.gameBoardController.highlightStorage(this.turn);
        this.gameBoardController.addCellOnClick(this, this.strategy);
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
        let nextPlayer = this.turn == "P1" ? "P2" : "P1";
        if (onPlayerBounds(this.turn, idx, this.numCavs)) {
            let replay = this.gameBoardController.sow_at(board, idx, this.turn);
            if (!replay) {
                this.turn = nextPlayer;
                this.gameBoardController.highlightStorage(this.turn);
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

        let p1StorageCell = board.getRightStorage();

        let downCells = board.getDownCellContainer().getCells();
        for (let i = 0; i < downCells.length; i++) {
            let seeds = downCells[i].getSeeds();

            p1StorageCell.addSeeds(seeds);
            downCells[i].setSeeds(0);
        }
        console.log("P1: " + p1StorageCell.getCell().getSeeds());

        let p2StorageCell = board.getLeftStorage();

        let upCells = board.getUpCellContainer().getCells();
        for (let i = upCells.length - 1; i >= 0; i--) {
            let seeds = upCells[i].getSeeds();

            p2StorageCell.addSeeds(seeds);
            upCells[i].setSeeds(0);
        }
        console.log("P2: " + p2StorageCell.getCell().getSeeds());

        let winner = p1StorageCell.getCell().getSeeds() > p2StorageCell.getCell().getSeeds() ? "P1" : "P2";
        console.log("The winner is...", winner, "! Congratulations");
    }

}

class GameBoardController {
    board;

    constructor(board) {
        this.board = board;
    }

    sow_at (board, idx, turn) {
        let cells = board.getCells();
        let seeds = cells[idx].getSeeds();
        let numCavs = board.getNumCavs();
        cells[idx].setSeeds(0);

        let new_idx = 0;
        for (let i = 1; i <= seeds; i++) {
            new_idx = (idx + i) % (numCavs * 2 + 2);
            //jump enemy storage
            if ((new_idx == 0 && turn == "P1") || (new_idx == numCavs + 1 && turn == "P2")) {
                seeds++;
                continue;
            }

            cells[new_idx].setSeeds(cells[new_idx].getSeeds() + 1);
        }
        
        let cellIdx = turn == "P1" ? numCavs + 1 : 0;

        if (new_idx == cellIdx) {
            return true;
        } else if (cells[new_idx].getSeeds() == 1 && onPlayerBounds(turn, new_idx, numCavs)) {

            let correspondentIdx = turn == "P1" ? correspondentUp(new_idx, numCavs) : correspondentDown(new_idx, board.getNumCavs());

            cells[cellIdx].setSeeds(cells[cellIdx].getSeeds() + cells[correspondentIdx].getSeeds() + 1);
            cells[correspondentIdx].setSeeds(0);
            cells[new_idx].setSeeds(0);
        }

        return false;
    }

    addCellOnClick(gameController, fn) {
        let cells = this.board.getCells();
        for (let i = 0; i < cells.length; i++) {
            cells[i].addCellOnClick(gameController, fn, this.board, i);
        }
    }

    getBoard() {
        return this.board;
    }

    highlightStorage(turn) {
        let rightStorage = this.board.getRightStorage().getElement().firstChild;
        let leftStorage = this.board.getLeftStorage().getElement().firstChild;

        if (turn == "P1") {
            rightStorage.classList.add("highlighted");
            leftStorage.classList.remove("highlighted");
        } else {
            leftStorage.classList.add("highlighted");
            rightStorage.classList.remove("highlighted");
        }
    }
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
