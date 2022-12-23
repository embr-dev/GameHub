window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    alert('Error: ' + errorMsg + '\n\nUrl: ' + url + '\n\nLine:' + lineNumber);
    return false;
}

async function apiPost(route = '', data = {}, resType) {
    if (route && data && resType) {
        const response = await fetch('https://api.retronetwork.ml/GameHub' + route, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });

        if (resType == 'json') {
            return response.json();
        } else if (resType == 'text') {
            return response.text();
        } else {
            return 'invalid response type';
        }
    } else {
        return 'invalid parameters';
    }
}

async function apiGet(route = '', resType) {
    if (route && resType) {
        const response = await fetch('https://api.retronetwork.ml/GameHub' + route, {
            method: method.toUpperCase(),
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });

        if (resType == 'json') {
            return response.json();
        } else if (resType == 'text') {
            return response.text();
        } else {
            return 'invalid response type.';
            console.error('invalid response type')
        }
    }
}