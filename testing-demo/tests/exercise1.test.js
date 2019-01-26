const exercise1 = require('../exercise1');

describe ('fizzBuzz', () => {

    it('throws when input is not a number', () => {
        expect(() => { exercise1.fizzBuzz('Mark'); }).toThrow();
        expect(() => { exercise1.fizzBuzz(null); }).toThrow();
        expect(() => { exercise1.fizzBuzz(undefined); }).toThrow();
        expect(() => { exercise1.fizzBuzz({}); }).toThrow();
    });

    it('returns "FizzBuzz" when input is divisible by both 3 and 5', () => {
        const result = exercise1.fizzBuzz(15);
        expect(result).toEqual('FizzBuzz');
    });

    it('returns "Fizz" when input is divisible by 3 and not 5', () => {
        const result = exercise1.fizzBuzz(21);
        expect(result).toEqual('Fizz');

    });

    it('returns "Buzz" when input is divisible by 5 and not 3', () => {
        const result = exercise1.fizzBuzz(20);
        expect(result).toEqual('Buzz');
    });

    it('returns input when input is not divisible by 3 or 5', () => {
        const result = exercise1.fizzBuzz(7);
        expect(result).toEqual(7);
    });

});