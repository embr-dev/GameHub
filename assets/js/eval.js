/*const logsDB = database.ref('logs');
const macroScriptsDB = database.ref('snippets');

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

logsDB.on("value", function (data) {
    const logs = data.val();

    mainLogs = logs;
    for (let i = 0; i < logs.snippets.length; i++) {
        if (logs.snippets[i].status === 'active') {
            macroScriptsDB.on("value", function (data2) {
                const macros = data2.val();

                //eval(macros[i].data);
            });
        }
    }
});

setInterval(() => {
    logsDB.on("value", function (data) {
        const logs = data.val();

        const change = JSON.stringify(mainLogs.snippets) == JSON.stringify(logs.snippets);
        if (change === false) {
            for (let i = 0; i < logs.snippets.length; i++) {
                if (logs.snippets[i].status === 'active') {
                    macroScriptsDB.on("value", function (data2) {
                        const macros = data2.val();

                        //eval(macros[i].data);
                    });
                }
            }
            mainLogs = logs;
        }
    });
}, 5000);*/