const request = require('supertest');
const {Movie} = require('../../../models/movie');
const {Rental} = require('../../../models/rental');
const {User} = require('../../../models/user');
const mongoose = require('mongoose');
const moment = require('moment');
const expect = require('chai').expect;

const winston = require('winston');     // logging

describe('/api/returns', function () {

    let server;
    let token;
    let customerId;
    let movieId;
    let rental;
    let movie;

    // Default 'happy path' execution
    const exec = async function () {
        return await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId: customerId, movieId: movieId });
    };

    beforeEach(async function () { 
        server = require('../../../index'); 

        token = new User().generateAuthToken();
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'c2345',
                phone: '9165551234'
            },
            movie: {
                _id: movieId,
                title: 'm2345',
                dailyRentalRate: 2
            }
        });

        await rental.save();

        movie = new Movie({
            _id: movieId,
            title: 'm2345',
            genre: { name: 'g2345' },
            numberInStock: 10,
            dailyRentalRate: 2
        });

        await movie.save();
    });

    afterEach(async function () { 
        await Rental.deleteMany({});    // replaces Rental.remove() - deprecated
        await Movie.deleteMany({});     // replaces Movie.remove() - deprecated
        await server.close();
    });

    it('should retrieve test rental after setup', async function () {
        const result = await Rental.findById(rental._id);
        expect(result).to.not.be.null;
    });

    it('should return 401 if client not logged in', async function () {
        token = ''; // override default creation of valid token

        const res = await exec();

        expect(res).to.not.be.null;
        expect(res.status).to.be.eql(401);
    });

    it('should return 400 if customerId not provided', async function () {
        customerId = ''; // override valid customer ID

        const res = await exec();

        expect(res).to.not.be.null;
        expect(res.status).to.be.eql(400);
    });

    it('should return 400 if movieId not provided', async function () {
        movieId = ''; // override valid movie ID

        const res = await exec();

        expect(res).to.not.be.null;
        expect(res.status).to.be.eql(400);
    });

    it('should return 404 if rental not found for customer/movie', async function () {
        await Rental.deleteMany({}); // remove test rental just created

        const res = await exec();

        expect(res).to.not.be.null;
        expect(res.status).to.be.eql(404);
    });

    it('should return 400 if rental already processed', async function () {
        rental.dateReturned = new Date();   // update test rental with return date
        rental.save();

        const res = await exec();

        expect(res).to.not.be.null;
        expect(res.status).to.be.eql(400);
    });

    it('should return 200 if a valid rental was found', async function () {
        // No special setup

        const res = await exec();

        expect(res).to.not.be.null;
        expect(res.status).to.be.eql(200);
    });

    it('should set the return date if request is valid', async function () {
        // No special setup

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned; // in milliseconds

        expect(diff).to.be.lessThan( 10 * 1000 ); // 10 seconds
    });

    it('should set the rental fee if request is valid', async function () {
        // Override date out in the DB to ensure it's been out for 7 days
        rental.dateOut = moment().add(-7, 'days').toDate();
        rental.save();

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb).to.not.be.null;
        expect(rentalInDb.rentalFee).to.be.eql(14); // 7 days * 2 dollars per day
    });

    it('should increment the rental stock if request is valid', async function () {
        // No special setup

        const res = await exec();

        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb).to.not.be.null;
        expect(movieInDb.numberInStock).to.be.eql(movie.numberInStock + 1);
    });

    it ('should return the updated rental if request is valid', async function () {
        // No special setup

        const res = await exec();

        expect(res).to.not.be.null;
        expect(res.body).to.include.all.keys([
            'dateOut',
            'dateReturned',
            'rentalFee',
            'customer',
            'movie'
        ]);
    });

});