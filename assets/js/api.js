class api_ {
    constructor() {
        this.accessible = false
        this.get = async function (route = '', resType) {
            if (route && resType) {
                const response = await fetch('https://api..ghretronetwork.ml' + route, {
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

                if (resType == 'json') {
                    return response.json();
                } else if (resType == 'text') {
                    return response.text();
                } else {
                    return 'invalid response type.';
                }
            }
        }
        this.post = async function (route = '', data = {}, resType) {
            if (route && data && resType) {
                const response = await fetch('https://api..ghretronetwork.ml' + route, {
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

                if (resType == 'json') {
                    return response.json();
                } else if (resType == 'text') {
                    return response.text();
                } else {
                    return 'invalid response type';
                }
            } else {
                return 'invalid parameters';
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


/*API.socket.worker.postMessage({
    error: false,
    ssid: sessionStorage.getItem('session'),
    suid: localStorage.getItem('userId')
});*/


/*API.socket.worker.onmessage = (e) => {
    const res = e.data;

    if (res.target === 'self') {
        alert(res.data);
    } else {
        console.log(JSON.stringify(res));
    }
}*/

//Server reconnection
/*setInterval(() => {
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