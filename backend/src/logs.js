const logs = [];
const MAX_LOGS = 100;

function addLog(entry) {
    if (logs.length >= MAX_LOGS) {
        logs.shift();
    }
    logs.push(entry);
}

function getLogs() {
    return logs;
}

function clearLogs() {
    logs.length = 0;
}

module.exports = { addLog, getLogs, clearLogs };