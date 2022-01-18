const http = require('http');
const fs = require('fs');
const ranking = require('./ranking');
const register = require('./register');
const join = require('./join');

const server = http.createServer(async (req, res) => {

    if (req.method == "POST") {
        if (req.url === "/join") {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                let obj = JSON.parse(data);
                join.process(res, obj.nick, obj.password, obj.size, obj.initial);
            })
        } else if (req.url === "/leave") {

        } else if (req.rul === "notify") {
            
        } else if (req.url === "/ranking") {
            ranking.get(res);
        } else if (req.url === "/register") {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                let obj = JSON.parse(data);
                register.process(res, obj.nick, obj.password);
            });
        } else {
            res.writeHead(404);
            res.write('Pedido Desconhecido!');
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