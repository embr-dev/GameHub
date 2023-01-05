const nav = document.querySelector('.navbar');
fetch('https://api.retronetwork.ml/GameHub/games')
    .then(obj => obj.json())
    .then(games => {
        let gameList = [];
        const searchBar = document.querySelector('[data-func="search"]');
        var prev_value;
        const search_query = urlParams.get('search_query');

        /*if (search_query) {
            window.history.pushState({}, '', '?search_query=' + search_query)
        }*/

        searchBar.addEventListener('input', (e) => {
            if (searchBar.value) {
                //window.history.pushState({}, '', '?search_query=' + searchBar.value)

                for (let i = 0; i < document.querySelectorAll('.game').length; i++) {
                    const isSearch = document.querySelectorAll('.game')[i].title.toLowerCase().includes(searchBar.value.toLowerCase());
                    document.querySelectorAll('.game')[i].classList.add('hidden');
                }
            } else {
                //window.history.pushState({}, "", window.location.pathname);
                for (let i = 0; i < document.querySelectorAll('.game').length; i++) {
                    document.querySelectorAll('.game')[i].classList.remove('hidden');
                }
            }
        });

        document.querySelector('.games').innerHTML = '';
        for (let i = 0; i < games.length; i++) {
            gameList.push(games[i].name)
            var game = document.createElement('div');
            game.classList = 'game';
            game.title = games[i].name;
            game.innerHTML = `<img src="${games[i].thumbnail}"/><p>${games[i].name}</p>`;
            document.querySelector('.games').appendChild(game);
            game.addEventListener('click', (e) => {
                openGame(games[i].id);
            });
        }

        searchBar.focus();
    });

function openGame(id) {
    const gFrame = document.querySelector('.gameFrame');
    const gameDatabase = document.querySelector('.games');
    gFrame.classList.remove('hidden');
    gameDatabase.classList.add('hidden');
    document.querySelector('.database_nav').classList.add('hidden');
    fetch(`https://api.retronetwork.ml/GameHub/games/${id}?hostname=${window.location.host}`)
        .then(obj => obj.json())
        .then(game => {
            var gameElement = document.createElement('iframe');
            gameElement.classList = 'innerGame';
            gameElement.src = '/assets/public/gs/game.html';
            gameElement.title = game.name;
            nav.classList.add('hidden');
            document.body.classList.add('noscroll');
            gFrame.appendChild(gameElement);
            gameElement.scrollIntoView();
            isGameOpen = true;
            gameElement.onload = function () {
                const frame = gameElement.contentWindow.document;
                const commentContainer = frame.querySelector('.commentContainer');
                const down = frame.querySelector('[data-attr="thumbs-down"]');
                const up = frame.querySelector('[data-attr="thumbs-up"]');
                const commentsToggle = frame.querySelector('[data-func="open-comments"]');

                const commentUnfilled = commentsToggle.querySelectorAll('svg')[0];
                const commentFilled = commentsToggle.querySelectorAll('svg')[1];

                const upFilled = up.querySelectorAll('svg')[1];
                const downFilled = down.querySelectorAll('svg')[1];
                const upUnfilled = up.querySelectorAll('svg')[0];
                const downUnfilled = down.querySelectorAll('svg')[0];

                frame.querySelector('.mainGame').src = game.url;
                frame.querySelector('.gameTitle').innerText = game.name;
                up.querySelectorAll('p').innerText = game.rating;

                frame.querySelector('[data-attr="fullscreen"]').addEventListener('click', (e) => {
                    frame.querySelector('.mainGame').requestFullscreen();
                });

                var commentFrame = frame.createElement('iframe');
                commentFrame.src = `/assets/public/pages/comments.html?id=${id}`;
                commentFrame.classList = 'commentFrame';
                commentFrame.frameBorder = 0;
                commentContainer.appendChild(commentFrame);

                commentsToggle.addEventListener('click', (e) => {
                    if (commentUnfilled.dataset.val === 'false') {
                        commentUnfilled.classList.add('hidden');
                        commentFilled.classList.remove('hidden');

                        commentContainer.classList.remove('hidden');
                    }
                });

                up.addEventListener('click', (e) => {
                    if (upFilled.dataset.val === 'false') {
                        upUnfilled.classList.add('hidden');
                        upFilled.classList.remove('hidden');
                        upFilled.dataset.val = 'true';
                        //rating++
                        //up.querySelector('p').innerText = rating;
                    } else if (upFilled.dataset.val === 'true') {
                        upUnfilled.classList.remove('hidden');
                        upFilled.classList.add('hidden');
                        upFilled.dataset.val = 'false';
                        //rating--
                        //up.querySelector('p').innerText = rating;
                    }

                    if (downFilled.dataset.val === 'true') {
                        down.querySelectorAll('svg')[0].classList.remove('hidden');
                        downFilled.classList.add('hidden');
                        downFilled.dataset.val = 'false';
                    }
                });
                down.addEventListener('click', (e) => {
                    if (downFilled.dataset.val === 'false') {
                        down.querySelectorAll('svg')[0].classList.add('hidden');
                        downFilled.classList.remove('hidden');
                        downFilled.dataset.val = 'true';
                    } else if (downFilled.dataset.val === 'true') {
                        down.querySelectorAll('svg')[0].classList.remove('hidden');
                        downFilled.classList.add('hidden');
                        downFilled.dataset.val = 'false';
                    }

                    if (upFilled.dataset.val === 'true') {
                        upUnfilled.classList.remove('hidden');
                        upFilled.classList.add('hidden');
                        upFilled.dataset.val = 'false';
                        //rating--
                        //up.querySelector('p').innerText = rating;
                    }

                    //gameRating[id].rating = -1
                    //alert(codec.encode('0'))
                });

                fetch(`https://api.retronetwork.ml/GameHub/games/${id}/recomended`)
                    .then(obj => obj.json())
                    .then(recomendations => {
                        const recomendedGames = frame.querySelectorAll('.gameThumb');
                        for (let i = 0; i < recomendations.length; i++) {
                            recomendedGames[i].innerHTML = `<img src="${recomendations[i].thumbnail}" title="${recomendations[i].name}"></img>`;

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