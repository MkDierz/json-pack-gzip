const {
    decompress, gunzip, gzip, compress,
} = require('..');
const { unpack, pack } = require('../lib/hpack');

function compressResponse(json) {
    if (typeof (json) === 'object') {
        const compressed = compress(json, true);
        return compressed;
    }
    return json;
}

function packResponse(json) {
    if (typeof (json) === 'object') {
        const compressed = pack(json, false, true);
        return compressed;
    }
    return json;
}

function gzipResponse(json) {
    if (typeof (json) === 'object') {
        const compressed = gzip(JSON.stringify(json), true);
        return compressed;
    }
    return json;
}

async function middleware(req, res, next) {
    const requestCompressed = req.headers['compressed-request'] || 'none';
    const responseCompressed = req.headers['compressed-response'] || 'none';

    switch (requestCompressed) {
        case 'full':
            req.body = decompress(req.body, true);
            break;

        case 'hpack':
            req.body = unpack(req.body, false, true);
            break;

        case 'gzip':
            req.body = JSON.parse(gunzip(req.body), true);
            break;

        default:
            break;
    }

    if (responseCompressed === 'none') {
        return next();
    }

    const originalSend = res.send;

    function newSendFunction() {
        return (...args) => {
            const newArgs = args;
            switch (responseCompressed) {
                case 'full':
                    newArgs[0] = compressResponse(newArgs[0]);
                    break;

                case 'hpack':
                    newArgs[0] = packResponse(newArgs[0]);
                    break;

                case 'gzip':
                    newArgs[0] = gzipResponse(newArgs[0]);
                    break;

                default:
                    break;
            }
            originalSend.apply(res, newArgs);
        };
    }

    res.set('Compressed-Request', responseCompressed);
    res.set('Compressed-Response', responseCompressed);

    res.send = newSendFunction();
    return next();
}

exports.middleware = middleware;
