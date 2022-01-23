function wrongArgument(response, key, value) {

    response.writeHead(400, {
        'Content-Type': 'application/json',
    });
    
    let error;

    switch (key) {
        case "nick":
            error = "nick is not a valid string";
            break;
        case "password":
            error = "password is not a valid string";
            break;
        case "size":
            error = "Invalid size: " +  value;
            break;
        case "initial":
            error = "Invalid initial: " + value;
            break;
    }

    response.write(error);

    response.end();
}

module.exports = { wrongArgument };
