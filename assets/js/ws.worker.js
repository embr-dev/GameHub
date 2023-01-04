let socket = new WebSocket('wss://api.retronetwork.ml');

onmessage = (e) => {
    //if (socket.readyState === 1) {
        const sessionId = e.data.ssid;
        const userId = e.data.suid;

        socket.addEventListener('open', (event) => {
            socket.send(JSON.stringify({
                sessionId: sessionId,
                userId: userId
            }))
        });

        socket.addEventListener('message', (event) => {
            let msg;

            try {
                msg = JSON.parse(event.data);
            } catch (err) {
                console.log('Server sent invalid data type');
            }

            if (msg) {
                if (msg.error === false) {
                    if (msg.targets.includes(sessionId)) {
                        postMessage({
                            type: 'self',
                            data: msg.data
                        });
                    } else if (msg.targets.includes('all')) {
                        postMessage({
                            type: 'brodcast',
                            data: msg.data
                        });
                    }
                } else if (msg.error === true) {
                    postMessage({
                        error: true,
                        errorMsg: msg.errorMsg
                    })

                    console.log(msg.errorMsg);
                }
            }
        });
    /*} else {
        postMessage({
            error: true,
            errorMsg: 'Websocket not avalible'
        })
    }*/
}

setInterval(() => {
    if (socket.readyState === 3) {
        socket = new WebSocket('wss://api.retronetwork.ml');
    }

    console.log(socket.readyState);
}, 1000);