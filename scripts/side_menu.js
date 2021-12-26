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

    bd.classList.add("blur");
    nav.classList.add("blur");
    login.classList.add("login-show");
}

function show_config_form() {
    var bd = document.getElementById("container");
    var nav = document.getElementById("navbar");
    var config = document.getElementById("config");

    bd.classList.add("blur");
    nav.classList.add("blur");
    config.classList.add("config-show");
}

function hide_login_form() {
    var bd = document.getElementById("container");
    var nav = document.getElementById("navbar");
    var login = document.getElementById("login");

    bd.classList.remove("blur");
    nav.classList.remove("blur");
    login.classList.remove("login-show");
}

function hide_config_form() {
    var bd = document.getElementById("container");
    var nav = document.getElementById("navbar");
    var config = document.getElementById("config");

    bd.classList.remove("blur");
    nav.classList.remove("blur");
    config.classList.remove("config-show");
}