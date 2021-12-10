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

    constructor(seeds, id) {
        this.seeds = seeds;
        this.id = id;
        this.build();
    }

    setSeeds(seeds) {
        this.seeds = seeds;
        this.update();
    }

    getSeeds() {
        return this.seeds;
    }

    build() {
        this.element = document.createElement("div");
        this.element.className = "board-cell";
        this.element.id = this.id;

        for (let i = 0; i < this.seeds; i++) {
            const seed = new Seed();
            this.element.appendChild(seed.getElement());
        }
    }

    update() {
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }

        for (let i = 0; i < this.seeds; i++) {
            const seed = new Seed();
            this.element.appendChild(seed.getElement());
        }
    }

    addCellOnClick(game) {
        this.element.onclick = function () { game.sow_at(parseInt(this.id)); };
    }

    getElement() { return this.element; }
}

class StorageCell {
    #seeds;
    #element;
    #id;

    constructor (id) {
        this.seeds = 0;
        this.id = id;
        this.build();
    }

    setSeeds(seeds) {
        this.seeds = seeds;
        this.update();
    }

    getSeeds() {
        return this.seeds;
    }

    build() {
        this.element = document.createElement("div");
        this.element.className = "storage-cell";
        this.element.id = this.id;
    }

    update() {
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }

        for (let i = 0; i < this.seeds; i++) {
            const seed = new Seed();
            this.element.appendChild(seed.getElement());
        }
    }

    addCellOnClick(game) {
        this.element.onclick = function () { game.sow_at(parseInt(this.id)); };
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
        
        this.storageCell = new StorageCell(this.id);
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
            const new_cell = new Cell(DEFAULT_SEEDS_NUM, id.toString());
            
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
        
        var downCells = this.downCellContainer.getCells();
        for (var i = 0; i < downCells.length; i++) {
            this.cells.push(downCells[i]);
        }
        
        this.cells.push(this.rightStorage.getCell());
        
        var upCells = this.upCellContainer.getCells();
        for (var i = upCells.length - 1; i >= 0; i--) {
            this.cells.push(upCells[i]);
        }

        this.element = document.createElement("section");
        this.element.id = "board";

        this.element.appendChild(this.leftStorage.getElement());
        this.element.appendChild(this.upCellContainer.getElement()); 
        this.element.appendChild(this.rightStorage.getElement());
        this.element.appendChild(this.downCellContainer.getElement());
    }

    sow_at (idx, turn) {

        let seeds = this.cells[idx].getSeeds();
        this.cells[idx].setSeeds(0);

        let new_idx = 0;
        for (var i = 1; i <= seeds; i++) {
            new_idx = (idx + i) % (this.numCavs * 2 + 2);
            this.cells[new_idx].setSeeds(this.cells[new_idx].getSeeds() + 1);
        }
        
        if (turn == "p1") {
            if (new_idx == 7) {
                return true;
            } else if (this.cells[new_idx].getSeeds() == 1 && onPlayerBounds("p1", idx, this.numCavs)) {
                this.cells[7].setSeeds(this.cells[7].getSeeds() + this.cells[this.numCavs * 2 + 2 - new_idx].getSeeds());
                this.cells[this.numCavs * 2 + 2 - new_idx].setSeeds(0);
            }
        } else if (turn == "p2") {
            if (new_idx == 0) {
                return true;
            } else if (this.cells[new_idx].getSeeds() == 1 && onPlayerBounds("p2", idx, this.numCavs)) {
                this.cells[0].setSeeds(this.cells[0].getSeeds() + this.cells[new_idx % 7].getSeeds());
                this.cells[new_idx % 7].setSeeds(0);
            }
        }
        return false;
    }

    addCellOnClick(game) {
        for (var i = 0; i < this.cells.length; i++) {
            this.cells[i].addCellOnClick(game);
        }
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
        this.element.style.content = "ola";
        const title = document.createElement("h2");
        title.innerHTML = this.name;
        this.element.appendChild(title);
        console.log(title);
    }

    getElement() { return this.element; }
}

class GameContainer {
    #numSeeds;
    #numCavs;
    #element;
    #game_board;

    constructor(numSeeds, numCavs, game) {
        this.numCavs = numCavs;
        this.numSeeds = numSeeds;
        this.build(game);
    }

    build(game) {
        this.element = document.createElement("div");
        this.element.id = "game-container";
        this.game_board = new GameBoard(this.numSeeds, this.numCavs);
        this.game_board.addCellOnClick(game);
        this.element.appendChild(this.game_board.getElement());
    }

    getElement() { return this.element; }

    getBoard() { return this.game_board; }
}

class Game {
    #player1Container;
    #player2Container; //can be pc
    #gameContainer;
    #numCavs;
    #turn;

    constructor(num_seeds, num_cavs) {
        this.numCavs = num_cavs;
        this.numSeeds = num_seeds;
        this.turn = "p1";
        this.build();
    }

    build() {
        this.player1Container = new PlayerContainer('player1');
        this.gameContainer = new GameContainer(this.numSeeds, this.numCavs, this);
        this.player2Container = new PlayerContainer('computer'); // it's hard coded yet
    }

    getPlayer1Container() {
        return this.player1Container;
    }

    getPlayer2Container() {
        return this.player2Container;
    }

    getGameContainer() {
        return this.gameContainer;
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

function getNumSeeds () {
    const seeds = document.getElementById("seeds_number").value;
    if (seeds > 0) {
        DEFAULT_SEEDS_NUM = seeds;
    } else {
        alert("You must have at least 1 seed in each cavity");
    }
    load();
}

function getNumCavs() {
    const cavs = document.getElementById("cavs_number").value;
    
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
    

    const game = new Game(DEFAULT_SEEDS_NUM, DEFAULT_CAVS_NUM);

    if(container.hasChildNodes()) {
        container.replaceChild(game.getPlayer1Container().getElement(), container.children[0]); 
        container.replaceChild(game.getGameContainer().getElement(), container.children[1]);
        container.replaceChild(game.getPlayer2Container().getElement(), container.children[2]);
    } else {
        container.appendChild(game.getPlayer1Container().getElement());
        container.appendChild(game.getGameContainer().getElement());
        container.appendChild(game.getPlayer2Container().getElement());
    }
};

window.load(load);



