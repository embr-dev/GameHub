const form = document.querySelector('#signup');
const username = document.querySelector('#username');
const pswrd = document.querySelector('#pswrd');
const email = document.querySelector('#email');

function generateAvatar(word, callback) {
    const peer = new Peer();

    peer.on('open', (id) => {
        var ifr = document.createElement('iframe');
        ifr.src = `https://russell2259.github.io/barbackend/Avatar?token=${id}&word=${word}`;
        ifr.style = 'width: 0px; height: 0px;';
        ifr.setAttribute('frameborder', 'none');
        ifr.id = 'ifr'
        document.body.appendChild(ifr);
    });

    peer.on('connection', (conn) => {
        const decrypt = (salt, encoded) => {
            const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
            const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
            return encoded
                .match(/.{1,2}/g)
                .map((hex) => parseInt(hex, 16))
                .map(applySaltToChar)
                .map((charCode) => String.fromCharCode(charCode))
                .join('');
        };

        conn.on('open', () => {
            conn.on('data', (data) => {
                const message = decrypt('avatar', data);
                callback(message);
            });
        });
    });
}

function displayErr(err, elid) {
    document.querySelector('.form').classList.remove('hidden');
    document.querySelector('.Loader').classList.add('hidden');
    document.querySelector('.email_verification').classList.add('hidden');
    document.getElementById(elid).innerText = err
}

function clearErrs() {
    const err = document.querySelectorAll('.err');
    for (let i = 0; i < err.length; i++) {
        err[i].innerText = '';
    }
}

username.focus();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrs();
    if (!username.value || !pswrd.value || !email.value) {
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
        document.querySelector('.Loader').classList.remove('hidden');
        document.querySelector('.form').classList.add('hidden');

        generateAvatar(username.value, (avatar) => {
            const accountData = {
                username: username.value,
                password: pswrd.value,
                email: email.value,
                pfp: avatar
            }

            API.post(`/register?hostname=${window.location.hostname}`, accountData)
                .then(res => {
                    if (res.error === false) {
                        document.querySelector('.form').classList.add('hidden');
                        document.querySelector('.Loader').classList.add('hidden');
                        document.querySelector('.email_verification').classList.remove('hidden');
                        document.querySelector('#email_text').innerText = email.value;

                        cookie.set('userid', res.id);
                        cookie.set('loginsession', true);

                        setInterval(() => {
                            API.get(`/users/${res.id}/verified`)
                                .then(verified => {
                                    if (verified.verified === true) {
                                        document.querySelector('#loadingText').innerText = 'Logging you in...';
                                        window.location.href = `/home?ref=${window.location.pathname}&uid=${res.id}&uft=true&newuser=true&username=${username.value}`
                                    }
                                });
                        }, 3000);
                    } else if (res.error === true) {
                        displayErr(res.errorMsg, 'emailErr');
                    } else {
                        displayErr('The server encountered an error while trying to proccess your request', 'emailErr');
                    }
                }).catch(e => {
                    new RegisterGamehubError(e);
                    displayErr('The server encountered an error while trying to proccess your request', 'emailErr');
                    throw e;
                });
        });
    }
});