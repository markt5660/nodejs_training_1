const request = require('supertest');
const {Movie} = require('../../models/movie');
const {Rental} = require('../../models/rental');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const moment = require('moment');

describe('/api/returns', () => {

    let server;
    let token;
    let customerId;
    let movieId;
    let rental;
    let movie;

    beforeEach(async () => { 
        server = require('../../index'); 
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

    afterEach(async () => { 
        await Rental.deleteMany({});    // replaces Rental.remove() - deprecated
        await Movie.deleteMany({});     // replaces Movie.remove() - deprecated
        await server.close();
    });

    // Default 'Happy Path' execution
    const exec = async () => {
        return await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId: customerId, movieId: movieId });
    };

    it ('should retrieve test rental after setup', async () => {
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });

    it('should return 401 if client not logged in', async () => {
        token = ''; // override default creation of valid token

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId not provided', async () => {
        customerId = ''; // override valid customerId

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId not provided', async () => {
        movieId = ''; // override valid movieId

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if rental not found for customer/movie', async () => {
        await Rental.deleteMany({});    /// Remove test rental just created

        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if rental already processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if a valid rental was found', async () => {
        // Stick with happy path

        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should return 200 if request is valid', async () => {
        // Stick with happy path

        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set the return date if request is valid', async () => {
        // Stick with happy path

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned; // in milliseconds

        expect(diff).toBeLessThan( 10 * 1000 ); // 10 seconds
   });

   it('should set the rental fee if request is valid', async () => {
        // Override the dateOut in the DB to ensure it's been out for at least 1 day
        rental.dateOut = moment().add(-7, 'days').toDate();
        rental.save();

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14); // 7 days * 2 dollars/day
    });

    it('should increment the rental stock if request is valid', async () => {
        // Stick with happy path

        const res = await exec();

        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb).not.toBeNull();
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the updated rental if request if valid', async () => {
        // Stick with happy path

        const res = await exec();

        // To check for multiple properties in the return object
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining([
                'dateOut',
                'dateReturned',
                'rentalFee',
                'customer',
                'movie'
            ])
        )
    });
});