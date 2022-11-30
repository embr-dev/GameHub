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
    .then(function(resp) {
        return resp.json();
    })
    .then(function(pages) {
        const isLogin = localStorage.getItem('isLogin');
        const isMain = pages.main.includes(window.location.pathname);
        
        if (!isMain && !isLogin) {
            window.location.href = '/login';
            loaded++
        }
        if (isMain && isLogin) {
            window.location.href = '/home';
            loaded++
        }
        if (isMain && !isLogin) {
            loaded++
        }
    });