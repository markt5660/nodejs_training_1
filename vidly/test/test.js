var expect = require('chai').expect;

describe('Array', function () {
    describe('#indexOf()', function () {
        it ('should return 01 when value is not present', function () {
            expect([1,2,3].indexOf(4)).to.equal(-1);
        });
    });
});