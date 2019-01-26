const lib = require('../lib');
const db = require('../db');

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

describe('registerUser', () => {

    it('throws when userName is "falsey"', () => {
        // Test all "falsey" values
        const testArgs = [null, undefined, NaN, '', 0, false];
        testArgs.forEach(arg => {
            expect(() => { lib.registerUser(arg); }).toThrow();
        });
    });

    it('returns user object for valid username', () => {
        const result = lib.registerUser('Mark');
        expect(result).toMatchObject({ username: 'Mark' });
        expect(result.id).toBeGreaterThan(0);
    });

});

describe('applyDiscount', () => {

    it('applies 10% discount if customer with ID has > 10 points', () => {
        // Mock the DB call for this test
        db.getCustomerSync = function(customerId) {
            console.log('applyDiscount db.getCustomer() mock');
            return { id: customerId, points: 12 };
        };

        // Run the test using the mocked DB call
        const order = { customerId: 1, totalPrice: 10 };
        lib.applyDiscount(order);
        expect(order.totalPrice).toBe(9);
    });

});