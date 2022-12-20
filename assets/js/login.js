
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
            .then(res => {
                console.log(res.errorMsg)

                if (res.valid === true) {
                    document.querySelector('.Loader').classList.remove('hidden');
                    document.querySelector('.form').classList.add('hidden');
                    localStorage.setItem('isLogin', true);
                    localStorage.setItem('userId', res.id)
                    document.querySelector('#loadingText').innerText = 'Logging you in...';
                    window.location.href = `/home?ref=${window.location.href}&did=${localStorage.getItem('devid')}&uid=${res.id}&uft=true`
                } else if (res.errorMsg == 'invalid') {
                    displayErr('The requested account does not exist', 'usernameErr');
                } else if (res.errorMsg == 'nodata') {
                    username.focus();
                    displayErr('Please fill out this field', 'usernameErr');
                    displayErr('Please fill out this field', 'pswrdErr');
                } else {
                    displayErr('An internal error occoured please try again later', 'usernameErr');
                    alert(res.errorMsg)
                }
            });
    }
});