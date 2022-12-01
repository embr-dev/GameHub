const path = window.location.pathname;

if (path === '/') {
    if (action == 'logout') {
        localStorage.removeItem('isLogin');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
    }

    firebasesrc.onload = function() {
        firebase.initialize({
            projectName: 'GameHub'
        });
        const db = firebase.database().ref('accounts');
        db.on('value', function(data) {
            document.querySelector('.user-count').innerText = Math.ceil(data.length / 100) * 100 - 100;
        });
    }
}

if (path === '/home') {
    if (hash) {
        //window.history.pushState({}, '', hash /* + '/'*/ );
        if (hash === 'profile') {
            window.history.pushState({}, '', '#' + hash);
            fetch('/assets/files/modal.json')
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
            fetch('/assets/files/modal.json')
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

if (path === '/assets/pages/profile.html') {
    /*const firebasesrc = document.createElement("script");
    firebasesrc.src = 'https://static1.codehs.com/cdn/latest/chsfirebase/chsfirebase.min.js';
    document.body.insertBefore(firebasesrc, document.body.firstChild);*/
}