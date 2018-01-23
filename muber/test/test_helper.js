const mongoose = require('mongoose');


before((done) => {
    mongoose.connect('mongodb://localhost/muber_test');
    mongoose.connection
        .once('open', () => done())
        .on('error', (err) => console.warn('Warning', err));
});

beforeEach((done) => {
    const { drivers } = mongoose.connection.collections;
    drivers.drop()
        .then(() => drivers.ensureIndex({ 'geometry.coordinates': '2dsphere' }))    // make sure, before the tests are ran, that an index is placed over the geometry property
        .then(() => done())
        .catch(() => done());
});