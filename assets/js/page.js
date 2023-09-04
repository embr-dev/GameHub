import API from './api.js';

const path = window.location.pathname;

const loadPageScripts = async (urlParams, hash) => {
    if (path === '/') {
        if (await API.validSession()) {
            document.querySelector('.navbar-end').innerHTML = `<span class="navbar-item">
                <a class="button is-link is-inverted" href="/app">Open GameHub</a>
            </span>`;

            document.querySelector('#launchbtn').textContent = 'Browse Games';
            document.querySelector('#launchbtn').href = '/app';
        }
    } else if (path === '/app') {
        if (urlParams.get('newuser') == 'true') {
            const welcomeModal = document.createElement('div');
            welcomeModal.classList = 'modal is-active';
            welcomeModal.innerHTML = `
            <div class="modal-background"></div>
            <div class="modal-content">
                <div class="card">
                    <div style="padding: 50px">
                        <h1 class="title is-center">Welcome ${urlParams.get('username')}!</h1>
                        <p class="text is-center">GameHub is a place to play unblocked games and have fun with the community.</p>
                        <br>
                        <p class="text is-center">Before you continue please agree to the <a href="https://embernet.work/tos" target="_blank">Terms Of Service</a> and <a href="https://embernet.work/community-guidelines" target="_blank">Comunity Guidelines</a>.</p>
                        <br>
                        <label class="checkbox">
                            <input type="checkbox" id="agreetoterms">
                            I agree
                        </label>
                        <br>
                        <br>
                        <button class="button is-danger is-rounded" disabled id="closemodal">Continue</button>
                    </div>
                </div>
            </div>`;
            document.querySelector('.hidden').appendChild(welcomeModal);
            document.body.classList.add('noscroll');
            document.documentElement.classList.add('noscroll');

            setTimeout(() => {
                document.querySelector('#agreetoterms').addEventListener('change', (e) => {
                    if (document.querySelector('#agreetoterms').checked) {
                        document.querySelector('#closemodal').disabled = false;
                    } else {
                        document.querySelector('#closemodal').disabled = true;
                    }
                })

                document.querySelector('#closemodal').addEventListener('click', (e) => {
                    welcomeModal.remove();
                    document.body.classList.remove('noscroll');
                    document.documentElement.classList.remove('noscroll');
                })
            }, 3000);
        }

        if (hash === 'profile') setTimeout(() => document.querySelector('[data-action="open_profile"]').click(), 500);

        const profileTriggers = document.querySelectorAll('[data-action="open_profile"]');

        profileTriggers.forEach(profileTrigger => profileTrigger.addEventListener('click', (e) => {
            window.history.pushState({}, '', '#profile');
            const modalEl = document.createElement('div');

            modalEl.innerHTML = `
            <div class="modal is-active" id="profile_page">
                <div class="modal-background"></div>
                <div class="modal-content">
                    <div class="card">
                        <iframe src="/assets/pages/profile.html" scrolling="no" class="frame_500x500"></iframe>
                    </div>
                </div>
                <button class="modal-close is-large" aria-label="close"></button>
            </div>`;
            document.querySelector('#app').appendChild(modalEl);
        }));
    }
}

export default loadPageScripts;