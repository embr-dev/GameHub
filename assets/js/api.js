import cookie from '/assets/js/cookie.js';

class api_ {
    constructor() {
        try {
            this.servers = JSON.parse(cookie.get('servers'));
        } catch (e) {
            console.error('Could not get serverlist');
        }
    }

    /**
     * 
     * @returns {Promise.<boolean, Error>}
     */
    validSession = () => {
        return new Promise((resolve, reject) => {
            this.get('/me')
                .then((res) => {
                    if (res.status !== 404) resolve(true);
                    else resolve(false);
                })
                .catch(() => resolve(false));
        });
    };

    /**
     * 
     * @param {string} route 
     * @returns {Promise.<object | string, Error>}
     */
    get = async (route) => {
        if (route) {
            try {
                const response = await fetch(this.servers[0] + route, {
                    credentials: 'include'
                });

                var data;

                try {
                    data = response.json();
                } catch (e) {
                    data = response.text();
                }

                return await data;
            } catch (e) {
                throw new Error('Could not connect to the server');
            }
        } else {
            throw new Error('Missing parameters for API.get');
        }
    };

    /**
     * 
     * @param {string} route 
     * @param {*} data 
     * @param {boolean} encoded 
     * @returns {Promise.<object | string, Error>}
     */
    post = async (route, data, encoded) => {
        if (route && data) {
            try {
                var response;
                var data;

                if (encoded) {
                    if (typeof data == 'object') {
                        const encodingData = await this.encrypt(JSON.stringify(data));

                        response = await fetch(`${this.servers[0]}${route}?hostname=${window.location.hostname}`, {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                                'TokenID': encodingData.id
                            },
                            body: JSON.stringify({ data: encodingData.data })
                        });
                    } else {
                        const encodingData = await this.encrypt(data);

                        response = await fetch(`${this.servers[0]}${route}?hostname=${window.location.hostname}`, {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                                'TokenID': encodingData.id
                            },
                            body: JSON.stringify({ data: encodingData.data })
                        });
                    }
                } else {
                    if (typeof data == 'object') {
                        response = await fetch(`${this.servers[0]}${route}?hostname=${window.location.hostname}`, {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            redirect: 'follow',
                            referrerPolicy: 'no-referrer',
                            body: JSON.stringify(data)
                        });
                    } else {
                        response = await fetch(`${this.servers[0]}${route}?hostname=${window.location.hostname}`, {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: data
                        });
                    }
                }

                try {
                    data = response.json();
                } catch (e) {
                    data = response.text();
                }

                return await data;
            } catch (e) {
                throw new Error('Could not connect to the server');
            }
        } else {
            throw new Error('Missing parameters for API.post');
        }
    };

    encrypt = async (data) => {
        const token = await this.token();

        return {
            data: CryptoJS.AES.encrypt(data, token.token).toString(),
            id: token.id
        };
    };

    token = async () => {
        const token = await this.get('/token');
        return token;
    };

    uuid = () => {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    };
}

const API = new api_();

fetch('/config.json')
    .then(res => res.json())
    .then(config => {
        API.auth = config.auth;

        if (!cookie.get('servers')) {
            if (config.server === 'auto') {
                fetch('https://raw.githubusercontent.com/GameHub88/GameHub-Assets/main/servers.json')
                    .then(res => res.json())
                    .then(servers => {
                        if (servers) {
                            const serverList = [];

                            servers.forEach(server => {
                                fetch(server)
                                    .then(res => res.json())
                                    .then(serverData => {
                                        if (serverData) {
                                            if (serverData.status == 'ready') {
                                                serverList.push(server);
                                            }
                                        }
                                    });
                            });

                            if (serverList.length == 0) {
                                console.error('No available server was found');
                            } else {
                                cookie.set('servers', JSON.stringify(serverList));
                                location.reload();
                            }
                        } else {
                            console.error('Could not fetch server list');
                        }
                    }).catch(e => {
                        console.error('Could not fetch server list');
                    })
            } else {
                fetch(config.server)
                    .then(res => res.json())
                    .then(serverData => {
                        if (serverData) {
                            if (serverData.status == 'ready') {
                                cookie.set('servers', JSON.stringify(new Array(config.server)));
                                location.reload();
                            } else {
                                console.error('Could not connect to default server');
                            }
                        } else {
                            console.error('Could not connect to default server');
                        }
                    }).catch(e => {
                        console.error('Could not connect to default server');
                    })
            }
        }
    })

if (!sessionStorage.getItem('session')) sessionStorage.setItem('session', API.uuid());

const session = sessionStorage.getItem('session');

export default API;