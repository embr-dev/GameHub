function log_() {
    (this.push = function (data, logPath) {
        var path = logPath.split("/").join(".");
        alert(path);
        return data;
    }),
        (this.get = function (logPath) {
            var path = logPath
                .split("/")
                .join(".")
                .replace(/[0-9]/g, logPath.match(/(\d+)/)[0] - 1);
            return eval("mainLogs" + path);
        });
}

function tab_() {
    (this.reload = function () {
        location.reload();
        
    }),
        (this.redirect = function (url) {
            window.location.href = url;
            
        }),
        (this.open = function (url, width, height) {
            if (url) {
                if (!width || !height) {
                    return window.open(url);
                } else if (width && height) {
                    return window.open(url, "popup", `width=${width}, height=${height}`);
                }
            } else {
                console.error('Target Url is not defined\n\npage.open("url")');
            }
        });
}

function localStorage_() {
    for (let [key, value] of Object.entries(localStorage)) {
        //eval('(this.${key.replace(/[^a-zA-Z ]/g, "_")} = ${value})')
    }
    
    (this.clear = function () {
        localStorage.clear();
    }),
        (this.remove = function (itemName) {
            if (itemName) {
                localStorage.remove(itemName);
            } else {
                console.error('item name is not defined\n\nls.remove(item name)')
            }
        });
}

function audio_() {
    this.data;
    (this.load = function (url, loop) {
        if (url) {
            if (!this.data) {
                this.data = new Audio(url);
                if (loop) {
                    this.data.loop = true;
                }
                return new Audio(url);
            } else {
                audio.pause();
                this.data = new Audio(url);
                if (loop) {
                    this.data.loop = true;
                }
                return new Audio(url);
            }
        } else {
            console.error('"audio url" is not defined\n\naudio.load("audio url")');
        }
    }),
        (this.play = function (time) {
            if (this.data) {
                if (time) {
                    this.data.currentTime = time;
                }
                this.data.play();
            } else {
                console.error('"audio" is not defined\n\naudio.load("audio url")');
            }
        }),
        (this.pause = function () {
            if (this.data) {
                if (this.data.paused === false) {
                    this.data.pause();
                } else {
                    console.warn('"audio" is not playing\n\naudio.play()');
                }
            } else {
                console.error('"audio" is not defined\n\naudio.load("audio url")');
            }
        }),
        (this.clear = function () {
            if (this.data) {
                if (this.data.paused) {
                    this.data = null;
                } else {
                    audio.pause();
                    this.data = null;
                }
            } else {
                console.warn('"audio" cannot be cleared\nno data\n\naudio.load()');
            }
        });
}

function page_() {
    (this.el = function (element) {
        return document.querySelector(element);
    }),
        (this.create = function (data) {
            var el = document.createElement(data.type);
            el.innerHTML = data.html;
            el.style = data.style;
            return eval(data.parent + ".appendChild(el)");
        }),
        (this.body = document.body),
        this.self = document.documentElement;
}

function say(text) {
    if (text) {
        alert(text);
    } else {
        console.error('"text" is not defined\n\nsay("text")');
    }
}

function ask(text, type) {
    if (text) {
        if (type === "text") {
            return prompt(text);
        } else if (type === "yes/no") {
            return confirm(text);
        } else if (!type) {
            console.error('"type" is not defined\n\nask("text", "type")');
        } else {
            console.error(`${type} is not a message type\n\nask("text", "type")`);
        }
    } else {
        console.error('"text" is not defined\n\nask("text")');
    }
}

function log(text) {
    console.log('text');
}

function warn(text) {
    console.warn('text');
}

function err(text) {
    console.error(text);
}

const logs = new log_();
const tab = new tab_();
const audio = new audio_();
const page = new page_();
const ls = new localStorage_();
const db = new database_();