const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');

let server;

describe('auth middleware', () => {
    beforeEach(() => { 
        server = require('../../index'); 
    });

    afterEach(async () => {
        await Genre.deleteMany({}); // replaces Genre.remove() - deprecated
        server.close();
    });

    let token;

    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    };

    beforeEach(() => { 
        token = new User().generateAuthToken();
    });

    it('should return 401 if no token is provided', async () => {
        token = ''; // Override default with empty token

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = 'a'; // Override default with invalid token

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        // Default (happy path) configuration

        const res = await exec();

        expect(res.status).toBe(200);
    });
});