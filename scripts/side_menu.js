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

function generate_instructions() {
    let instructions = document.createElement('div');
    instructions.id = "instructions"; instructions.classList.add("instructions");
    
    var header = document.createElement('span');
    header.classList.add("form-header");

    var title = document.createElement('h2');
    title.innerHTML = "Regras do Jogo";
    
    var icon = document.createElement('i');
    icon.classList.add("bi", "bi-x-circle");
    icon.onclick = function () { hide("instructions"); setTimeout(function () { document.getElementById("instructions").parentElement.removeChild(instructions); }, 400); };

    header.appendChild(title);
    header.appendChild(icon);

    instructions.appendChild(header);

    var t1 = document.createElement('h3');
    t1.innerHTML = "Objetivo";

    var p1 = document.createElement('p');
    p1.innerHTML = "O objetivo do jogo é coletar o máximo número de sementes. Para tal, cada jogador dispõe de um conjunto de cavidades, nas quais têm sementes em cada uma delas.";

    var t2 = document.createElement('h3');
    t2.innerHTML = "Forma de jogar e Semeadura";

    var p2 = document.createElement('p');
    p2.innerHTML = "De forma a semear, o jogador deve escolher uma cavidade do seu lado do tabuleiro de onde serão recolhidas todas as sementes e semeadas, 1 a 1, nas cavidades seguintes, até o utilizador não ter mais sementes na mão. Esta semeadura é feita no sentido anti-horário e segundo as seguintes condições:";

    var ul = document.createElement('ul');
    var li1 = document.createElement('li');
    li1.innerHTML = "Se a cavidade seguinte for o seu armazém, também deve semear";
    var li2 = document.createElement('li');
    li2.innerHTML = "Sobrando sementes, continuar no lado do adversário";
    var li3 = document.createElement('li');
    li3.innerHTML = "Se atingir o armazém do adversário, não semear";
    var li4 = document.createElement('li');
    li4.innerHTML = "Caso atinja o armazém do adversário e ainda tenha sementes para semear, continuar do seu lado";

    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);
    ul.appendChild(li4);

    var t3 = document.createElement('h3');
    t3.innerHTML = "Ultima semente no Armazem e em Cavidade";

    var p3 = document.createElement('p');
    p3.innerHTML = "Caso a última semente for semeada no seu próprio armazém, o jogador volta a jogar. Por outro lado, se a última semente semeada calhar numa cavidade vazia do próprio jogador, então este deve colher tanto a ultima semente semeada como as sementes na cavidade oposta, ou seja, as sementes na cavidade do adversário, e transferi-las para o seu armazém.";

    var t4 = document.createElement('h3');
    t4.innerHTML = "Fim do jogo";

    var p4 = document.createElement('p');
    p4.innerHTML = "O jogo termina quando um dos jogadores não pode jogar, ou seja, quando não tiver nenhuma semente nas suas cavidades. Quando isto acontece, o outro jogador recolhe todas as sementes das suas cavidades e coloca-as no armazém. Finalmente, ganha o jogador que tiver mais sementes no seu armazém.";

    instructions.appendChild(t1); instructions.appendChild(p1);
    instructions.appendChild(t2); instructions.appendChild(p2); instructions.appendChild(ul);
    instructions.appendChild(t3); instructions.appendChild(p3);
    instructions.appendChild(t4); instructions.appendChild(p4);

    document.getElementById("body").appendChild(instructions);

    setTimeout(function () { show("instructions"); });
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