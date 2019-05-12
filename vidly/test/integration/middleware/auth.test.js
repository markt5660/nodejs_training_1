const req = require('supertest');
const {Genre} = require('../../../models/genre');
const {User} = require('../../../models/user');
const expect = require('chai').expect;

describe ('auth middleware', function () {

    let server;
    let token;

    beforeEach(function () {
        server = require('../../../index');
        token = new User().generateAuthToken();
    });

    afterEach(async function () {
        await Genre.deleteMany({});
        await server.close();
    });

    // Normal (happy path) function
    const exec = function () {
        return req(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    };


    it ('should return 401 if no token is provided', async function () {
        token = ''; // Overrided default empty token

        const res = await exec();

        expect(res.status).to.eql(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = 'a'; // Override default with invalid token

        const res = await exec();

        expect(res.status).to.eql(400);
    });

    it('should return 200 if token is valid', async () => {
        // Default (happy path) configuration

        const res = await exec();

        expect(res.status).to.eql(200);
    });

});