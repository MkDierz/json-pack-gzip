const debug = require('debug');

function createDebugLog(debugNamespace, type, data) {
    const debugLog = debug(`${debugNamespace}:${type}`);
    debugLog(data);
}
exports.createDebugLog = createDebugLog;
