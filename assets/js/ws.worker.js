onmessage = (e) => {
    const socket = new WebSocket('wss://api.retronetwork.ml');
    const sessionId = e.data.ssid;
    const userId = e.data.suid;

    socket.addEventListener('open', (event) => {
        API.get(`/users/${userId}`, 'json')
            .then(data => {
                socket.send(JSON.stringify({
                    sessionId: sessionId,
                    username: data.username
                }))
            });
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
}