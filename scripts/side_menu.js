function showInstructions() {
    var instructions = document.getElementById("instructions");
    instructions.style.display = "block";
}

function closeInstructions() {
    var instructions = document.getElementById("instructions");
    instructions.style.display = "none";
}

function side_menu_open () {
    var sm = document.getElementById("side-menu");
    sm.style.left = "80%";
}

function side_menu_close () {
    var sm = document.getElementById("side-menu");
    sm.style.left = "100%";
}