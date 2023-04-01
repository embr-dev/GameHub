const form = document.getElementById('login');
const username = document.getElementById('username');
const password = document.getElementById('password');

function displayErr(err, elid) {
    document.querySelector('.form').classList.remove('hidden')
    document.querySelector('.Loader').classList.add('hidden')
    document.getElementById(elid).innerText = err;
}

function clearErrs() {
    const err = document.querySelectorAll('.err');
    for (let i = 0; i < err.length; i++) {
        err[i].innerText = ''
    }
}

username.focus();
form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrs();
    if (!username.value || !password.value) {
        if (!password.value) {
            displayErr('Please fill out this field', 'passwordErr');
            password.focus();
        }
        if (!username.value) {
            displayErr('Please fill out this field', 'usernameErr');
            username.focus();
        }
    } else {
        document.querySelector('.Loader').classList.remove('hidden');
        document.querySelector('.form').classList.add('hidden');

        API.post('/login', { username: username.value, password: password.value }, true)
            .then(res => {
                if (res.error === false) {
                    cookie.set('userid', res.id);
                    cookie.set('loginsession', true);

                    document.querySelector('#loadingText').innerText = 'Logging you in...';
                    window.location.href = `/home?ref=${window.location.pathname}&uid=${res.id}`;
                } else if (res.error === true) {
                    displayErr(res.errorMsg, 'usernameErr');
                } else {
                    displayErr('The requested account does not exist', 'usernameErr');
                }
            }).catch(e => {
                new RegisterGamehubError(e);
                displayErr('Failed to connect to the server', 'usernameErr');
            })
    }
});