const { gunzip, gzip } = require('./lib/gzip');
const {
    pack, unpack, parse, stringify,
} = require('./lib/hpack');

/**
 * Calculate the byte length of the input data.
 * It supports data types: String, Buffer, Array, and Object.
 * For non-buffer objects, the function first stringifies them before calculating the size.
 *
 * @param {String|Buffer|Object|Array} data - The data to be size-calculated.
 * @returns {Number} The byte length of the input data.
 */
function calculateSize(data) {
    if (typeof data === 'string' || data instanceof String || data instanceof Buffer) {
        return Buffer.byteLength(data);
    }

    if (typeof data === 'object') {
        return Buffer.byteLength(JSON.stringify(data));
    }
    return 0;
}
/**
 * Compresses a JSON object using Gzip compression algorithm after first packing it into
 * a homogeneous array and stringifying it.
 *
 * @function compress
 * @param {Object[]} jsonObject - The JSON object to be compressed.
 * @returns {Buffer} - The compressed data as a Buffer object.
 */
function compress(jsonObject) {
    const hPacked = stringify(jsonObject);
    const bufferOriginal = Buffer.from(hPacked, 'utf-8');
    const gzipped = gzip(bufferOriginal);
    return gzipped;
}

/**
 * Decompresses a Buffer object to a JSON object using Gzip decompression algorithm,
 * after first parsing it from a homogeneous array into a list of objects.
 *
 * @function decompress
 * @param {Buffer} jsonBuffer - The Buffer object to be decompressed.
 * @returns {Object[]} - The decompressed and unpacked JSON object as a list of objects.
 */
function decompress(jsonBuffer) {
    const bufferDecompressed = gunzip(jsonBuffer);
    const jsonUnpacked = parse(bufferDecompressed);
    return jsonUnpacked;
}

module.exports = {
    compress,
    decompress,
    pack,
    unpack,
    parse,
    stringify,
    gzip,
    gunzip,
    calculateSize,
};
