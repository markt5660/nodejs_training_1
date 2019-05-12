const req = require('supertest');
const {Genre} = require('../../../models/genre');
const {User} = require('../../../models/user');
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe('/api/genres', function () {

    let server;

    beforeEach (function () {
        server = require('../../../index');
    });

    afterEach (async function () {
        await Genre.deleteMany();
        await server.close();
    });

    describe('GET /', function () {
        it('should return all genres', async function () {
            // Setup specific genres to retrieve
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            const res = await req(server).get('/api/genres');

            expect(res).to.not.be.null;
            expect(res.status).to.be.eql(200);
        });
    });

    describe('GET /:id', function () {
        it('should return a genre if valid ID is passed', async function () {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await req(server).get('/api/genres/' + genre._id);

            expect(res).to.not.be.null;
            expect(res.status).to.be.eql(200);
            expect(res.body).to.have.property('name', 'genre1');
        });

        it('should return a 404 if invalid ID is passed', async function () {
            // No special setup, empty document store is preferred

            const res = await req(server).get('/api/genres/1');

            expect(res).to.not.be.null;
            expect(res.status).to.be.eql(404);
        });

        it('should return a 404 if no genre was found for given ID', async function () {
            // No special setup, empty document store is needed
            const id = mongoose.Types.ObjectId();

            const res = await req(server).get('/api/genres/' + id);

            expect(res).to.not.be.null;
            expect(res.status).to.be.eql(404);
        });
    });

    describe ('POST /', function () {
        let token;
        let gName;

        // Default 'happy path' execution
        const exec = async function () {
            return await req(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: gName });
        };

        beforeEach (function () {
            token = new User().generateAuthToken();
            gName = 'genre1';
        });

        it('should return 401 if client not logged in', async function () {
            token = ''; // override default creation of valid token

            const res = await exec();

            expect(res).to.not.be.null;
            expect(res.status).to.be.eql(401);
        });

        it('should return 400 if genre < 5 chars', async function () {
            gName = '1234'; // override default genre name

            const res = await exec();

            expect(res).to.not.be.null;
            expect(res.status).to.be.eql(400);
        });

        it('should return 400 if genre > 50 chars', async function () {
            gName = new Array(52).join('a');  // override default genre name

            const res = await exec();

            expect(res).to.not.be.null;
            expect(res.status).to.be.eql(400);
        });

        it ('should save the new genre if valid', async function () {
            // No special setup

            const res = await exec();

            const genre = await Genre.find({ nane: 'genre1' });
            expect(genre).to.not.be.null;
        });

        it ('should return the new genre if valid', async function () {
            // No special setup

            const res = await exec();

            expect(res).to.not.be.null;
            expect(res.body).to.have.property('_id');
            expect(res.body).to.have.property('name', 'genre1');
        });
    });

    describe ('PUT /:id', function () {
        let id;
        let token;
        let newName;

        // Default 'happy path' execution
        const exec = async function () {
            return await req(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({ name: newName });
        };

        beforeEach(async function () {
            // Create genre entry that will be updated
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            id = genre._id;
            token = new User().generateAuthToken();
            newName = 'genreNew';
        });

        it ('should return 401 if client not logged in', async function () {
            token = ''; // override default creation of valid token

            const res = await exec();

            expect(res).to.not.be.null;
            expect(res.status).to.be.eql(401);
        });

        it('should return 400 if genre < 5 chars', async function () {
            newName = '1234'; // override default genre name

            const res = await exec();

            expect(res).to.not.be.null;
            expect(res.status).to.be.eql(400);
        });

        it('should return 400 if genre > 50 chars', async function () {
            newName = new Array(52).join('a');  // override default genre name

            const res = await exec();

            expect(res).to.not.be.null;
            expect(res.status).to.be.eql(400);
        });

        it('should return a 404 if invalid id is passed', async () => {
            id = 1; // override valid ID

            const res = await exec();

            expect(res).to.not.be.null;
            expect(res.status).to.be.eql(404);
        });

        it('should return a 404 if no genre found for given ID', async () => {
            id = mongoose.Types.ObjectId(); // override existing genre ID

            const res = await exec();

            expect(res).to.not.be.null;
            expect(res.status).to.be.eql(404);
        });

        it('should save the new genre if valid', async () => {
            // No special setup

            const res = await exec();

            const genre = await Genre.find({ name: newName });
            expect(genre).to.not.be.null;
        });

        it('should return the new genre if valid', async () => {
            // No special setup

            const res = await exec();

            expect(res.body).to.have.property('_id');
            expect(res.body).to.have.property('name', newName);
        });
    });

    describe('DELETE /:id', function () {
        let id;
        let token;
        let gName;

        // Default 'happy path' execution
        const exec = async function () {
            return await req(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token);
        };

        beforeEach(async () => {
            // Create genre entry that will be deleted
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            id = genre._id;
            token = new User({ isAdmin: true }).generateAuthToken();
            gName = 'genre1';
        });

        it('should return 401 if client not logged in', async () => {
            token = ''; // override default creation of valid token

            const res = await exec();

            expect(res).to.not.be.null;
            expect(res.status).to.be.eql(401);
        });

        it('should return a 404 if invalid id is passed', async () => {
            id = 1; // override valid ID

            const res = await exec();

            expect(res).to.not.be.null;
            expect(res.status).to.be.eql(404);
        });

        it('should remove the new genre if valid', async () => {
            const res = await exec();

            const genre = await Genre.findById(id);
            expect(genre).to.be.null;
        });

        it('should return the deleted genre if valid', async () => {
            const res = await exec();

            expect(res.body).to.have.property('_id');
            expect(res.body).to.have.property('name', gName);
        });
    });

});