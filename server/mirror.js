import childProcess from 'node:child_process';
import EventEmitter from 'node:events';
import path from 'node:path';
import url from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

class Mirror extends EventEmitter {
    constructor(config, packageFile, server) {
        super();

        this.server = server;
        this.config = config;
        this.packageFile = packageFile;
        this.mapPath = this.config.map.split('/').slice(0, this.config.map.split('/').length - 1).join('/') + '/';

        this.init()
            .then(() => this.emit('ready'))
            .catch(e => this.emit('error', e));
    }

    init = () => {
        return new Promise(async (resolve, reject) => {
            this.commits = await (await fetch(`https://api.github.com/repos/${this.config.repo.owner}/${this.config.repo.name}/commits`)).json();
            this.package = await (await fetch(this.config.package)).json();
            this.map = await (await fetch(this.config.map)).json();

            this.latestCommit = this.commits[0];

            if (!this.latestCommit) console.warn('[Warn] Failed to get latest commit data. Mirror server may be out of date.');

            await this.install();
            if (this.latestCommit) await this.cloneFiles();
            else this.latestCommit = {
                sha: JSON.parse(fs.readFileSync(path.join(__dirname, 'mirror/update.json'))).commit.sha,
                commit: {
                    message: JSON.parse(fs.readFileSync(path.join(__dirname, 'mirror/update.json'))).commit.message
                }
            };
            this.mirrorServer = (await import('./mirror/index.js')).default.attachToServer(this.server);

            resolve();
        });
    }

    install = () => {
        return new Promise((resolve, reject) => {
            const packages = [];

            Object.keys(this.package.dependencies).forEach(key => {
                if (!Object.keys(this.packageFile.dependencies).includes(key)) packages.push(key);
            });

            if (packages.length > 0) {
                const installer = childProcess.exec('npm install ' + packages.join(' '));

                installer.on('close', () => resolve());
            } else resolve();
        });
    }

    cloneFiles = () => {
        return new Promise(async (resolve, reject) => {
            if (!fs.existsSync(path.join(__dirname, 'mirror/'))) await fs.promises.mkdir(path.join(__dirname, 'mirror/'));

            if (!fs.existsSync(path.join(__dirname, 'mirror/update.json'))) {
                this.map.forEach(async file => {
                    if (file.includes('/')) await fs.promises.mkdir(path.join(__dirname, '/mirror/', file.split('/').slice(0, file.split('/').length - 1).join('/')), {
                        recursive: true
                    });

                    await fs.promises.writeFile(path.join(__dirname, '/mirror/', file), Buffer.from(await (await fetch(this.mapPath + file)).arrayBuffer()));
                });

                await fs.promises.writeFile(path.join(__dirname, 'mirror/update.json'), JSON.stringify({
                    commit: {
                        sha: this.latestCommit.sha,
                        message: this.latestCommit.commit.message
                    },
                    version: this.package.version,
                    updated: new Date().toISOString(),
                    package: this.package
                }));

                resolve();
            } else {
                const updateFile = JSON.parse(fs.readFileSync(path.join(__dirname, 'mirror/update.json')));
                const fileMap = [];

                fs.readdirSync(path.join(__dirname, 'mirror/'), {
                    recursive: true
                }).forEach(file => {
                    if (fs.lstatSync(path.join(__dirname, 'mirror/', file)).isFile()) fileMap.push(file);
                });

                if (this.latestCommit.sha !== updateFile.commit.sha || this.package.version !== updateFile.version || fileMap !== this.map) {
                    this.map.forEach(async file => {
                        if (file.includes('/')) fs.promises.mkdir(path.join(__dirname, '/mirror/', file.split('/').slice(0, file.split('/').length - 1).join('/')), {
                            recursive: true
                        });

                        await fs.promises.writeFile(path.join(__dirname, '/mirror/', file), Buffer.from(await (await fetch(this.mapPath + file)).arrayBuffer()));
                    });

                    await fs.promises.writeFile(path.join(__dirname, 'mirror/update.json'), JSON.stringify({
                        commit: {
                            sha: this.latestCommit.sha,
                            message: this.latestCommit.commit.message
                        },
                        version: this.package.version,
                        updated: new Date().toISOString(),
                        package: this.package
                    }));

                    resolve();
                } else resolve();
            }
        });
    }
}

export default Mirror;