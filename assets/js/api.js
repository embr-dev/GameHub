window.onerror = (errorMsg, url, lineNumber) => {
    console.log('Error: ' + errorMsg + '\n\nUrl: ' + url + '\n\nLine:' + lineNumber);
}

class api_ {
    constructor() {
        this.accessible = false;
        this.servers = localStorage.getItem('servers');
        this.get = async function (route) {
            if (this.servers) {
                if (route) {
                    try {
                        const response = await fetch(`${this.servers[0].url}${route}`, {
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
                        //return { error: true, errorMsg: 'Could not connect to the server' };
                        alert(e)
                    }
                } else {
                    return { error: true, errorMsg: 'Missing function parameters' };
                }
            } else {
                return { error: true, errorMsg: 'Waiting for the serverlist to be created' };
            }
        }
        this.post = async function (route, sendData) {
            if (this.servers) {
                if (route && sendData) {
                    try {
                        var response;
                        var data;

                        if (typeof sendData == 'object') {
                            response = await fetch(`${this.servers[0].url}${route}`, {
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
                            response = await fetch(`${this.servers[0]}${route}`, {
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
                        //return { error: true, errorMsg: 'Could not connect to the server' };
                        alert(e);
                    }
                } else {
                    return { error: true, errorMsg: 'Missing function parameters' };
                    throw 'Missing parameters for API.post';
                }
            } else {
                return { error: true, errorMsg: 'Waiting for the serverlist to be created' };
            }
        }
        this.getToken = () => {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
        }
        this.socket_ = class socket_ {
            constructor() {
                this.socketBase = new WebSocket('wss://api.retronetwork.ml');
                this.send = (data) => {
                    if (api_.accessible === true) {
                        const reqToken = API.getToken();

                        API.socket.socketBase.send(JSON.stringify({
                            reqToken: reqToken,
                            data: data
                        }));

                        return { error: false, requestToken: reqToken };
                    } else {
                        return { error: true, errorMsg: 'Could not connect to websocket.' }
                    }
                }
                this.worker = new Worker('/assets/js/ws.worker.js')
            }
        }
        //this.socket = new this.socket_();
    }
}

const API = new api_();

sessionStorage.setItem('session', API.getToken());

if (!API.servers) {
    setInterval(() => {
        if (localStorage.getItem('servers')) {
            location.reload();
        }
    }, 1000);
}

/*API.socket.worker.postMessage({
    error: false,
    ssid: sessionStorage.getItem('session'),
    suid: localStorage.getItem('userId')
});


API.socket.worker.onmessage = (e) => {
    const res = e.data;

    if (res.target === 'self') {
        alert(res.data);
    } else {
        console.log(JSON.stringify(res));
    }
}

//Server reconnection
setInterval(() => {
    if (API.socket.socketBase.readyState === 3) {
        if (window.location.protocol === 'https:') {
            API.socket.socketBase = new WebSocket('wss://api.retronetwork.ml');
        } else {
            alert('Protocol not supported.');
        }

        api_.accessible = false;
        API.accessible = false;

        return false;
    } else {
        api_.accessible = true;
        API.accessible = true;

        return true;
    }
}, 1000)*/
