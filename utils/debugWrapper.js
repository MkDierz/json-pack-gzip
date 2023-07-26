const { calculateSize } = require('./calculateSize');
const { compressionRatio } = require('./compressionRatio');
const { createDebugLog } = require('./createDebugLog');

function debugWrapper(namespace) {
    function startDebug() {
        performance.mark(`${namespace}:start`);
    }

    function endDebug(startProduct, endProduct) {
        performance.mark(`${namespace}:end`);
        performance.measure(namespace, `${namespace}:start`, `${namespace}:end`);
        const time = performance.getEntriesByName(namespace)[0].duration;
        performance.clearMarks();
        performance.clearMeasures();
        const startSize = calculateSize(startProduct);
        const endSize = calculateSize(endProduct);
        const [difference, ratio] = compressionRatio(startSize, endSize);
        createDebugLog(namespace, 'size', `${ratio}% - ${difference}`);
        createDebugLog(namespace, 'time', time);
    }

    function errorDebug(error) {
        performance.clearMarks();
        performance.clearMeasures();
        createDebugLog(namespace, 'error', error);
        throw error;
    }
    return [startDebug, endDebug, errorDebug];
}

exports.debugWrapper = debugWrapper;
