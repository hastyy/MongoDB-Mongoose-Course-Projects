const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


before((done) => {
    mongoose.connect('mongodb://localhost/users_test', { useMongoClient: true });
    mongoose.connection
        .once('open', () => {
            // Connected to MongoDB
            done();
        })
        .on('error', (err) => console.warn('Warning', err));
});

beforeEach((done) => {
    mongoose.connection.collections.users.drop(() => {
        // Ready to run the next test
        done();
    });
});