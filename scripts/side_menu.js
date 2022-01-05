function side_menu_open () {
    var sm = document.getElementById("side-menu");
    sm.style.left = "80%";
}

function side_menu_close () {
    var sm = document.getElementById("side-menu");
    sm.style.left = "100%";
}

function show(id) {
    var bd = document.getElementById("container");
    var nav = document.getElementById("navbar");
    var element = document.getElementById(id);


    bd.classList.add("disable");
    nav.classList.add("disable");
    element.classList.add(id + "-show");

    var div = document.createElement("div");
    div.id = "blur";
    div.classList.add("blur");
    document.getElementById("body").appendChild(div);
}

function hide(id) {
    var bd = document.getElementById("container");
    var nav = document.getElementById("navbar");
    var element = document.getElementById(id);
    
    var div = document.getElementById("blur");
    div.style.animationName = "bg-rewind";
    div.style.animationPlayState = "running";
    
    bd.classList.remove("disable");
    nav.classList.remove("disable");
    element.classList.remove(id + "-show");
    
    setTimeout(function () { div.parentElement.removeChild(div); }, 400);
}