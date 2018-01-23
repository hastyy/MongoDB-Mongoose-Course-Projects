const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
// Get the Driver model this way and not by requiring it because
// Mocha will try to run the required files multiple times and
// we might get an error for trying to define a model that is
// already defined.
const Driver = mongoose.model('driver');


describe('Drivers controller', () => {
    // Isn't the best way to test but we do it this way to explore more
    // test possibilities than what we did so far.
    it('POST to /api/drivers creates a new driver', (done) => {
        Driver.count().then((count) => {
            request(app)
                .post('/api/drivers')
                .send({ email: 'test@test.com' })
                .end(() => {
                    Driver.count().then((newCount) => {
                        assert(count + 1 === newCount);
                        done();
                    });
                });
        });
    });

    it('PUT to /api/drivers/:id edits an existing driver', (done) => {
        const driver = new Driver({ email: 't@t.com', driving: false });
        
        driver.save()
            .then(() => {
                request(app)
                    .put(`/api/drivers/${driver._id}`)
                    .send({ driving: true })
                    .end(() => {
                        Driver.findOne({ email: 't@t.com' })
                            .then((driver) => {
                                assert(driver.driving === true);
                                done();
                            });
                    });
            });
    });

    it('DELETE to /api/drivers/:id can delete a driver', (done) => {
        const driver = new Driver({ email: 'test@test.com' });

        driver.save().then(() => {
            request(app)
                .delete(`/api/drivers/${driver._id}`)
                .end(() => {
                    Driver.findOne({ email: 'test@test.com' })
                        .then((driver) => {
                            assert(driver === null);
                            done();
                        });
                });
        });
    });

    it('GET to /api/drivers finds drivers in a location', (done) => {
        const seattleDriver = new Driver({
            email: 'seattle@test.com',
            geometry: { type: 'Point', coordinates: [-122.4759902, 47.6147628] }
        });
        const miamiDriver = new Driver({
            email: 'miami@test.com',
            geometry: { type: 'Point', coordinates: [-80.253, 25.791] }
        });

        Promise.all([
            seattleDriver.save(),
            miamiDriver.save()
        ]).then(() => {
            request(app)
                .get('/api/drivers?lng=-80&lat=25')
                .end((err, res) => {
                    console.log('w00t', res.body);
                    assert(res.body.length === 1);
                    assert(res.body[0].email === 'miami@test.com');
                    done();
                });
        });
    });
});