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

        for (let i = 0; i < this.numSeeds; i++) {
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

        for (let i = 0; i < this.numCavs; i++) {
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
        this.upCellContainer = new CellContainer(this.numCavs);
        this.downCellContainer = new CellContainer(this.numCavs);

        this.element = document.createElement("section");
        this.element.id = "board";

        this.element.appendChild(this.leftStorage.getElement());
        this.element.appendChild(this.upCellContainer.getElement()); 
        this.element.appendChild(this.rightStorage.getElement());
        this.element.appendChild(this.downCellContainer.getElement());
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

    constructor(numSeeds, numCavs) {
        this.numCavs = numCavs;
        this.numSeeds = numSeeds;
        this.build();
    }

    build() {
        this.element = document.createElement("div");
        this.element.id = "game-container";
        this.game_board = new GameBoard(this.numSeeds, this.numCavs);
        this.element.appendChild(this.game_board.getElement());
    }

    getElement() { return this.element; }
}

class Game {
    #player1Container;
    #player2Container; //can be pc
    #gameContainer;
    #numSeeds;
    #numCavs;

    constructor(num_seeds, num_cavs) {
        this.numCavs = num_cavs;
        this.numSeeds = num_seeds;
        this.build();
    }

    build() {
        this.player1Container = new PlayerContainer('player1');
        this.gameContainer = new GameContainer(this.numSeeds, this.numCavs);
        this.player2Container = new PlayerContainer('computer');
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



