var DEFAULT_SEEDS_NUM = 5;
var DEFAULT_CAVS_NUM = 6;

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

    update_element() {
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }

        for (let i = 0; i < this.seeds; i++) {
            const seed = new Seed();
            this.element.appendChild(seed.getElement());
        }
    }

    addCellOnClick(fn, id) {
        this.element.onclick = function () { fn(id); };
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
        
        this.storageCell = new  Cell(0, this.id, "storage-cell");
        this.element.appendChild(this.storageCell.getElement());
    }

    getElement() { return this.element; }

    getCell() { return this.storageCell; };
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
            let id = 0;
            if (this.asc) {
                id = this.startId + i;
            } else {
                id = this.startId + this.numCavs - 1 - i;
            }
            const new_cell = new Cell(DEFAULT_SEEDS_NUM, id.toString(), "board-cell");
            
            this.cells.push(new_cell);

            this.element.appendChild(new_cell.getElement());
        }
    }

    getElement() { return this.element; }

    getCells() { return this.cells; }
}

class GameBoard {
    #numSeeds;
    #numCavs;
    #element;
    #leftStorage;
    #rightStorage;
    #upCellContainer;
    #downCellContainer;
    #cells;

    constructor(numSeeds, numCavs) {
        this.numSeeds = numSeeds;
        this.numCavs = numCavs;
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

    getCells() {
        return this.cells;
    }
    
    getElement() { return this.element; }
}

function correspondentDown(idx, numCavs) {
    return 1 + numCavs - (idx % (numCavs + 1));
}

function correspondentUp(idx, numCavs) {
    return numCavs * 2 + 2 - idx;
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
        this.element.style.content = "ola";
        const title = document.createElement("h2");
        title.innerHTML = this.name;
        this.element.appendChild(title);
        console.log(title);
    }

    getElement() { return this.element; }
}

class GameController {
    #player1Container;
    #player2Container; //can be pc
    #gameController;
    #numCavs;
    #numSeeds;
    #turn;

    constructor(num_seeds, num_cavs) {
        this.numCavs = num_cavs;
        this.numSeeds = num_seeds;
        this.turn = "p1";
        this.build();
    }

    build() {
        this.player1Container = new PlayerContainer('player1');
        this.gameController = new GameBoardController(this.numSeeds, this.numCavs);
        this.gameController.addCellOnClick(function (id) {this.sow_at(id)});
        this.player2Container = new PlayerContainer('player2'); // it's hard coded yet
    }

    getPlayer1Container() {
        return this.player1Container;
    }

    getPlayer2Container() {
        return this.player2Container;
    }

    getGameBoardController() {
        return this.gameController;
    }

    sow_at(idx) {
        if (this.turn == "p1") {
            if (onPlayerBounds("p1", idx, this.numCavs)) {
                let replay = this.getGameContainer().getBoard().sow_at(idx, this.turn);
                if (!replay) {
                    this.turn = "p2";
                }
            }
        } else if (this.turn == "p2") {
            if (onPlayerBounds("p2", idx, this.numCavs)) {
                let replay = this.getGameContainer().getBoard().sow_at(idx, this.turn);
                if (!replay) {
                    this.turn = "p1";
                }
            }
        }
    }
}

class GameBoardController {
    #board;

    constructor(numSeeds, numCavs) {
        this.board = new GameBoard(numSeeds, numCavs);
    }

    sow_at (idx, turn) {

        let cells = this.board.getCells();

        let seeds = cells[idx].getSeeds();
        cells[idx].setSeeds(0);

        let new_idx = 0;
        for (let i = 1; i <= seeds; i++) {
            new_idx = (idx + i) % (this.numCavs * 2 + 2);
            if ((new_idx == 0 && turn == "p1") || (new_idx == this.numSeeds + 1 && turn == "p2")) {
                seeds++;
                continue;
            }
            cells[new_idx].setSeeds(cells[new_idx].getSeeds() + 1);
        }
        
        if (turn == "p1") {
            if (new_idx == this.numCavs + 1) {
                return true;
            } else if (cells[new_idx].getSeeds() == 1 && onPlayerBounds("p1", new_idx, this.numCavs)) {
                cells[this.numCavs + 1].setSeeds(cells[this.numCavs + 1].getSeeds() + cells[correspondentUp(new_idx, this.numCavs)].getSeeds() + 1);
                cells[correspondentUp(new_idx, this.numCavs)].setSeeds(0);
                cells[new_idx].setSeeds(0);
            }
        } else if (turn == "p2") {
            if (new_idx == 0) {
                return true;
            } else if (cells[new_idx].getSeeds() == 1 && onPlayerBounds("p2", new_idx, this.numCavs)) {
                cells[0].setSeeds(cells[0].getSeeds() + cells[correspondentDown(new_idx, this.numCavs)].getSeeds() + 1);
                cells[correspondentDown(new_idx, this.numCavs)].setSeeds(0);
                cells[new_idx].setSeeds(0);
            }
        }
        return false;
    }

    addCellOnClick(fn) {
        let cells = this.board.getCells();
        for (let i = 0; i < cells.length; i++) {
            cells[i].addCellOnClick(fn, i);
        }
    }

    getBoard() {
        return this.board;
    }
}

function getNumSeeds () {
    const seeds = parseInt(document.getElementById("seeds_number").value);
    if (seeds > 0) {
        DEFAULT_SEEDS_NUM = seeds;
    } else {
        alert("You must have at least 1 seed in each cavity");
    }
    load();
}

function getNumCavs() {
    const cavs = parseInt(document.getElementById("cavs_number").value);
    
    if (cavs > 0) { 
        DEFAULT_CAVS_NUM = cavs;
    } else {
        alert("You must have at least 1 cavity");
    }
    load();
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
    

    const gameController = new GameController(DEFAULT_SEEDS_NUM, DEFAULT_CAVS_NUM);

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