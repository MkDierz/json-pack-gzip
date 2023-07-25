const {
    keys: ObjectKeys = Object.keys,
    isArray = Array.isArray,
    stringify: jsonStringify = JSON.stringify,
    parse: jsonParse = JSON.parse,
} = {
    keys: Object.keys || ((o) => {
        const keys = [];
        Object.keys(o).forEach((k) => {
            if (Object.prototype.hasOwnProperty.call(o, k)) {
                keys.push(k);
            }
        });
        return keys;
    }),
    isArray: Array.isArray || ((toString) => {
        const arrayToString = toString.call([]);
        return (o) => toString.call(o) === arrayToString;
    })({}.toString),
    stringify: JSON.stringify,
    parse: JSON.parse,
};

const arr = [];
const { concat } = arr;
const map = arr.map || ((callback, context) => {
    const self = this;
    let i = self.length;
    const result = Array(i);
    while (i > 0) {
        i -= 1;
        result[i] = callback.call(context, self[i], i, self);
    }
    return result;
});

function iteratingWith(method) {
    return function iterate(item) {
        let current = item;
        const path = this;
        const { length } = path;
        for (let i = 0; i < length; i += 1) {
            const k = path[i];
            const tmp = current[k];
            if (isArray(tmp)) {
                const j = i + 1;
                current[k] = j < length
                    ? map.call(tmp, method, path.slice(j))
                    : method(tmp);
            }
            current = current[k];
        }
        return item;
    };
}

function packOrUnpack(method) {
    return ((o, schema) => {
        const wasArray = isArray(o);
        let result = concat.call(arr, o);
        const path = concat.call(arr, schema);
        const { length } = path;
        for (let i = 0; i < length; i += 1) {
            result = map.call(result, method, path[i].split('.'));
        }
        return wasArray ? result : result[0];
    });
}

function hpack(obj) {
    if (isArray(obj)) {
        const { length } = obj;
        const keys = ObjectKeys(length ? obj[0] : {});
        const klength = keys.length;
        const result = Array(length * klength);
        let j = 0;
        for (let i = 0; i < length; i += 1) {
            const o = obj[i];
            for (let ki = 0; ki < klength; ki += 1) {
                let value = o[keys[ki]];
                if (typeof value === 'object' && value !== null) {
                    value = isArray(value) ? value.map((x) => hpack(x)) : hpack(value);
                }
                result[j] = value;
                j += 1;
            }
        }
        return concat.call([klength], keys, result);
    } if (typeof obj === 'object' && obj !== null) {
        const keys = ObjectKeys(obj);
        return keys.reduce((res, key) => {
            res[key] = isArray(obj[key]) ? hpack(obj[key]) : obj[key];
            return res;
        }, {});
    }
    return obj;
}

function hunpack(packedObj) {
    if (isArray(packedObj)) {
        const { length } = packedObj;
        const klength = packedObj[0];
        const result = Array(((length - klength - 1) / klength) || 0);
        let j = 0;
        for (let i = 1 + klength; i < length;) {
            const o = {};
            for (let ki = 0; ki < klength; ki += 1) {
                let value = packedObj[i];
                if (isArray(value)) {
                    value = value.map((item) => (isArray(item) ? hunpack(item) : item));
                } else if (typeof value === 'object' && value !== null) {
                    value = hunpack(value);
                }
                o[packedObj[ki + 1]] = value;
                i += 1;
            }
            result[j] = o;
            j += 1;
        }
        return result;
    } if (typeof packedObj === 'object' && packedObj !== null) {
        return ObjectKeys(packedObj).reduce((res, key) => {
            res[key] = isArray(packedObj[key]) ? hunpack(packedObj[key]) : packedObj[key];
            return res;
        }, {});
    }
    return packedObj;
}

const packSchema = packOrUnpack(iteratingWith(hpack));
const unpackSchema = packOrUnpack(iteratingWith(hunpack));

/**
 * Packs a list of objects into a homogeneous array, according to a schema.
 *
 * @function pack
 * @param {Object[]} list - The list of objects to pack.
 * @param {string[]} [schema] - The schema to use for packing.
 * @returns {Array} - The packed array.
 */
function pack(list, schema) {
    return schema ? packSchema(list, schema) : hpack(list);
}

/**
 * Unpacks a homogeneous array into a list of objects, according to a schema.
 *
 * @function unpack
 * @param {Array} hlist - The homogeneous array to unpack.
 * @param {string[]} [schema] - The schema to use for unpacking.
 * @returns {Object[]} - The unpacked list of objects.
 */
function unpack(hlist, schema) {
    return schema ? unpackSchema(hlist, schema) : hunpack(hlist);
}

/**
 * Packs a list of objects into a homogeneous array and then stringifies it, according to a schema.
 *
 * @function stringify
 * @param {Object[]} list - The list of objects to stringify.
 * @param {Function} [replacer] - A function that alters the behavior of the
 * stringification process.
 * @param {string|number} [space] - A String or Number object that's used to
 *  insert white space into the output JSON string for readability purposes.
 * @param {string[]} [schema] - The schema to use for packing.
 * @returns {string} - The JSON string.
 */
function stringify(list, replacer, space, schema) {
    return jsonStringify(pack(list, schema), replacer, space);
}

/**
 * Parses a JSON string into a homogeneous array
 * and then unpacks it into a list of objects, according to a schema.
 *
 * @function parse
 * @param {string} hlist - The JSON string to parse.
 * @param {Function} [reviver] - A function that prescribes how the value originally
 * produced by parsing is transformed, before being returned.
 * @param {string[]} [schema] - The schema to use for unpacking.
 * @returns {Object[]} - The parsed list of objects.
 */
function parse(hlist, reviver, schema) {
    return unpack(jsonParse(hlist, reviver), schema);
}

module.exports = {
    pack,
    parse,
    stringify,
    unpack,
};
