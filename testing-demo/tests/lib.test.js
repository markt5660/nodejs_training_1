const lib = require('../lib');

describe('absolute', () => {

    it('returns positive from postive input', () => {
        const result = lib.absolute(1);
        expect(result).toBe(1);
    });
    
    it('returns positive from negative input', () => {
        const result = lib.absolute(-1);
        expect(result).toBe(1);
    });
    
    it('returns zero from zero input', () => {
        const result = lib.absolute(0);
        expect(result).toBe(0);
    });
    
});

describe('greet', () => {

    it('returns welcome message with name input', () => {
        const result = lib.greet('Mark');
        expect(result).toMatch(/Mark/);
        expect(result).toContain('Mark');
    });

});

describe('getCurrencies', () => {

    it('returns supported currencies', () => {
        const result = lib.getCurrencies();
        expect(result).toEqual(expect.arrayContaining(['AUD','EUR','USD']));
    });

});

describe('getProduct', () => {

    it('returns product with given ID', () => {
        const result = lib.getProduct(1);
//      expect(result).toEqual({ id: 1, price: 10 });  // too specific
        expect(result).toMatchObject({ id: 1 });
        expect(result).toMatchObject({ price: 10 });
        expect(result).toHaveProperty('id', 1);
    });

});