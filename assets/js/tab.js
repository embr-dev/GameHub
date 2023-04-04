const filename = location.pathname.substring(location.pathname.lastIndexOf("/") + 1)
const isIndex = filename === 'index.html' || filename === 'index'
const isHTML = filename.includes('.html')
if (isIndex) {
    window.location.href = window.location.href.replace('/' + filename, '');
} else {
    if (isHTML) {
        window.location.href = window.location.href.replace('.html', '');
    }
}

fetch('/assets/JSON/pages.json')
    .then(res => res.json())
    .then((pages) => {
        const isLogin = cookie.get('loginsession') === 'true';
        const isMain = pages.main.includes(window.location.pathname);
        const isOther = pages.other.includes(window.location.pathname);
        
        if (!isMain && !isLogin ) {
            window.location.href = '/login';
            loaded++
        }

        if (isMain && isLogin && !isOther) {
            window.location.href = '/home';
            loaded++
        }

        if (isMain && !isLogin) {
            loaded++
        }

        if (!pages.all.includes(window.location.pathname)) {
            error('404');
            loaded++
        }

        if (isOther) {
            loaded++
        }
    });