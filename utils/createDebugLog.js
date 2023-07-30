const debug = require('debug');

function createDebugLog(debugNamespace, type, data) {
    const debugLog = debug(`jpg:${debugNamespace}:${type}`);
    debugLog(data);
}
exports.createDebugLog = createDebugLog;
