const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            console.log(body);
        });


        let json = JSON.stringify({
            data: 'Success',
        });
        res.end(json);
    }
});

server.listen(5000);