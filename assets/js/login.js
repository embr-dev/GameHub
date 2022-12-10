alert('If you have not already created an account before the gamehub url was moved we are sorry to inform you that our databases have reached the max connection limit in only three days of the site being up.');

var fbjsLoader = setInterval(() => {
    if (fbjsLoaded === true) {
        clearInterval(fbjsLoader)
        const form = document.getElementById('login');
        const username = document.getElementById('username');
        const pswrd = document.getElementById('pswrd');
        const accountsDB = database.ref('accounts');
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

        function f1() {
            accountsDB.on('value', function (data) {
                const accounts = data.val();
                if (accounts) {
                    for (let i = 0; i < accounts.length; i++) {
                        const isUsername = username.value === accounts[i].username;
                        const isPassword = pswrd.value === accounts[i].password;
                        const isCorrect = isUsername && isPassword;
                        const isLast = i + 1 === accounts.length;
                        if (isCorrect) {
                            isValid = true;
                            localStorage.setItem('userId', accounts[i].id)
                        } else {
                            if (isLast && isValid === false) {
                                displayErr('The requested account does not exist.', 'usernameErr');
                            }
                        }
                    }

                } else {
                    displayErr('The requested account does not exist.', 'usernameErr');
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
}, 100);