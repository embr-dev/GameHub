class api_ {
    constructor() {
        this.servers = localStorage.getItem('servers');

        this.get = async (route) => {
            if (route) {
                try {
                    const response = await fetch(`http://10.82.7.62:2000${route}?hostname=${window.location.hostname}`, {
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

                    if (typeof data == 'object') {
                        try {
                            if (data.error === true) {
                                return { error: true, errorMsg: `The server sent the error: ${data.errorMsg}` };
                            } else {
                                return data;
                            }
                        } catch (e) {
                            return data;
                        }
                    } else {
                        return data;
                    }
                } catch (e) {
                    return { error: true, errorMsg: 'Could not connect to the server' };
                }
            } else {
                return { error: true, errorMsg: 'Missing function parameters' };
            }
        };

        this.post = async (route, sendData) => {
            if (route && sendData) {
                try {
                    var response;
                    var data;

                    if (typeof sendData == 'object') {
                        response = await fetch(`http://10.82.7.62:2000${route}?hostname=${window.location.hostname}`, {
                            method: 'POST',
                            mode: 'cors',
                            cache: 'no-cache',
                            credentials: 'same-origin',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            redirect: 'follow',
                            referrerPolicy: 'no-referrer',
                            body: JSON.stringify(sendData)
                        });
                    } else {
                        response = await fetch(`http://10.82.7.62:2000${route}?hostname=${window.location.hostname}`, {
                            method: 'POST',
                            mode: 'cors',
                            cache: 'no-cache',
                            credentials: 'same-origin',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            redirect: 'follow',
                            referrerPolicy: 'no-referrer',
                            body: sendData
                        });
                    }

                    try {
                        data = response.json();
                    } catch (e) {
                        data = response.text();
                    }

                    return await data;
                } catch (e) {
                    return { error: true, errorMsg: 'Could not connect to the server' };
                }
            } else {
                throw new Error('Missing parameters for API.post');
            }
        };

        this.getToken = () => {
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
    sessionStorage.setItem('session', API.getToken());
}

const session = sessionStorage.getItem('session');