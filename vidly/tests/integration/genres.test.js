const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/genres', () => {
    beforeEach(() => { 
        server = require('../../index'); 
    });

    afterEach(async () => { 
        await Genre.deleteMany({}); // replaces Genre.remove() - deprecated
        await server.close();
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

        it('should return a 404 if no genre found for given ID', async () => {
            // No special setup, empty document store preferred
            const id = mongoose.Types.ObjectId();

            const resp = await request(server).get('/api/genres/' + id);

            expect(resp.status).toBe(404);
        });
    });

    describe('POST /', () => {
        let token;
        let gName;

        // Default 'Happy Path' execution
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

    describe('PUT /:id', () => {
        let id;
        let token;
        let newName;

        // Default 'Happy Path' execution
        const exec = async () => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({ name: newName });
        };

        beforeEach(async () => {
            // Create genre entry that will be updated
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            id = genre._id;
            token = new User().generateAuthToken();
            newName = 'genreNew';
        });

        it('should return 401 if client not logged in', async () => {
            token = ''; // override default creation of valid token

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre < 5 chars', async () => {
            newName = '1234'; // override default genre name

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre > 50 chars', async () => {
            newName = new Array(52).join('a'); // override default genre name

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return a 404 if invalid id is passed', async () => {
            id = 1;

            const res = await exec();

            expect(res.status).toBe(500);
        });

        it('should return a 404 if no genre found for given ID', async () => {
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should save the new genre if valid', async () => {
            const res = await exec();

            const genre = await Genre.find({ name: newName });
            expect(genre).not.toBeNull();
        });

        it('should return the new genre if valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', newName);
        });
    });

    describe('DELETE /:id', () => {
        let id;
        let token;
        let gName;

        // Default 'Happy Path' execution
        const exec = async () => {
            return await request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token);
        };

        beforeEach(async () => {
            // Create genre entry that will be updated
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            id = genre._id;
            token = new User({ isAdmin: true }).generateAuthToken();
            gName = 'genre1';
        });

        it('should return 401 if client not logged in', async () => {
            token = ''; // override default creation of valid token

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return a 404 if invalid id is passed', async () => {
            id = 1;

            const res = await exec();

            expect(res.status).toBe(500);
        });

        it('should remove the new genre if valid', async () => {
            const res = await exec();

            const genre = await Genre.findById(id);
            expect(genre).toBeNull();
        });

        it('should return the new genre if valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', gName);
        });

    });
});