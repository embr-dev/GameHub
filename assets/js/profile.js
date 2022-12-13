//alert(codec.decode(codec.encode('hi')))
const usernameDisplay = document.querySelector('#username');
const userId = localStorage.getItem('userId');
fetch(`https://api.retronetwork.ml/GameHub/users/${userId}`)
    .then(obj => obj.json())
    .then(account => {
        var pfpstyles = document.createElement("style");
        pfpstyles.innerHTML = `.profile-icon{background-image:url("${account.profile}");}`
        document.head.appendChild(pfpstyles);

        if (window.location.pathname !== '/assets/pages/profile.html') {
            usernameDisplay.innerText = account.username;
            loaded++
        }

        if (window.location.pathname === '/assets/pages/profile.html') {
            const parentstyles = document.createElement("style");
            parentstyles.innerHTML = 'html,body {overflow: hidden;}';
            window.parent.document.head.appendChild(parentstyles);
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
            });*/

            pfp.addEventListener('mouseover', (event) => {
                overlay.classList.remove('hidden');
            });

            pfp.addEventListener('mouseout', (event) => {
                overlay.classList.add('hidden');
            });

            pfp.addEventListener('click', (event) => {
                let tempDB = accounts;
                document.querySelector('.main.profile').classList.add('hidden');
                var frame = document.createElement('iframe');
                frame.src = '/assets/pages/cropper.html';
                frame.classList = 'frame_500x500';
                frame.scrolling = 'no';
                document.body.appendChild(frame);

                window.onmessage = (e) => {
                    alert('You cannot change your profile picture at this time')
                    /*if (e.data) {
                        tempDB[userId - 1].pfp = e.data;
                        setTimeout(() => {
                            window.parent.location.reload();
                        }, 2000);
                    } else {
                        alert('Could not proccess your request. Please try again later.')
                    }*/
                }
            });
        }
    });