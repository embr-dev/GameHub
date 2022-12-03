const path = window.location.pathname;

if (path === '/') {
    if (action == 'logout') {
        localStorage.removeItem('isLogin');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
    }
    const database = firebase.database();

    const accountsDB = database.ref('accounts');
    accountsDB.on('value', function (data) {
        document.querySelector('.user-count').innerText = Math.ceil(data.val().length / 100) * 100 - 100;
    });
}

if (path === '/home') {
    if (hash) {
        //window.history.pushState({}, '', hash /* + '/'*/ );
        if (hash === 'profile') {
            window.history.pushState({}, '', '#' + hash);
            fetch('/assets/files/modal')
                .then(obj => obj.text())
                .then(modal => {
                    const modalEl = document.createElement("div");
                    modalEl.innerHTML = modal;
                    document.querySelector('.main').appendChild(modalEl);
                    modalEl.firstChild.classList.add('is-active')
                });
        }
    }
    const profileTrigger = document.querySelectorAll('[data-action="open_profile"]');

    for (let i = 0; i < profileTrigger.length; i++) {
        profileTrigger[i].addEventListener('click', (event) => {
            window.history.pushState({}, '', '#profile');
            fetch('/assets/files/modal')
                .then(obj => obj.text())
                .then(modal => {
                    const modalEl = document.createElement("div");
                    modalEl.innerHTML = modal;
                    document.querySelector('.main').appendChild(modalEl);
                    modalEl.firstChild.classList.add('is-active')
                });
        });
    }
}