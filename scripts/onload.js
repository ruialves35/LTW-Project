var DEFAULT_SEEDS_NUM = 6;
var DEFAULT_CAVS_NUM = 6;

function load () {
    document.getElementById("body").classList.remove("preload");
    var board_children = document.getElementById("board").getElementsByClassName("cell-container");
    
    for (var i = 0; i < board_children.length; i++) {
        var cells = board_children[i].children;

        for (var j = 0; j < cells.length; j++) {
            var cell = cells[j];
            for (var k = 0; k < DEFAULT_SEEDS_NUM; k++) {
                var div = document.createElement('div');
                
                var angle = Math.floor(Math.random() * 360);
                var offset = Math.floor(Math.random() * 100 - 50);
                div.classList.add("seed");
                div.style.transform = "translateX(" + offset + "%) rotate(" + angle + "deg)";
                cell.appendChild(div);
            }
        }
    }
};

window.load(load);