const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const BlogPost = require('../src/blogPost');
const Comment = require('../src/comment');


describe('Associations', () => {
    let joe, blogPost, comment;

    beforeEach((done) => {
        joe = new User({ name: 'Joe' });
        blogPost = new BlogPost({
            title: 'JS is Great',
            content: 'Yep it really is'
        });
        comment = new Comment({ content: 'Congrats on great post' });

        // Associations that only exists on the Node.js side yet (not persisted - not on Mongo)
        // All the below statements trigger some Mongoose 'black-magic' that knows how to store the references properly
        joe.blogPosts.push(blogPost);
        blogPost.comments.push(comment);
        comment.user = joe;

        Promise.all([
            joe.save(),
            blogPost.save(),
            comment.save()
        ]).then(() => done());
    });

    it('saves a relation between a user and a blogPost', (done) => {
        User.findOne({ name: 'Joe' })
            .populate('blogPosts')
            .then((user) => {
                assert(user.blogPosts[0].title === 'JS is Great');
                done();
            });
    });

    it('saves a full relation graph', (done) => {
        User.findOne({ name: 'Joe' })
            .populate({
                path: 'blogPosts',
                populate: {
                    path: 'comments',
                    model: 'comment',
                    populate: {
                        path: 'user',
                        model: 'user'
                        // No populate prop because we don't need to go any deeper
                    }
                }
            })
            .then((user) => {
                /*console.log('ONE', user);
                console.log('TWO', user.blogPosts[0]);
                console.log('THREE', user.blogPosts[0].comments[0]);
                console.log('FOUR', user.blogPosts[0].comments[0].user);*/
                assert(user.name === 'Joe');
                assert(user.blogPosts[0].title === 'JS is Great');
                assert(user.blogPosts[0].comments[0].content === 'Congrats on great post');
                assert(user.blogPosts[0].comments[0].user.name === 'Joe');

                done();
            });
    });
});