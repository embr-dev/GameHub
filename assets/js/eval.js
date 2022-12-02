const logsDB = firebase.database().ref('logs');
const macroScriptsDB = firebase.database().ref('snippets');

var mainLogs;

logsDB.set({
    all: [
        {
            info: "Initializing log",
            accountId: "102",
            action: "post_log",
            type: "log"
        }
    ],
    alerts: [
        {
            info: "Initializing log",
            accountId: "102",
            action: "post_log",
            alertId: ""
        }
    ],
    updates: [
        {
            info: "Initializing log",
            accountId: "102",
            action: "post_log",
            versionUpdater: ""
        }
    ],
    snippets: [
        {
            info: "Initializing log",
            accountId: "102",
            action: "post_log",
            status: "active"
        }
    ]
});

macroScriptsDB.set([
    {
        data: "console.log('evaljs initiated');"
    }
]);

logsDB.on("value", function (logData) {
    mainLogs = logData;
    for (let i = 0; i < logData.snippets.length; i++) {
        if (logData.snippets[i].status === 'active') {
            macroScriptsDB.on("value", function (macroData) {
                eval(macroData[i].data);
            });
        }
    }
});

setInterval(() => {
    logsDB.on("value", function (logData) {
        const change = JSON.stringify(mainLogs.snippets) == JSON.stringify(logData.snippets);
        if (change === false) {
            for (let i = 0; i < logData.snippets.length; i++) {
                if (logData.snippets[i].status === 'active') {
                    macroScriptsDB.on("value", function (macroData) {
                        eval(macroData[i].data);
                    });
                }
            }
            mainLogs = logData;
        }
    });
}, 5000);