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
