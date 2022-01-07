const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.method == "POST") {
        if (req.url === "/join") {

        } else if (req.url === "/leave") {

        } else if (req.rul === "notify") {

        } else if (req.url === "/ranking") {

        } else if (req.url === "/register") {
            
        }
    } else if (req.method == "GET") {
        if (req.url === "/") {
            res.writeHead(200, {
                'Content-Type': 'text/html',
            });
            fs.readFile('./static/index.html', null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write('Whoops! File not found!');
                } else {
                    res.write(data);
                }
                res.end();
            });
        } else if (req.url === "/update") {

        } else {
            fs.readFile("./static/" + req.url, null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write('Whoops! File not found!');
                } else {
                    res.write(data);
                }
                res.end();
            });
        }
    }
});

server.listen(5000);