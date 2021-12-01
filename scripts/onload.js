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
    #numSeeds;
    #element;

    constructor(numSeeds) {
        this.numSeeds = numSeeds;
        this.build();
    }

    setNumSeeds(numSeeds) {
        this.numSeeds = numSeeds;
    } 

    build() {
        this.element = document.createElement("div");
        this.element.className = "board-cell";

        for (let i = 0; i < DEFAULT_SEEDS_NUM; i++) {
            const seed = new Seed();
            this.element.appendChild(seed.element);
        }
    }

    getElement() { return this.element; }
}

class StorageContainer {
    #seeds;
    #element;
    #storage_cell;

    constructor() {
        this.seeds = 0;
        this.build();
    }

    build() {
        this.element = document.createElement("div");
        this.element.className = "storage-container";

        this.storage_cell = document.createElement("div");
        this.storage_cell.className = "storage-cell";
        this.element.appendChild(this.storage_cell);
    }

    getElement() { return this.element; }
}

class CellContainer {
    #element;
    #numCavs;

    constructor(numCavs, childIdx) {
        this.numCavs = numCavs;
        this.build();
    }

    setNumCavs(numCavs) {
        this.numCavs = numCavs;
    }

    build() {
        this.element = document.createElement("div");
        this.element.className = "cell-container";

        for (let i = 0; i < DEFAULT_CAVS_NUM; i++) {
            const new_cell = new Cell(DEFAULT_SEEDS_NUM);

            this.element.appendChild(new_cell.getElement());
        }
    }

    getElement() { return this.element; }
}

class GameBoard {
    #numSeeds;
    #numCavs;
    #element;
    #leftStorage;
    #rightStorage;
    #upCellContainer;
    #downCellContainer;

    constructor(numSeeds, numCavs) {
        this.numSeeds = numSeeds;
        this.numCavs = numCavs;

        this.build();
    } 

    build() {
        this.leftStorage = new StorageContainer();
        this.leftStorage.id = "left-storage";

        this.rightStorage = new StorageContainer();
        this.upCellContainer = new CellContainer(DEFAULT_CAVS_NUM);
        this.downCellContainer = new CellContainer(DEFAULT_CAVS_NUM);

        this.element = document.createElement("section");
        this.element.id = "board";

        this.element.appendChild(this.leftStorage.getElement());
        this.element.appendChild(this.upCellContainer.getElement()); 
        this.element.appendChild(this.rightStorage.getElement());
        this.element.appendChild(this.downCellContainer.getElement());
    }

    getElement() { return this.element; }
}

function getNumSeeds () {
    DEFAULT_SEEDS_NUM = document.getElementById("seeds_number").value;
    load();
}

function getNumCavs() {
    DEFAULT_CAVS_NUM = document.getElementById("cavs_number").value;
    console.log(DEFAULT_CAVS_NUM);
    load();
}


function load () {
    document.getElementById("body").classList.remove("preload");
    const game_container = document.getElementById("game-container");

    game_board = new GameBoard(DEFAULT_SEEDS_NUM, DEFAULT_CAVS_NUM);
    if(game_container.hasChildNodes()) {
        game_container.replaceChild(game_board.getElement(), game_container.children[0]); //just has 1
    } else {
        game_container.appendChild(game_board);
    }
};

window.load(load);



