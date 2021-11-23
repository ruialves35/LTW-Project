var DEFAULT_SEEDS_NUM = 1;
var DEFAULT_CAVS_NUM = 6;

const $ = (selector) => document.querySelector(selector)

function getNumSeeds () {
    DEFAULT_SEEDS_NUM = document.getElementById("seeds_number").value;
    load();
}

function getNumCavs() {
    DEFAULT_CAVS_NUM = document.getElementById("cavs_number").value;
    load();
}

/**
 * Must replace childIdx for the child board_children, then just call it for the respective children
 * 
 */
function createCellContainer(childIdx) {
    const board = document.getElementById("board");
    const board_children = board.children[childIdx];

    const newChild = document.createElement("div");
    newChild.className = "cell-container";

    for (let i = 0; i < DEFAULT_CAVS_NUM; i++) {
        const new_cell = document.createElement("div");
        new_cell.className = "board-cell";

        newChild.appendChild(new_cell);
    }

    board.replaceChild(newChild, board_children);
}

function load () {
    document.getElementById("body").classList.remove("preload");
    const board_children = document.getElementById("board").getElementsByClassName("cell-container");

    createCellContainer(1);
    createCellContainer(3);

    for (var i = 0; i < board_children.length; i++) {
        const cells = board_children[i].children;

        for (var j = 0; j < cells.length; j++) {
            const cell = cells[j];
            for (var k = 0; k < DEFAULT_SEEDS_NUM; k++) {
                const div = document.createElement('div');
                
                const angle = Math.floor(Math.random() * 360)
                const offsetX = Math.floor(Math.random() * 100 - 50)
                const offsetY = Math.floor(Math.random() * 200 - 50)
                const offsetMultiplier = Math.floor(Math.random()*2 - 1);
                div.classList.add("seed");
                div.style.transform = "translateX(" + offsetX + "%) translateY(" + offsetMultiplier*offsetY +"%) rotate(" + angle + "deg)";
                cell.appendChild(div);
            }
        }
    }
};

window.load(load);



