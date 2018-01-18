const assert = require('assert');
const User = require('../src/user');


describe('Creating records', () => {
    it('saves a user', (done) => {
        const joe = new User({ name: 'Joe' });

        joe.save().then(() => {
            // Has been saved successfully?
            assert(!joe.isNew);

            done();
        });
    });
});