
const form = document.getElementById('login');
const username = document.getElementById('username');
const pswrd = document.getElementById('pswrd');

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
        document.querySelector('.Loader').classList.remove('hidden');
        document.querySelector('.form').classList.add('hidden');

        API.post('/login', { username: username.value, password: pswrd.value })
            .then(res => {
                if (res.error === false) {
                    localStorage.setItem('isLogin', true);
                    localStorage.setItem('userId', res.id);

                    document.querySelector('#loadingText').innerText = 'Logging you in...';
                    window.location.href = `/home?ref=${window.location.pathname}&uid=${res.id}&uft=true`;
                } else if (res.error === true) {
                    displayErr(res.errorMsg, 'usernameErr');
                } else {
                    displayErr('The requested account does not exist', 'usernameErr');
                }
            }).catch(e => {
                displayErr('Failed to connect to the server', 'usernameErr');
            })
    }
});