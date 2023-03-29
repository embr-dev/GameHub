ongamehub = () => {
    const nav = document.querySelector('.navbar');
    const searchContainer = document.querySelector('.database_nav');

    window.onscroll = () => {
        if (window.pageYOffset > document.querySelector('.hero').offsetHeight) {
            searchContainer.classList.add('shadowed');
        } else {
            searchContainer.classList.remove('shadowed');
        }
    }

    API.get('/games').then(games => {
        const searchBar = document.querySelector('[data-func="search"]');

        searchBar.addEventListener('input', (e) => {
            if (searchBar.value) {
                const gameNames = [];
                document.querySelectorAll('.game').forEach(gameEl => {
                    gameNames.push(gameEl.title.toLowerCase());
                });

                if (gameNames.includes(searchBar.value.toLowerCase())) {
                    document.querySelectorAll('.game').forEach(gameEl => {
                        const isSearch = gameEl.title.toLowerCase().includes(searchBar.value.toLowerCase());
                        if (!isSearch) {
                            gameEl.classList.add('hidden');
                        } else {
                            gameEl.classList.remove('hidden');
                        }
                    })
                }
            } else {
                document.querySelectorAll('.game').forEach(gameEl => {
                    gameEl.classList.remove('hidden');
                })
            }
        });

        document.querySelector('.games').innerHTML = '';
        games.forEach(game => {
            const gameEl = document.createElement('div');
            gameEl.classList = 'game';
            gameEl.title = game.name;
            gameEl.innerHTML = `<img src="${game.thumbnail}"/><p>${game.name}</p>`;
            document.querySelector('.games').appendChild(gameEl);

            gameEl.querySelector('img').onerror = (e) => {
                e.target.src = '/assets/img/logo.png';
            }

            gameEl.addEventListener('click', (e) => {
                openGame(game.id);
            });
        })

        searchBar.focus();
    });

    function openGame(id) {
        const gFrame = document.querySelector('.gameFrame');
        const gameDatabase = document.querySelector('.games');
        gFrame.classList.remove('hidden');
        gameDatabase.classList.add('hidden');
        document.querySelector('.database_nav').classList.add('hidden');
        API.get(`/games/${id}`).then(game => {
            nav.classList.add('hidden');
            document.body.classList.add('noscroll');
            document.documentElement.classList.add('noscroll');

            const gameEl = document.createElement('iframe');
            gameEl.classList = 'innerGame';
            gameEl.src = '/assets/public/gs/game.html';
            gameEl.title = game.name;
            gFrame.appendChild(gameEl);

            gameEl.scrollIntoView();

            isGameOpen = true;

            gameEl.onload = function () {
                const frame = gameEl.contentWindow.document;
                const commentContainer = frame.querySelector('.commentContainer');
                const commentsToggle = frame.querySelector('[data-func="open-comments"]');

                const commentUnfilled = commentsToggle.querySelectorAll('svg')[0];
                const commentFilled = commentsToggle.querySelectorAll('svg')[1];

                frame.querySelector('.mainGame').src = game.url;
                frame.querySelector('.gameTitle').innerText = game.name;

                frame.querySelector('[data-attr="fullscreen"]').addEventListener('click', (e) => {
                    frame.querySelector('.mainGame').requestFullscreen();
                });

                var commentFrame = frame.createElement('iframe');
                commentFrame.src = `/assets/public/pages/comments.html?id=${id}`;
                commentFrame.classList = 'commentFrame';
                commentFrame.setAttribute('frameborder', '0');
                commentContainer.appendChild(commentFrame);

                commentsToggle.addEventListener('click', (e) => {
                    if (commentUnfilled.dataset.val === 'false') {
                        commentUnfilled.classList.add('hidden');
                        commentFilled.classList.remove('hidden');

                        commentContainer.classList.remove('hidden');
                    }
                });

                API.get(`/games/${id}/recomended`).then(recomendations => {
                    const recomendedGames = frame.querySelectorAll('.gameThumb');
                    for (let i = 0; i < recomendations.length; i++) {
                        recomendedGames[i].innerHTML = `<img src="${recomendations[i].thumbnail}" title="${recomendations[i].name}"></img>`;

                        recomendedGames[i].querySelector('img').onerror = (e) => {
                            e.target.src = '/assets/img/logo.png';
                        }

                        recomendedGames[i].addEventListener('click', (e) => {
                            document.querySelector('.innerGame').remove();
                            openGame(recomendations[i].id);
                        });
                    }
                });

                frame.querySelector('.logo').addEventListener('click', (e) => {
                    closeGame();
                });
            }
        });
    }

    function closeGame() {
        nav.classList.remove('hidden');
        document.body.classList.remove('noscroll');
        document.documentElement.classList.remove('noscroll');
        const gFrame = document.querySelector('.gameFrame');
        const gameDatabase = document.querySelector('.games');
        gFrame.classList.add('hidden');
        isGameOpen = false;
        document.querySelector('.innerGame').remove();
        gameDatabase.classList.remove('hidden');
        document.querySelector('.database_nav').classList.remove('hidden');
        gameDatabase.scrollIntoView();
    }

    window.onresize = function () {
        const game = document.querySelector('.gameFrame');
        game.scrollIntoView();
    }
}