window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    alert('Error: ' + errorMsg + '\n\nUrl: ' + url + '\n\nLine:' + lineNumber);
    return false;
}

async function api(route = '', data = {}, method, reqType, resType) {
    if (method == 'get') {
        if (route && method && resType) {
            const response = await fetch('https://api.retronetwork.ml/GameHub' + route, {
                method: method.toUpperCase(),
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': reqType
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: function () {
                    if (resType == 'json') {
                        JSON.stringify(data)
                    }
                }
            });

            if (resType == 'json') {
                return response.json();
            } else if (resType == 'text') {
                return response.json();
            } else {
                return 'invalid response type.';
            }
        }
    } else if (method == 'post') {
        if (route && data && method && reqType && resType) {
            const response = await fetch('https://api.retronetwork.ml/GameHub' + route, {
                method: method.toUpperCase(),
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': reqType
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: function () {
                    if (resType == 'json') {
                        return JSON.stringify(data);
                    } else {
                        return data;
                    }
                }
            });

            if (resType == 'json') {
                return response.json();
            } else if (resType == 'text') {
                return response.text();
            } else {
                return 'invalid response type.';
            }
        } else {
            return 'invalid parameters';
        }
    }
}