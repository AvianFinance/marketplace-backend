const {Worker} = require("worker_threads");

const listner_worker = new Worker(__dirname + "/listner-worker.js",{workerData: "hello listner"});

const db_worker = new Worker(__dirname + "/db-worker.js",{workerData: "hello db"});

listner_worker.on("message", msg => {
    db_worker.postMessage(msg)
});
