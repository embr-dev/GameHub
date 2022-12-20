
const form = document.getElementById('login');
const username = document.getElementById('username');
const pswrd = document.getElementById('pswrd');
var isValid = false;

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
        apiPost('/login', { username: username.value, password: pswrd.value }, 'json')
            .then(response => {
                alert(JSON.stringify(response))

                if (response.valid === true) {
                    document.querySelector('.Loader').classList.remove('hidden')
                    document.querySelector('.form').classList.add('hidden')
                    var interval = setInterval(() => {
                        if (isValid === true) {
                            clearInterval(interval);
                            localStorage.setItem('isLogin', true);
                            localStorage.setItem('userId', response.id)
                            document.querySelector('#loadingText').innerText = 'Logging you in...';
                            window.location.href = `/home?ref=${window.location.href}&did=${localStorage.getItem('devid')}&uid=${response.id}&uft=true`
                        }
                    }, 500);
                } else if (response.error == 'missing credentials') {
                    username.focus();
                    displayErr('Please fill out this field', 'usernameErr');
                    displayErr('Please fill out this field', 'pswrdErr');
                } else if (response.error == 'wrong credentials') {
                    displayErr('The requested account does not exist', 'usernameErr');
                } else {
                    displayErr('An internal error occoured please try again later', 'usernameErr');
                }
            });
    }
});