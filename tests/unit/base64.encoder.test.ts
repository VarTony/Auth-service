import { toBase64, toBase64Url } from "@token/constant";

describe('Test of base64 encoder`s functions', () => {

    test('String to base64', () => {
        expect(toBase64('')).toBe('');
        expect(toBase64('')).toHaveLength(0);

        expect(toBase64('One Two Three')).toBe('T25lIFR3byBUaHJlZQ==');
        expect(toBase64('One Two Three')).toHaveLength(20);

        expect(toBase64('123450000000000000012345')).toBe('MTIzNDUwMDAwMDAwMDAwMDAwMDEyMzQ1');
        expect(toBase64('123450000000000000012345')).toHaveLength(32);
    });


    test('Object to base64', () => {
        expect(toBase64({})).toBe('e30=');
        expect(toBase64({})).toHaveLength(4);

        expect(toBase64({ y: x => x })).toBe('e30=');
        expect(toBase64({ y: x => x })).toHaveLength(4);

        expect(toBase64({ a: 150, b: 'bbbb' })).toBe('eyJhIjoxNTAsImIiOiJiYmJiIn0=');
        expect(toBase64({ a: 150, b: 'bbbb' })).toHaveLength(28);

        expect(toBase64({ y: (x) => x, z: [1,2,3,4,5] })).toBe('eyJ6IjpbMSwyLDMsNCw1XX0=');
        expect(toBase64({ y: (x) => x, z: [1,2,3,4,5] })).toHaveLength(24);
    });
});