const {User} = require('../../../models/user');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('auth middleware', function () {
    it ('should populate req.user with payload of valid JWT', function () {
        const user = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const token = new User(user).generateAuthToken();
        const req = {
            header: sinon.mock().returns(token)
        };
        const res = {};
        const next = sinon.mock();

        auth(req, res, next);

        expect(req.user).to.not.be.null;
        expect(req.user).to.include.keys(['_id','isAdmin']);
        expect(req.user._id).to.equal(user._id);
        expect(req.user.isAdmin).to.equal(user.isAdmin);
    });
});