
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
        api('/login', { username: username.value, password: pswrd.value }, 'post', 'application/json', 'text')
            .then(response => {
                alert(response);
                if (response) {
                    document.querySelector('.Loader').classList.remove('hidden')
                    document.querySelector('.form').classList.add('hidden')
                    var interval = setInterval(() => {
                        if (isValid === true) {
                            clearInterval(interval);
                            localStorage.setItem('isLogin', true)
                            document.querySelector('#loadingText').innerText = 'Logging you in...';
                            window.location.href = `/home?ref=${window.location.href}&did=${localStorage.getItem('devid')}&uid=${localStorage.getItem('userId')}&uft=true`
                        }
                    }, 500);
                }
            });
    }
});