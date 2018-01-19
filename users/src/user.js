const mongoose = require('mongoose');
const PostSchema = require('./post');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name: {
        type: String,
        validate: {
            validator: (name) => name.length > 2,
            message: 'Name must be longer than 2 characters.'
        },
        required: [true, 'Name is required.']
    },
    posts: [PostSchema],
    likes: Number,
    blogPosts: [{
        type: Schema.Types.ObjectId,
        ref: 'blogPost'
    }]
}, { usePushEach: true });  // usePushEach because of .push for inner posts array won't work otherwise -> it's deprecated

// The 'this' keyword is why we use the function syntax in the callback here
// Runs the callback and get the returned value of it when accessing user.postCount
UserSchema.virtual('postCount').get(function() {
    return this.posts.length;
});

// Represents the user collection - Can be seen as the Repository (SPRING analogy)
const User = mongoose.model('user', UserSchema);

module.exports = User;