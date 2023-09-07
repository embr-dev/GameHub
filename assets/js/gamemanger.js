import { registerError } from './notification.js';
import API from './api.js';

const nav = document.querySelector('.navbar');
const searchContainer = document.querySelector('.database_nav');

window.onscroll = () => {
    if (window.pageYOffset > document.querySelector('.hero').offsetHeight) searchContainer.classList.add('shadowed');
    else searchContainer.classList.remove('shadowed');
};

API.get('/games').then(games => {
    const searchBar = document.querySelector('[data-func="search"]');

    searchBar.placeholder = `Search ${games.length} games`;

    searchBar.addEventListener('input', (e) => {
        if (searchBar.value) {
            var result = false;

            document.querySelectorAll('.game').forEach(game => {
                if (game.title.toLowerCase().includes(searchBar.value.toLowerCase())) {
                    result = true;

                    game.classList.remove('hidden');
                }
                else game.classList.add('hidden');
            });

            if (result) document.querySelector('.searchErr').classList.add('hidden');
            else document.querySelector('.searchErr').classList.remove('hidden');
        } else {
            document.querySelectorAll('.game').forEach(game => game.classList.remove('hidden'));
            document.querySelector('.searchErr').classList.add('hidden');
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
            registerError(`Could not load splash image for ${e.target.parentElement.title}`);
            e.target.src = '/assets/img/logo.png';
        }

        gameEl.addEventListener('click', (e) => openGame(game.id));
    });

    searchBar.focus();
}).catch(e => registerError('Could not load games'));

const openGame = (id) => {
    const gameFrame = document.querySelector('.gameFrame');
    const gameDatabase = document.querySelector('.games');

    gameFrame.classList.remove('hidden');
    gameDatabase.classList.add('hidden');
    document.querySelector('.database_nav').classList.add('hidden');

    API.get(`/games/${id}`)
        .then(game => {
            nav.classList.add('hidden');
            document.body.classList.add('noscroll');
            document.documentElement.classList.add('noscroll');

            if (game.use === 'emulator') game.url = `/assets/public/gs/emulator.html?file=${game.url}&core=${game.emulatorConfig.core}&id=${id}`;
            else if (game.use === 'gameframe') {
                
            }

            const gameEl = document.createElement('iframe');
            gameEl.classList = 'innerGame';
            gameEl.src = '/assets/public/gs/game.html';
            gameEl.title = game.name;
            gameFrame.appendChild(gameEl);

            gameEl.scrollIntoView();

            gameEl.onload = () => {
                alert('game loaded');
                const frame = gameEl.contentWindow.document;
                const commentContainer = frame.querySelector('.commentContainer');
                const commentsToggle = frame.querySelector('[data-func="open-comments"]');

                frame.querySelector('.mainGame').src = game.url;
                frame.querySelector('.mainGame').onload = () => setTimeout(() => {
                    frame.querySelectorAll('.mainGame')[1].classList.add('hidden');
                    frame.querySelector('.mainGame').classList.remove('hidden');
                }, 1000);
                frame.querySelector('.gameTitle').innerText = game.name;

                frame.querySelector('[data-attr="fullscreen"]').addEventListener('click', (e) => frame.querySelector('.mainGame').requestFullscreen());

                /*const commentFrame = frame.createElement('iframe');
                commentFrame.src = `/assets/public/pages/comments.html?id=${id}`;
                commentFrame.classList = 'commentFrame';
                commentFrame.setAttribute('frameborder', '0');
                commentContainer.appendChild(commentFrame);

                commentsToggle.addEventListener('click', (e) => commentContainer.classList.remove('hidden'));*/

                API.get(`/games/${id}/recomended`)
                    .then(recomendations => {
                        const recomendedGames = frame.querySelectorAll('.gameThumb');

                        for (let i = 0; i < recomendations.length; i++) {
                            recomendedGames[i].innerHTML = `<img src="${recomendations[i].thumbnail}" title="${recomendations[i].name}" />`;

                            recomendedGames[i].querySelector('img').onerror = (e) => {
                                e.target.src = '/assets/img/logo.png';
                            }

                            recomendedGames[i].addEventListener('click', (e) => {
                                document.querySelector('.innerGame').remove();
                                openGame(recomendations[i].id);
                            });
                        }
                    }).catch(e => registerError('Could not load recomended games'));

                frame.querySelector('.logo').addEventListener('click', (e) => closeGame());
                frame.querySelector('#back').addEventListener('click', (e) => closeGame());
            }
        }).catch(e => registerError(`Could not load game #${id}`));
}

const closeGame = () => {
    const gameFrame = document.querySelector('.gameFrame');
    const gameDatabase = document.querySelector('.games');

    nav.classList.remove('hidden');
    document.body.classList.remove('noscroll');
    document.documentElement.classList.remove('noscroll');

    gameFrame.classList.add('hidden');
    gameDatabase.classList.remove('hidden');

    document.querySelector('.innerGame').remove();
    document.querySelector('.database_nav').classList.remove('hidden');

    gameDatabase.scrollIntoView();
}

window.onresize = () => document.querySelector('.gameFrame').scrollIntoView();
