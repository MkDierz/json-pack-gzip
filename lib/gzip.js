const { gzipSync, gunzipSync } = require('node:zlib');

/**
 * Compresses a JSON object using Gzip compression algorithm.
 *
 * @param {string} string - The JSON object to be compressed.
 * @returns {Buffer} - The compressed data as a Buffer object.
 */
function gzip(string) {
    const bufferOriginal = Buffer.from(string, 'utf-8');
    return gzipSync(bufferOriginal);
}

/**
   * Decompresses a Buffer object to a JSON object using Gzip decompression algorithm.
   *
   * @param {Buffer} buffer - The Buffer object to be decompressed.
   * @returns {string} - The decompressed JSON object as a string.
   */
function gunzip(buffer) {
    const bufferDecompressed = gunzipSync(buffer);
    return bufferDecompressed.toString('utf-8');
}

module.exports = {
    gzip,
    gunzip,
};
