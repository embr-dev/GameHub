class api_ {
    constructor() {
        this.servers = localStorage.getItem('servers');

        this.get = async (route) => {
            if (route) {
                try {
                    const response = await fetch(`http://rklab:2000${route}?hostname=${window.location.hostname}`, {
                        method: 'GET',
                        mode: 'cors',
                        cache: 'no-cache',
                        credentials: 'same-origin',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        redirect: 'follow',
                        referrerPolicy: 'no-referrer',
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

        this.post = async (route, data, encoded) => {
            if (route && data) {
                try {
                    var response;
                    var data;

                    if (encoded) {
                        if (typeof data == 'object') {
                            const encodingData = await API.encrypt(JSON.stringify(data));

                            response = await fetch(`http://rklab:2000${route}?hostname=${window.location.hostname}`, {
                                method: 'POST',
                                mode: 'cors',
                                cache: 'no-cache',
                                credentials: 'same-origin',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'TokenID': encodingData.id
                                },
                                redirect: 'follow',
                                referrerPolicy: 'no-referrer',
                                body: JSON.stringify({ data: encodingData.data })
                            });
                        } else {
                            const encodingData = await API.encrypt(data);

                            response = await fetch(`http://rklab:2000${route}?hostname=${window.location.hostname}`, {
                                method: 'POST',
                                mode: 'cors',
                                cache: 'no-cache',
                                credentials: 'same-origin',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'TokenID': encodingData.id
                                },
                                redirect: 'follow',
                                referrerPolicy: 'no-referrer',
                                body: JSON.stringify({ data: encodingData.data })
                            });
                        }
                    } else {
                        if (typeof data == 'object') {
                            response = await fetch(`http://rklab:2000${route}?hostname=${window.location.hostname}`, {
                                method: 'POST',
                                mode: 'cors',
                                cache: 'no-cache',
                                credentials: 'same-origin',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                redirect: 'follow',
                                referrerPolicy: 'no-referrer',
                                body: JSON.stringify(data)
                            });
                        } else {
                            response = await fetch(`http://rklab:2000${route}?hostname=${window.location.hostname}`, {
                                method: 'POST',
                                mode: 'cors',
                                cache: 'no-cache',
                                credentials: 'same-origin',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                redirect: 'follow',
                                referrerPolicy: 'no-referrer',
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

        this.decrypt = () => {

        }

        this.encrypt = async (data) => {
            const token = await this.token();

            return {
                data: CryptoJS.AES.encrypt(data, token.token).toString(),
                id: token.id
            };
        }

        this.token = async () => {
            const token = await this.get('/token');
            return token;
        }

        this.uuid = () => {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
        };
    }
}

const API = new api_();

fetch('/auth')
    .then(res => res.text())
    .then(data => {
        API.auth = data;
    })

if (!sessionStorage.getItem('session')) {
    sessionStorage.setItem('session', API.uuid());
}

const session = sessionStorage.getItem('session');