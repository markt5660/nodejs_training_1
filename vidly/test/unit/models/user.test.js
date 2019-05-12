const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe ('generateAuthToken', function () {
    it ('should return a valid JWT', function () {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };

        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        expect(decoded).to.not.be.null;
        expect(decoded).to.include({ _id: payload._id });
        expect(decoded).to.include({ isAdmin: payload.isAdmin });
    });
});