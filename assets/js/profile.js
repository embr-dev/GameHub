const usernameDisplay = document.querySelector('#username');
const userId = cookie.get('userid');
const content = document.querySelector('.main.profile');

API.get(`/users/${userId}`)
    .then(account => {
        if (!account.error) {
            if (window.location.pathname !== '/assets/pages/profile.html') {
                const profileCSS = document.createElement("style");
                profileCSS.innerHTML = `.profile-icon{background-image:url("${account.profile}");}`
                document.head.appendChild(profileCSS);

                usernameDisplay.innerText = account.username;

                if (account.verified === false) {
                    const emailModal = document.createElement('div');
                    emailModal.classList = 'modal is-active';
                    emailModal.innerHTML = `
                    <div class="modal-background">
                    </div>

                    <div class="modal-content">
                        <div class="card">
                            <div style="padding: 50px; text-align: center;" id="verifycontent">
                                <h1 class="title is-center">Please verify your email</h1>
                                <p class="err" id="emailerror"></p>
                                <form id="emailform">
                                    <input class="input is-danger is-rounded" placeholder="you@example.com" type="email" id="emailinput" />
                                    <br>
                                    <br>
                                    <button class="button is-danger is-rounded" type="submit">Verify</button>
                                </form>    
                            </div>
                        </div>
                    </div>`;
                    document.querySelector('.main').appendChild(emailModal);
                    document.body.classList.add('noscroll');
                    document.documentElement.classList.add('noscroll');

                    const emailForm = emailModal.querySelector('#emailform');
                    const emailInput = emailForm.querySelector('#emailinput');
                    emailForm.addEventListener('submit', (e) => {
                        e.preventDefault();

                        if (emailInput.value) {
                            document.querySelector('#emailerror').textContent = '';

                            API.post(`/users/${userId}/verify`, { email: emailInput.value })
                                .then(res => {
                                    if (res.error === false) {
                                        emailModal.querySelector('#verifycontent').innerHTML = `
                                <i class="fa-solid fa-envelope" style="font-size: 50px; text-align: center;"></i>
                                <h1 class="subtitle is-4">Email Verification</h1>
                                <p>We just sent an email to ${emailInput.value}.<br><br> Didn't get the email? <br>Check your spam folder.</p>`;

                                        let emailChecker = setInterval(() => {
                                            API.get(`/users/${userId}/verified`)
                                                .then(verified => {
                                                    if (verified.verified === true) {
                                                        clearTimeout(emailChecker);
                                                        location.reload();
                                                    }
                                                }).catch(e => {

                                                })
                                        }, 3000)
                                    } else if (res.error === true) {
                                        document.querySelector('#emailerror').textContent = res.errorMsg;
                                    } else {
                                        document.querySelector('#emailerror').textContent = 'The server did not provide a valid response';
                                    }
                                }).catch(e => {
                                    new RegisterGamehubError('Could not load verification');
                                })
                        } else {
                            document.querySelector('#emailerror').textContent = 'Please enter an email';
                        }
                    })
                }

                loaded++
            } else {
                window.parent.document.body.classList.add('noscroll');
                window.parent.document.documentElement.classList.add('noscroll');
                const pfp = document.querySelector('.pfp');
                const closeBtn = window.parent.document.querySelector('.modal-close');
                const usernameInput = document.querySelector('[data-attr="username"]');
                const idDisplay = document.querySelector('.userid');
                const loader = document.querySelector('.lds-spinner');
                const overlay = document.querySelector('.uploadIcon');
                const inputBtn = document.querySelector('.button.is-rounded.is-danger.has-right-sharp');
                pfp.style.backgroundImage = `url("${account.profile}")`;
                usernameInput.value = account.username;
                idDisplay.innerText = '#' + userId;
                loader.classList.add('hidden');
                closeBtn.addEventListener('click', (event) => {
                    window.parent.document.documentElement.classList.remove('noscroll');
                    window.parent.document.body.classList.remove('noscroll');
                    window.parent.history.pushState({}, '', window.parent.location.pathname);
                    window.parent.document.querySelector('.modal.is-active').remove();
                    parentstyles.remove();
                });

                /*usernameInput.addEventListener('click', (event) => {
                    usernameInput.value = account.username;
     
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
    
                pfp.addEventListener('mouseover', (event) => {
                    overlay.classList.remove('hidden');
                });
    
                pfp.addEventListener('mouseout', (event) => {
                    overlay.classList.add('hidden');
                });
    
                pfp.addEventListener('click', (event) => {
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
        } else {
            new RegisterGamehubError('Could not load profile data');
        }
    }).catch(e => {
        new RegisterGamehubError('Could not load profile data');
    })