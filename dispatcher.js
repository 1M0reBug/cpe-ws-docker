const http = require('http');
const dns = require('dns');

function resolve(hostname) {
    return new Promise((resolve, reject) => {
        dns.resolve(hostname, (err, ips) => {
            if (err) {
                reject(err);
            } else {
                resolve(ips);
            }
        })
    });
}

function getRand(min, max) {
    if (!max) {
        max = min;
        min = 0;
    }

    return Math.floor(
        Math.random() * (max - min) + min
    );
}

function handleError(res, err) {

    res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: err.message || 'Server-side error', 
                             status: err.status || 500 }));
}

const server = http.createServer((req, res) => {
    let word = [];
    let ip = '';
    const url = req.url.slice(req.url.indexOf('/', 1));
    if (word = /^\/(localhost|adjectives|nouns|verbs)/.exec(req.url)) {
        resolve(word[1])
        .then(ips => {
            ip = ips[getRand(ips.length)];

            const opts = {
                hostname: ip,
                path: url,
                port: 3000,
                method: req.method,
                header: req.headers,
            };

            const proxy_request = http.request(opts, (proxy_response) => {
                proxy_response.on('data', chunk => res.write(chunk, 'binary') );
                proxy_response.on('end', () => res.end() );
                res.writeHead(proxy_response.statusCode, proxy_response.headers);
            });

            req.on('data', chunk => proxy_request.write(chunk, 'binary'));
            req.on('end', () => proxy_request.end());
        })
        .catch(err => { err.status = 500; handleError(res, err) });
    } else {
        const err = new Error('Not found');
        err.status = 404;
        handleError(res, err);
    }
});
server.listen(8000);

console.log(`listening on 0.0.0.0:8000`);