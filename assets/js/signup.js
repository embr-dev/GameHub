const firebaseConfig = {
    apiKey: "AIzaSyCljTB8jYkhyf_XRlbcRk6ai2c1kmTwSpQ",
    authDomain: "gamehub-527d9.firebaseapp.com",
    databaseURL: "https://gamehub-527d9-default-rtdb.firebaseio.com",
    projectId: "gamehub-527d9",
    storageBucket: "gamehub-527d9.appspot.com",
    messagingSenderId: "609224844553",
    appId: "1:609224844553:web:dc43596c5145a7d64ddfd8"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

database.ref(accounts).on('value', (snapshot) => {
    alert(snapshot.val());
    console.log(snapshot.val());
})

const form = document.getElementById('signup');
const username = document.getElementById('username');
const pswrd = document.getElementById('pswrd');
const accountsDB = database.ref('accounts');
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
    console.log('An internal error occurred. Please try again later.');//or any message
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
    accountsDB.on('value', function (accounts) {
        const data = accounts.val();
        if (data) {
            let usernames = [];
            for (let i = 0; i < data.length; i++) {
                usernames.push(data[i].username)
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
    });
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
    } else {
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