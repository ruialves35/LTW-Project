function sendMessage(text) {
    var msg = document.createElement('div');
    msg.id = "message";
    msg.classList.add("message");

    var header = document.createElement('span');
    header.classList.add("form-header");

    var title = document.createElement('h2');
    title.innerHTML = "Server Message";
    
    var icon = document.createElement('i');
    icon.classList.add("bi", "bi-x-circle");
    icon.onclick = function () { hide("message"); setTimeout(function () { document.getElementById("message").parentElement.removeChild(msg); }, 400); };

    header.appendChild(title);
    header.appendChild(icon);

    msg.appendChild(header);
    msg.appendChild(document.createTextNode(text));

    document.getElementById("body").appendChild(msg);

    setTimeout(function () { show("message"); });
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