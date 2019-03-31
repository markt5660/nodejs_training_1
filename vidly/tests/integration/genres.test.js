const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');

let server;

describe('/api/genres', () => {
    beforeEach(() => { 
        server = require('../../index'); 
    });

    afterEach(async () => { 
        server.close();
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);
    
            const resp = await request(server).get('/api/genres');

            expect(resp.status).toBe(200);
            expect(resp.body.length).toBe(2);
            expect(resp.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(resp.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const resp = await request(server).get('/api/genres/' + genre._id);

            expect(resp.status).toBe(200);
            expect(resp.body).toHaveProperty('name', genre.name);
        });

        it('should return a 404 if invalid id is passed', async () => {
            // No special setup, empty document store preferred

            const resp = await request(server).get('/api/genres/1');

            expect(resp.status).toBe(404);
        });
    });

    describe('POST /', () => {
        let token;
        let gName;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: gName });
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
            gName = 'genre1';
        });

        it('should return 401 if client not logged in', async () => {
            token = ''; // override default creation of valid token

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre < 5 chars', async () => {
            gName = '1234'; // override default genre name

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre > 50 chars', async () => {
            gName = new Array(52).join('a'); // override default genre name

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the new genre if valid', async () => {
            const res = await exec();

            const genre = await Genre.find({ name: 'genre1' });
            expect(genre).not.toBeNull();
        });

        it('should return the new genre if valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
});