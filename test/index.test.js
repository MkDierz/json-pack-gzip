const {
    calculateSize,
    compress,
    decompress,
    pack,
    unpack,
    parse,
    stringify,
    gzip,
    gunzip,
} = require('../index');

test('calculateSize returns the correct byte length', () => {
    const str = 'hello, world';
    const arr = [1, 2, 3];
    const obj = { foo: 'bar' };
    const buffer = Buffer.from('hello, world');

    expect(calculateSize(str)).toBe(12);
    expect(calculateSize(arr)).toBe(7);
    expect(calculateSize(obj)).toBe(13);
    expect(calculateSize(buffer)).toBe(12);
});

test('compress and decompress work correctly', () => {
    const jsonObject = [{ foo: 'bar' }, { foo: 'qux' }];
    const compressed = compress(jsonObject);
    const decompressed = decompress(compressed);

    expect(decompressed).toEqual(jsonObject);
});

test('pack and unpack work correctly', () => {
    const jsonArray = [{ foo: 'bar' }, { foo: 'qux' }];
    const packed = pack(jsonArray);
    const unpacked = unpack(packed);

    expect(unpacked).toEqual(jsonArray);
});

test('parse and stringify work correctly', () => {
    const jsonArray = [{ foo: 'bar' }, { foo: 'qux' }];
    const stringified = stringify(jsonArray);
    const parsed = parse(stringified);

    expect(parsed).toEqual(jsonArray);
});

test('gzip and gunzip work correctly', () => {
    const bufferOriginal = Buffer.from('hello, world', 'utf-8');
    const gzipped = gzip(bufferOriginal);
    const gunzipped = gunzip(gzipped);

    expect(gunzipped.toString()).toEqual(bufferOriginal.toString());
});
