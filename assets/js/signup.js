const form = document.querySelector('#signup');
const username = document.querySelector('#username');
const pswrd = document.querySelector('#pswrd');
const email = document.querySelector('#email');
var isTaken;
var isCreated = false;
var isLoaded = 0;
var avatar;
isLoaded++
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
                isLoaded++
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

function f2(users, user) {
    accountsDB.on('value', function (accounts) {
        const data = accounts.val();

        var interval = setInterval(() => {
            if (isLoaded === 2) {
                clearInterval(interval)
                if (data) {
                    user =
                    {
                        username: username.value,
                        password: pswrd.value,
                        pridevid: localStorage.getItem('devid'),
                        history: [],
                        friends: [],
                        settings: 'default',
                        pfp: avatar,
                        id: data.length + 1
                    };
                    localStorage.setItem('isLogin', true);
                    localStorage.setItem('userId', data.length + 1);
                    isCreated = true;
                    if (!data) {
                        users.push(user);
                        accountsDB.set(users);
                    } else {
                        users = data;
                        users.push(user);
                        accountsDB.set(users);
                    }
                    isCreated = true;
                } else {
                    user =
                    {
                        username: username.value,
                        password: pswrd.value,
                        pridevid: localStorage.getItem('devid'),
                        history: [],
                        friends: [],
                        settings: 'default',
                        pfp: avatar,
                        id: 1
                    };
                    localStorage.setItem('isLogin', true);
                    localStorage.setItem('userId', 1);
                    isCreated = true;
                    if (!data) {
                        users.push(user);
                        accountsDB.set(users);
                    } else {
                        users = data;
                        users.push(user);
                        accountsDB.set(users);
                    }
                    isCreated = true;
                }
            }
        }, 20);
    })
}

function f1() {
    var accounts;
    var dataLoaded = false;

    accountsDB.on('value', function (data) {
        accounts = data.val();
        dataLoaded = true;
    });

    var interval = setInterval(() => {
        if (dataLoaded === true) {
            clearInterval(interval)
            if (accounts) {
                let usernames = [];
                for (let i = 0; i < accounts.length; i++) {
                    usernames.push(accounts[i].username);
                }

                if (usernames.includes(username.value) === false) {
                    newAvatar()
                    f2([], {})
                } else {
                    displayErr('This username has already been taken', 'usernameErr');
                }
            } else {
                newAvatar()
                f2([], {})
            }
        }
    }, 1000);
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
        fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=704e8b23f35845d59207732aae0a261a&email=${email.value}`)
            .then(obj => obj.json())
            .then(data => {
                if (data.deliverability == 'deliverable' && data.is_disposable_email.value === false) {
                    var interval = setInterval(() => {
                        apiGet(`/users/${userData.id}/verified`, 'text')
                            .then(res => {
                                if (res.verified === true) {
                                    clearInterval(interval)
                                }
                            });
                    }, 100)
                } else {
                    displayErr('Invalid email', 'emailErr');
                }
            });

        f1();
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