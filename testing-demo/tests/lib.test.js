const lib = require('../lib');

test('absolute - positive return from postive number', () => {
    const result = lib.absolute(1);
    expect(result).toBe(1);
});

test('absolute - positive return from negative number', () => {
    const result = lib.absolute(-1);
    expect(result).toBe(1);
});

test('absolute - zero return from zero', () => {
    const result = lib.absolute(0);
    expect(result).toBe(0);
});