import mime from 'mime';

import http from 'node:http';
import path from 'node:path';
import url from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const server = http.createServer();
const packageFile = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')));
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'))).serverConfig;

const pathToFile = (url = '', folderPath) => {
    if (url.endsWith('/')) url = url + 'index.html';
    else if (url.split(/[#?]/)[0].split('.').pop().trim() === url) {
        if (!fs.existsSync(path.join(folderPath, url))) url = url + '.html';
    }

    return {
        exists: fs.existsSync(path.join(folderPath, url)),
        path: path.join(folderPath, url)
    };
};

server.on('request', (req, res) => {
    req.path = new URL('http://localhost' + req.url).pathname;
    var ignoredPath;

    config.ignoredPaths.forEach(path => {
        if (path.endsWith('/*') && req.path.startsWith(path.slice(-2))) ignoredPath = true;
    });

    if (req.path === '/config.json') {
        const rewrittenConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json')));
        rewrittenConfig.serverConfig = undefined;

        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify(rewrittenConfig));
    } else if (config.ignoredPaths.includes(req.path) || ignoredPath) {
        res.statusCode = 404;
        res.setHeader('content-type', 'text/html');
        res.end(fs.readFileSync(path.join(__dirname, '../', '404.html')));
    } else {
        const file = pathToFile(req.path, path.join(__dirname, '../'));

        if (file.exists) {
            res.setHeader('content-type', mime.getType(file.path));
            res.end(fs.readFileSync(file.path));
        } else {
            res.statusCode = 404;
            res.setHeader('content-type', 'text/html');
            res.end(fs.readFileSync(path.join(__dirname, '../', '404.html')));
        }
    }
});

server.listen(config.port || process.env.PORT || 8080, () => console.log(`GameHub server running\n\nPort: ${server.address().port}\nVersion: ${packageFile.version}`));