var proxyValid;

fetch('https://incognito.retronetwork.ml/service/' + encodeURIComponent('https://gh.retronetwork.ml/assets/files/proxy'.toString().split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join('')))
    .then(obj => obj.text())
    .then(data => {
        alert(data);
        proxyValid = true;
    }).catch((err) => {
        proxyValid = false;
    });

function proxy (data) {
    if (proxyValid === true) {
        var url = 'https://incognito.retronetwork.ml/service/' + encodeURIComponent(data.toString().split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''));
        //return url;
        return data;
    } else if (proxyValid === false) {
        return data;
    } else {
        return data;
    }
}

var fbjsLoader = setInterval(() => {
    if (fbjsLoaded === true) {
        clearInterval(fbjsLoader)

        var gameId = null;
        const nav = document.querySelector('.navbar');
        const gameDB = database.ref('games');
        const accountDB = database.ref('accounts');
        gameDB.on('value', function (data) {
            const games = data.val();

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
                        if (!isSearch) {
                            document.querySelectorAll('.game')[i].classList.add('hidden');
                        } else {
                            document.querySelectorAll('.game')[i].classList.remove('hidden');
                        }
                    }
                } else {
                    window.history.pushState({}, "", window.location.pathname);
                    for (let i = 0; i < document.querySelectorAll('.game').length; i++) {
                        document.querySelectorAll('.game')[i].classList.remove('hidden');
                    }
                }
            });

            document.querySelector('.games').innerHTML = '';
            for (let i = 0; i < games.gs.length; i++) {
                gameList.push(games.gs[i].name)
                var game = document.createElement('div');
                if (!search_query) {
                    game.classList = 'game';
                } else {
                    //if (games.gs[i].name.toLowerCase().includes(search_query.value.toLowerCase()) {
                    game.classList = 'game hidden';
                    //} else {
                    game.classList = 'game';
                    //}
                }
                game.title = games.gs[i].name
                game.innerHTML = `<img src="${games.gs[i].thumb}"/><p>${games.gs[i].name}</p>`
                document.querySelector('.games').appendChild(game);
                game.addEventListener('click', (e) => {
                    openGame(i);
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
            accountDB.on('value', function (data) {
                const accounts = data.val();
                gameDB.on('value', function (data2) {
                    const games = data2.val();
                    /*for (let i = 0; i < accounts.length; i++) {
                        var likeListDB = accounts
                        likeListDB[i].likeList = [];
                        for (let i = 0; i < games.gs.length; i++) {
                            likeListDB[i].likeList.push(false)
                        }
                        
                        console.log(likeListDB[i].likeList);
                    }*/

                    let tempDB = games;

                    var game = document.createElement('iframe');
                    game.classList = 'innerGame';
                    game.src = 'assets/public/gs/game';
                    game.title = games.gs[id].name;
                    nav.classList.add('hidden');
                    document.body.classList.add('noscroll');
                    gFrame.appendChild(game);
                    game.scrollIntoView();
                    isGameOpen = true;
                    gameId = id;
                    game.onload = function () {
                        const frame = game.contentWindow.document;
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

                        var rating = +tempDB.gs[id].rating;


                        frame.querySelector('.mainGame').src = games.gs[id].location;
                        frame.querySelector('.gameTitle').innerText = games.gs[id].name;
                        up.querySelectorAll('p').innerText = games.gs[id].rating;

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
                                rating++
                                up.querySelector('p').innerText = rating;
                            } else if (upFilled.dataset.val === 'true') {
                                upUnfilled.classList.remove('hidden');
                                upFilled.classList.add('hidden');
                                upFilled.dataset.val = 'false';
                                rating--
                                up.querySelector('p').innerText = rating;
                            }

                            if (downFilled.dataset.val === 'true') {
                                down.querySelectorAll('svg')[0].classList.remove('hidden');
                                downFilled.classList.add('hidden');
                                downFilled.dataset.val = 'false';
                            }
                            gameRating[id].rating = 1
                            //alert(codec.encode('1'))
                            /*if (down.dataset.) {
                                
                            }*/
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
                                rating--
                                up.querySelector('p').innerText = rating;
                            }

                            gameRating[id].rating = -1
                            //alert(codec.encode('0'))
                        });
                        var prevRand;

                        const recomendedGames = frame.querySelectorAll('.gameThumb');
                        for (let i = 0; i < recomendedGames.length; i++) {
                            let randomNum = Math.floor(Math.random() * games.gs.length);
                            const randGame = games.gs[randomNum];
                            if (prevRand !== randomNum || randomNum !== id) {
                                recomendedGames[i].innerHTML = `<img src="${randGame.thumb}" title="${randGame.name}"></img>`;
                            } else {
                                randomNum = Math.floor(Math.random() * games.gs.length);
                                if (prevRand !== randomNum || randomNum !== id) {
                                    recomendedGames[i].innerHTML = `<img src="${randGame.thumb}" title="${randGame.name}"></img>`;
                                } else {
                                    alert('An error occoured while trying to load the game recomendations. Please refresh to try again.');
                                    eval(error('unknown'))
                                }
                            }
                            recomendedGames[i].addEventListener('click', (e) => {
                                document.querySelector('.innerGame').remove();
                                openGame(randomNum);
                            });
                            prevRand = randomNum;
                        }
                        frame.querySelector('.logo').addEventListener('click', (e) => {
                            closeGame();
                        });
                    }
                });
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
    }
}, 100);
