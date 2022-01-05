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

    updateCellsContainer(newCells, player) {
        let cells = player == 1 ? this.downCellContainer.getCells() : this.upCellContainer.getCells();
        for (let i = 0, j = 5; i < newCells.length; i++, j--) {
            cells[i].setSeeds(newCells[i]);
        }
    }

    updateStorage(value, player) {
        if (player == 1){
            this.rightStorage.getCell().setSeeds(value);
        } else {
            //player 2
            this.leftStorage.getCell().setSeeds(value);
        }
    }
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

    setPoints(points) {
        this.points = points;
    }

    getElement() { return this.element; }
}

class GameController {
    static DEFAULT_FIRST_PLAYER = "P1";
    static OPPONENT = "NormalPlayer";
    static LEVEL = "Easy";
    static USER;
    static USER2;
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

    setStrategy() {
        const strategy = new Strategy();
        if (GameController.OPPONENT == "NormalPlayer") {
            this.strategy = strategy.playerStrategy();
        } else if (GameController.OPPONENT == "Computer") {    
            this.strategy = (gameController, board, idx) => { 
                gameController.getComputerStrategy()(gameController, board, idx); 
            };
        } else {
            // Online Player
            join(GROUP, GameController.USER.getUsername(), GameController.USER.getPassword(), GameBoard.DEFAULT_CAVS_NUM, GameBoard.DEFAULT_SEEDS_NUM)
            .then((res) => {
                if( res > 0 )
                    this.update();
                else {
                    alert("Could not Join a Game");
                }
            });
            this.strategy = strategy.onlinePlayerStrategy();
        }
    }

    update() {
        const url = server_url + "/update?nick=" + GameController.USER.getUsername() + "&game=" + GameController.GAME ;
        const source = new EventSource(url);
        source.onmessage = this.updateGame;
    }

    updateGame = (event) => {
        const data = JSON.parse(event?.data);
        console.log("Debug data:", data);
        const board = data.board;
        let currentBoard = this.gameBoardController.getBoard();

        if (board) { // all good, received a board

            const oldBoard = this.gameBoardController.board;
            
            // TODO use this to update players scores 
            const oldScore = this.turn == "P1" ? oldBoard.getRightStorage() : oldBoard.getLeftStorage();

            // Use this to update Players Containers red color effect 
            const nextTurn = board.turn == GameController.USER.getUsername() ? "P1" : "P2";
            this.turn = nextTurn;

            for (const [username, boards] of Object.entries(board.sides)) {
                
                const player = username == GameController.USER.getUsername() ? 1 : 2;
                if (GameController.USER2 == null && player == 2)
                    GameController.USER2 = new User(username, null);
                
                for (const [type, value] of Object.entries(boards)) {
                    if (type == "store") {
                        //storageContainer
                        currentBoard.updateStorage(value, player);
                    } else {
                        // cellsContainer
                        
                        const newValue = (player == 2) ? value.reverse() : value;
                        currentBoard.updateCellsContainer(newValue, player)
                    }
                }
            }
        }
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


    build(board) {
        this.player1Container = new PlayerContainer('player1');
        this.player2Container = new PlayerContainer('player2'); // Must change the name after that;
        this.gameBoardController = new GameBoardController(board);

        this.gameBoardController.highlightStorage(this.turn);
        this.gameBoardController.addScores(this.player1Container.name, this.player2Container.name);
        this.gameBoardController.addCellOnClick(this, this.strategy);
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

            let player = this.turn == "P1" ? this.player1Container : this.player2Container;

            let score = this.turn == "P1" ? this.gameBoardController.getRightStorageSeeds() : this.gameBoardController.getLeftStorageSeeds();
            player.setPoints(score);

            this.gameBoardController.updateScore(player.name, player.points);
            
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

    getLeftStorageSeeds() {
        return this.board.getLeftStorage().getCell().getSeeds();
    }

    getRightStorageSeeds() {
        return this.board.getRightStorage().getCell().getSeeds();
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

    addScores(p1, p2) {
        let p1Div = document.createElement('div'); p1Div.classList.add("score-div");
        let p2Div = document.createElement('div'); p2Div.classList.add("score-div");

        p1Div.style.alignSelf = "end";
        p2Div.style.alignSelf = "start";
        
        let p1Name = document.createElement('p');
        let p2Name = document.createElement('p');
        p1Name.id = p1; p1Name.classList.add("score");
        p2Name.id = p2; p2Name.classList.add("score")
        p1Name.innerHTML = p1 + "<br>";
        p2Name.innerHTML = p2 + "<br>";

        let p1Score = document.createElement('p');
        let p2Score = document.createElement('p');
        p1Score.id = p1 + "-score"; p1Score.classList.add("score");
        p2Score.id = p2 + "-score"; p2Score.classList.add("score");

        p1Score.innerHTML = "0 seeds";
        p2Score.innerHTML = "0 seeds";

        p1Div.appendChild(p1Name); p1Div.appendChild(p1Score);
        p2Div.appendChild(p2Name); p2Div.appendChild(p2Score);

        this.board.getRightStorage().getElement().appendChild(p1Div);
        this.board.getLeftStorage().getElement().appendChild(p2Div);
    }

    updateScore(name, score) {
        let scoreP = document.getElementById(name + "-score");

        if (scoreP != null) {
            scoreP.innerHTML = score + " seeds";
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
