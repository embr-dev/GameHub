const form = document.querySelector('#signup');
const username = document.querySelector('#username');
const pswrd = document.querySelector('#pswrd');
const email = document.querySelector('#email');
var avatar;

function newAvatar() {
    const word = username.value;
    let peer;
    peer = new Peer();
    peer.on("open", (id) => {
        var ifr = document.createElement("iframe");
        ifr.src = `https://russell2259.github.io/barbackend/Avatar?token=${id}&word=${word}`;
        ifr.style = "width: 0px; height: 0px;";
        ifr.frameBorder = 'none'
        ifr.id = 'ifr'
        document.body.appendChild(ifr);
    });
    peer.on('connection', (conn) => connection(conn, 'avatar'));
}
function connection(conn, parent) {
    const decrypt = (salt, encoded) => {
        const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
        const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
        return encoded
            .match(/.{1,2}/g)
            .map((hex) => parseInt(hex, 16))
            .map(applySaltToChar)
            .map((charCode) => String.fromCharCode(charCode))
            .join("");
    };
    conn.on("open", () => {
        conn.on('data', (data) => {
            if (parent === 'avatar') {
                const message = decrypt('avatar', data)
                avatar = message;
            }
        });
    });
}

function displayErr(err, elid) {
    document.querySelector('.form').classList.remove('hidden')
    document.querySelector('.Loader').classList.add('hidden')
    document.getElementById(elid).innerText = err
}

function clearErrs() {
    const err = document.querySelectorAll('.err');
    for (let i = 0; i < err.length; i++) {
        err[i].innerText = '';
    }
}

window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    console.log('Error: ' + errorMsg + '\n\nUrl: ' + url + '\n\nLine:' + lineNumber);
    return false;
}

username.focus();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrs();
    if (!username.value || !pswrd.value) {
        if (!pswrd.value) {
            displayErr('Please fill out this field', 'pswrdErr');
            pswrd.focus();
        }
        if (!username.value) {
            displayErr('Please fill out this field', 'usernameErr');
            username.focus();
        }
        if (!email.value) {
            displayErr('Please fill out this field', 'emailErr');
            email.focus();
        }
    } else {
        const accountData = {
            username: username.value,
            password: pswrd.value,
            email: email.value,
            pfp: avatar,
            device: localStorage.getItem('devId'),
            
        }

        API.post('/register', accountData, 'json')
            .then(res => {
                if (res.error === false) {
                    setInterval(() => {
                        API.get(`/users/${res.id}/verified`, 'json')
                            .then(verified => {
                                if (verified.verified === true) {
                                    localStorage.setItem('userId', res.id);
                                    localStorage.setItem('isLogin', true);
                                    window.location.href = `/home?ref=${window.location.href}&did=${localStorage.getItem('devid')}&uid=${res.id}&uft=true`
                                }
                            });
                    }, 1000);
                } else if (res.error === true) {
                    displayErr(res.errorMsg, errorTarget);
                } else {
                    displayErr('The server encountered an error while trying to proccess your request', 'emailErr');
                }
            }).catch(err => {
                displayErr('The server encountered an error while trying to proccess your request', 'emailErr');
            })

        document.querySelector('.Loader').classList.remove('hidden')
        document.querySelector('.form').classList.add('hidden')
        var interval = setInterval(() => {
            if (isCreated === true) {
                clearInterval(interval)
                document.querySelector('#loadingText').innerText = 'Logging you in...'
                window.location.href = `/home?ref=${window.location.href}&did=${localStorage.getItem('devid')}&uid=${localStorage.getItem('userId')}&uft=true`
            }
        }, 500);
    }
});