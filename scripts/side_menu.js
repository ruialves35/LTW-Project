function side_menu_open () {
    var sm = document.getElementById("side-menu");
    sm.style.left = "80%";
}

function side_menu_close () {
    var sm = document.getElementById("side-menu");
    sm.style.left = "100%";
}

function show_login_form() {
    var bd = document.getElementById("container");
    var nav = document.getElementById("navbar");
    var login = document.getElementById("login");


    bd.classList.add("disable");
    nav.classList.add("disable");
    login.classList.add("login-show");

    var div = document.createElement("div");
    div.id = "blur";
    div.classList.add("blur");
    document.getElementById("body").appendChild(div);
}

function show_config_form() {
    var bd = document.getElementById("container");
    var nav = document.getElementById("navbar");
    var config = document.getElementById("config");
    
    
    bd.classList.add("disable");
    nav.classList.add("disable");
    config.classList.add("config-show");

    var div = document.createElement("div");
    div.id = "blur";
    div.classList.add("blur");
    document.getElementById("body").appendChild(div);
}

function hide_login_form() {
    var bd = document.getElementById("container");
    var nav = document.getElementById("navbar");
    var login = document.getElementById("login");
    
    var div = document.getElementById("blur");
    div.style.animationName = "bg-rewind";
    div.style.animationPlayState = "running";
    
    bd.classList.remove("disable");
    nav.classList.remove("disable");
    login.classList.remove("login-show");
    
    setTimeout(function () { div.parentElement.removeChild(div); }, 400);
}

function hide_config_form() {
    var bd = document.getElementById("container");
    var nav = document.getElementById("navbar");
    var config = document.getElementById("config");

    var div = document.getElementById("blur");
    div.style.animationName = "bg-rewind";
    div.style.animationPlayState = "running";

    bd.classList.remove("disable");
    nav.classList.remove("disable");
    config.classList.remove("config-show");
    
    setTimeout(function () { div.parentElement.removeChild(div); }, 400);
}
