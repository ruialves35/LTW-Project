    import("./client.js");

function show(id) {
    let bd = document.getElementById("container");
    let nav = document.getElementById("navbar");
    let element = document.getElementById(id);


    bd.classList.add("disable");
    nav.classList.add("disable");
    element.classList.add(id + "-show");

    let div = document.createElement("div");
    div.id = "blur";
    div.classList.add("blur");
    document.getElementById("body").appendChild(div);
}

function hide(id) {
    let bd = document.getElementById("container");
    let nav = document.getElementById("navbar");
    let element = document.getElementById(id);
    
    let div = document.getElementById("blur");
    div.style.animationName = "bg-rewind";
    div.style.animationPlayState = "running";
    
    bd.classList.remove("disable");
    nav.classList.remove("disable");
    element.classList.remove(id + "-show");
    
    setTimeout(function () { div.parentElement.removeChild(div); }, 400);
}

function sendNotification(notificationTitle, notificationBody) {
    let notifications = document.getElementById('notifications');
    
    if (notifications == null) {
        console.log("Hello");
        notifications = document.createElement('div');
        notifications.id = "notifications";
        document.getElementById("body").appendChild(notifications);
    }

    let notificationCount = notifications.childElementCount;

    let notification = document.createElement('div');
    notification.id = "notification" + notificationCount;
    notification.classList.add("notification");

    let header = document.createElement('span');
    header.classList.add("notification-header");

    let title = document.createElement('h3');
    title.innerHTML = notificationTitle;
    
    let icon = document.createElement('i');
    icon.classList.add("bi", "bi-x-circle");
    icon.onclick = function () {
        notification.classList.add("notification-hide");
        setTimeout(function () {
            notifications.removeChild(notification);
            if (notifications.childElementCount == 0) {
                document.getElementById("body").removeChild(notifications);
            }
        }, 400);
    };

    header.appendChild(title);
    header.appendChild(icon);

    notification.appendChild(header);
    notification.appendChild(document.createTextNode(notificationBody));

    notifications.appendChild(notification);

    setTimeout(function () { notification.classList.add("notification-show"); });
}

function generateInstructions() {
    let instructions = document.createElement('div');
    instructions.id = "instructions"; instructions.classList.add("instructions");
    
    let header = document.createElement('span');
    header.classList.add("form-header");

    let title = document.createElement('h2');
    title.innerHTML = "Regras do Jogo";
    
    let icon = document.createElement('i');
    icon.classList.add("bi", "bi-x-circle");
    icon.onclick = function () { hide("instructions"); setTimeout(function () { document.getElementById("instructions").parentElement.removeChild(instructions); }, 400); };

    header.appendChild(title);
    header.appendChild(icon);

    instructions.appendChild(header);

    let t1 = document.createElement('h3');
    t1.innerHTML = "Objetivo";

    let p1 = document.createElement('p');
    p1.innerHTML = "O objetivo do jogo é coletar o máximo número de sementes. Para tal, cada jogador dispõe de um conjunto de cavidades, nas quais têm sementes em cada uma delas.";

    let t2 = document.createElement('h3');
    t2.innerHTML = "Forma de jogar e Semeadura";

    let p2 = document.createElement('p');
    p2.innerHTML = "De forma a semear, o jogador deve escolher uma cavidade do seu lado do tabuleiro de onde serão recolhidas todas as sementes e semeadas, 1 a 1, nas cavidades seguintes, até o utilizador não ter mais sementes na mão. Esta semeadura é feita no sentido anti-horário e segundo as seguintes condições:";

    let ul = document.createElement('ul');
    let li1 = document.createElement('li');
    li1.innerHTML = "Se a cavidade seguinte for o seu armazém, também deve semear";
    let li2 = document.createElement('li');
    li2.innerHTML = "Sobrando sementes, continuar no lado do adversário";
    let li3 = document.createElement('li');
    li3.innerHTML = "Se atingir o armazém do adversário, não semear";
    let li4 = document.createElement('li');
    li4.innerHTML = "Caso atinja o armazém do adversário e ainda tenha sementes para semear, continuar do seu lado";

    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);
    ul.appendChild(li4);

    let t3 = document.createElement('h3');
    t3.innerHTML = "Ultima semente no Armazem e em Cavidade";

    let p3 = document.createElement('p');
    p3.innerHTML = "Caso a última semente for semeada no seu próprio armazém, o jogador volta a jogar. Por outro lado, se a última semente semeada calhar numa cavidade vazia do próprio jogador, então este deve colher tanto a ultima semente semeada como as sementes na cavidade oposta, ou seja, as sementes na cavidade do adversário, e transferi-las para o seu armazém.";

    let t4 = document.createElement('h3');
    t4.innerHTML = "Fim do jogo";

    let p4 = document.createElement('p');
    p4.innerHTML = "O jogo termina quando um dos jogadores não pode jogar, ou seja, quando não tiver nenhuma semente nas suas cavidades. Quando isto acontece, o outro jogador recolhe todas as sementes das suas cavidades e coloca-as no armazém. Finalmente, ganha o jogador que tiver mais sementes no seu armazém.";

    instructions.appendChild(t1); instructions.appendChild(p1);
    instructions.appendChild(t2); instructions.appendChild(p2); instructions.appendChild(ul);
    instructions.appendChild(t3); instructions.appendChild(p3);
    instructions.appendChild(t4); instructions.appendChild(p4);

    document.getElementById("body").appendChild(instructions);

    setTimeout(function () { show("instructions"); });
}

function generateLogin() {
    let login = document.createElement('div');
    login.id = "login"; login.classList.add("login");
    
    let header = document.createElement('span');
    header.classList.add("form-header");

    let title = document.createElement('h2');
    title.innerHTML = "Login";
    
    let icon = document.createElement('i');
    icon.classList.add("bi", "bi-x-circle");
    icon.onclick = function () { hide("login"); setTimeout(function () { document.getElementById("login").parentElement.removeChild(login); }, 400); };

    header.appendChild(title);
    header.appendChild(icon);

    login.appendChild(header);

    let div = document.createElement('div');
    div.id = "login-div";
    let form = document.createElement('form');
    form.id = "login-form";

    let username_input = document.createElement('input');
    username_input.classList.add("field");
    username_input.name = "username"; username_input.id = "username";
    username_input.type = "text"; username_input.placeholder = "Username";

    let password_input = document.createElement('input');
    password_input.classList.add("field");
    password_input.name = "password"; password_input.id = "password";
    password_input.type = "password"; password_input.placeholder = "Password";

    let button = document.createElement("button");
    button.type = "button"; button.classList.add("button");
    button.onclick = function () { makeRegister(); };
    button.innerHTML = "Login";

    form.appendChild(username_input);
    form.appendChild(password_input);
    form.appendChild(button);

    div.appendChild(form);

    login.appendChild(div);

    document.getElementById("body").appendChild(login);

    setTimeout(function () { show("login"); });
}

function generateConfiguration() {
    let configuration = document.createElement('div');
    configuration.id = "config"; configuration.classList.add("config");
    
    let header = document.createElement('span');
    header.classList.add("form-header");

    let title = document.createElement('h2');
    title.innerHTML = "Configuration";
    
    let icon = document.createElement('i');
    icon.classList.add("bi", "bi-x-circle");
    icon.onclick = function () { hide("config"); setTimeout(function () { document.getElementById("config").parentElement.removeChild(configuration); }, 400); };

    header.appendChild(title);
    header.appendChild(icon);

    configuration.appendChild(header);

    let div = document.createElement('div');
    div.id = "config-div";
    let form = document.createElement('form');
    form.id = "config-form";

    let cavs = document.createElement('input');
    cavs.classList.add('field'); cavs.type = "number";
    cavs.id = "cavs_number"; cavs.name = "cavs_number";
    cavs.placeholder = "Initial cavities number";
    cavs.value = 6; cavs.min = 1; cavs.max = 10;

    let seeds = document.createElement('input');
    seeds.classList.add('field'); seeds.type = "number";
    seeds.id = "seeds_number"; seeds.name = "seeds_number";
    seeds.placeholder = "Initial seeds number per cavity";
    seeds.value = 5; seeds.min = 1; seeds.max = 10;

    let computerDiv = document.createElement('div');
    let computer = document.createElement('input');
    computer.type = "radio";
    computer.id = "Computer"; computer.name = "opponent";
    computer.value = "Computer";

    let computerSpan = document.createElement('span');
    computerSpan.classList.add("opponent-field");
    computerSpan.innerHTML = "Computer";

    computerDiv.appendChild(computer);
    computerDiv.appendChild(computerSpan);

    let playerDiv = document.createElement('div');
    let player = document.createElement('input');
    player.type = "radio";
    player.id = "NormalPlayer"; player.name = "opponent";
    player.value = "player";

    let playerSpan = document.createElement('span');
    playerSpan.classList.add("opponent-field");
    playerSpan.innerHTML = "Player";

    playerDiv.appendChild(player);
    playerDiv.appendChild(playerSpan);

    let onlinePlayerDiv = document.createElement('div');
    let onlinePlayer = document.createElement('input');
    onlinePlayer.type = "radio";
    onlinePlayer.id = "OnlinePlayer"; onlinePlayer.name = "opponent";
    onlinePlayer.value = "OnlinePlayer";

    let onlinePlayerSpan = document.createElement('span');
    onlinePlayerSpan.classList.add("opponent-field");
    onlinePlayerSpan.innerHTML = "Online Player";

    onlinePlayerDiv.appendChild(onlinePlayer);
    onlinePlayerDiv.appendChild(onlinePlayerSpan);

    let ft = document.createElement('p');
    ft.innerHTML = "First Turn:";
    let ftSelect = document.createElement('select');
    ftSelect.id = "first_turn"; ftSelect.name = "first_turn";

    let ftOpt1 = document.createElement('option');
    let ftOpt2 = document.createElement('option');
    
    ftOpt1.innerHTML = "Player";
    ftOpt1.value = "P1";
    ftOpt2.innerHTML = "Opponent";
    ftOpt2.value = "P2";

    ftSelect.appendChild(ftOpt1);
    ftSelect.appendChild(ftOpt2);

    let lvl = document.createElement('p');
    lvl.innerHTML = "Computer Level:";
    let lvlSelect = document.createElement('select');
    lvlSelect.id = "AI_level"; lvlSelect.name = "AI_level";

    let lvlOpt1 = document.createElement('option');
    let lvlOpt2 = document.createElement('option');
    
    lvlOpt1.innerHTML = "Easy";
    lvlOpt1.value = "Easy";
    lvlOpt2.innerHTML = "Hard";
    lvlOpt2.value = "Hard";

    lvlSelect.appendChild(lvlOpt1);
    lvlSelect.appendChild(lvlOpt2);

    let button = document.createElement("button");
    button.type = "button"; button.classList.add("button");
    button.onclick = function () { setNumSeeds(); setNumCavs(); setOpponent(); setAILevel(); load(); hide('config'); };
    button.innerHTML = "Confirm";

    form.appendChild(cavs);
    form.appendChild(seeds);
    form.appendChild(computerDiv);
    form.appendChild(playerDiv);
    form.appendChild(onlinePlayerDiv);
    form.appendChild(ft);
    form.appendChild(ftSelect);
    form.appendChild(lvl);
    form.appendChild(lvlSelect);
    form.appendChild(button);

    div.appendChild(form);

    configuration.appendChild(div);

    document.getElementById("body").appendChild(configuration);

    setTimeout(function () { show("config"); });
}