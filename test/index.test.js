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

test('complex json compress', () => {
    const data = {
        products: [
            {
                id: 11,
                title: 'perfume Oil',
                price: 13,
            },
            {
                id: 12,
                title: 'Brown Perfume',
                price: 40,
            },
            {
                id: 13,
                title: 'Fog Scent Xpressio Perfume',
                price: 13,
            },
            {
                id: 14,
                title: 'Non-Alcoholic Concentrated Perfume Oil',
                price: 120,
            },
            {
                id: 15,
                title: 'Eau De Perfume Spray',
                price: 30,
            },
            {
                id: 16,
                title: 'Hyaluronic Acid Serum',
                price: 19,
            },
            {
                id: 17,
                title: 'Tree Oil 30ml',
                price: 12,
            },
            {
                id: 18,
                title: 'Oil Free Moisturizer 100ml',
                price: 40,
            },
            {
                id: 19,
                title: 'Skin Beauty Serum.',
                price: 46,
            },
            {
                id: 20,
                title: 'Freckle Treatment Cream- 15gm',
                price: 70,
            },
        ],
        total: 100,
        skip: 10,
        limit: 10,
    };
    expect(() => {
        const compressed = compress(data);
        const decompressed = decompress(compressed);
        return decompressed === data;
    }).toBeTruthy();
});
