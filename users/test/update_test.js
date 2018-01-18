const assert = require('assert');
const User = require('../src/user');


describe('Updating records', () => {
    let joe;

    beforeEach((done) => {
        joe = new User({ name: 'Joe', likes: 0 });
        joe.save().then(() => done());
    });

    function assertName(operation, done) {
        operation
            .then(() => User.find({}))
            .then((users) => {
                assert(users.length === 1);
                assert(users[0].name === 'Alex');
                done();
            });
    }

    it('instance type using set n save', (done) => {
        joe.set('name', 'Alex');
        assertName(joe.save(), done);
    });

    it('A model instance can update', (done) => {
        assertName(joe.update({ name: 'Alex' }), done);
    });

    it('A model class can update', (done) => {
        assertName(
            User.update({ name: 'Joe' }, { name: 'Alex' }),
            done
        );
    });

    it('A model class can update one record', (done) => {
       assertName(
           User.findOneAndUpdate({ name: 'Joe' }, { name: 'Alex' }),
           done
       );
    });

    it('A model class can find a record with an id and update', (done) => {
       assertName(
           User.findByIdAndUpdate(joe._id, { name: 'Alex' }),
           done
       );
    });

    it('A user can have their likes incremented by 1', (done) => {
        // Find all users with the name of Joe and for each one of them
        // increment the likes property by 1.
        // This operation is carried out into the database so we don't have
        // to pull data from it, update it ourselves and then save it back.
        // So this update operators are much more performant.
        User.update({ name: 'Joe' }, { $inc: { likes: 1 } })
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(user.likes === 1);
                done();
            });
    });
});