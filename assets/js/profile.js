import { registerError } from './notification.js';
import loadPageScripts from './page.js';
import API from './api.js';

if (window.location.pathname === '/assets/pages/profile.html') {
    if (!window.frameElement) window.location.replace('/app#profile');

    loadPageScripts(new URLSearchParams(window.location.search), window.location.hash.replace('#', ''));
}

const usernameDisplay = document.querySelector('#username');

API.get(`/me`)
    .then(user => {
        if (!user.error) {
            if (window.location.pathname !== '/assets/pages/profile.html') {
                document.querySelector('.avatar-small').style.backgroundImage = `url('${API.servers[0]}${user.avatar}')`;

                usernameDisplay.innerText = user.username;
            } else {
                window.parent.document.body.classList.add('noscroll');
                window.parent.document.documentElement.classList.add('noscroll');
                const overlay = document.querySelector('.uploadIcon');
                const inputBtn = document.querySelector('.button.is-rounded.is-danger.has-right-sharp');
                document.querySelector('.avatar').style.backgroundImage = `url("${API.servers[0]}${user.avatar}")`;
                document.querySelector('[data-attr="username"]').value = user.username;
                document.querySelector('.userid').innerText = '#' + user.id;

                document.querySelector('#app').classList.remove('hidden');
                document.querySelector('#loader').classList.add('hidden');

                window.parent.document.querySelector('.modal-close').addEventListener('click', (event) => {
                    window.parent.document.documentElement.classList.remove('noscroll');
                    window.parent.document.body.classList.remove('noscroll');
                    window.parent.history.pushState({}, '', window.parent.location.pathname);
                    window.parent.document.querySelector('.modal.is-active').remove();
                    parentstyles.remove();
                });

                window.parent.document.querySelector('.modal-background').addEventListener('click', (event) => {
                    window.parent.document.documentElement.classList.remove('noscroll');
                    window.parent.document.body.classList.remove('noscroll');
                    window.parent.history.pushState({}, '', window.parent.location.pathname);
                    window.parent.document.querySelector('.modal.is-active').remove();
                    parentstyles.remove();
                });

                /*usernameInput.addEventListener('click', (event) => {
                    usernameInput.value = user.username;
     
                    document.querySelector('.usernameForm').classList.remove('hidden');
                    edit.classList.add('hidden');
                    username.classList.add('hidden');
                    idDisplay.classList.add('hidden');
     
                    usernameInput.focus();
                });
    
                document.querySelector('.usernameForm').addEventListener('submit', (event) => {
                    event.preventDefault();
                    if (inputBtn.accountsset.val === '1') {
                        let tempDB = accounts;
                        if (usernameInput) {
                            let usernames = [];
    
                            for (let i = 0; i < accounts.length; i++) {
                                usernames.push(accounts[i].username)
                            }
    
                            if (usernameInput.value == accounts[userId - 1].username) {
                                alert('This is already your username')
                            } else {
                                if (usernames.includes(usernameInput.value) === false) {
                                    tempDB[userId - 1].username = usernameInput.value;
                                } else {
                                    alert('This username is already taken.');
                                    usernameInput.value = accounts[userId - 1].username;
                                }
                            }
                        } else {
                            alert('Please enter a username');
                        }
                    } else if (inputBtn.accountsset.val === '0') {
                        inputBtn.innerText = 'Done';
                        inputBtn.accountsset.val = '1';
                        usernameInput.readOnly = false;
                        usernameInput.focus();
                    }
                });
    
                avatar.addEventListener('mouseover', (event) => {
                    overlay.classList.remove('hidden');
                });
    
                avatar.addEventListener('mouseout', (event) => {
                    overlay.classList.add('hidden');
                });
    
                avatar.addEventListener('click', (event) => {
                    content.classList.add('hidden');
    
                    const frame = document.createElement('iframe');
                    frame.src = '/assets/pages/cropper.html';
                    frame.classList = 'frame_500x500';
                    frame.setAttribute('scrolling', 'no');
                    document.body.appendChild(frame);
    
                    window.onmessage = (e) => {
                        if (e.data) {
                            frame.remove();
                            content.classList.remove('hidden');
    
                            content.innerHTML = `<h1 class="title is-5 is-center">Please Confirm Your Password</h1><input placeholder="Password" type="password" class="input is-danger is-rounded" id="confirm_password" />`;
    
                            const confirm = content.querySelector('#confirm_password');
                            confirm.focus();
    
                            confirm.addEventListener('keydown', (event) => {
                                if (event.key === 'Enter') {
                                    API.post(`/users/${userId}/change/profile`, { username: account.username, password: confirm.value, picture: e.data })
                                        .then(res => {
                                            alert(res);
                                        }).catch(e => {
            
                                        })
                                }
                            });
                        } else {
                            alert('Could not proccess your request. Please try again later.')
                        }
                    }
                });*/
            }
        } else registerError('Could not load profile data');
    }).catch(e => registerError('Could not load profile data'));