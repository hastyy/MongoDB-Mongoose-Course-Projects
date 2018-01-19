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

// Pre remove-event middleware
// function instead of fat arrow because of 'this' binding
UserSchema.pre('remove', function(next) {
    // Right way to get the model for blogPost here, instead of requiring it
    // bacause if we need the User model in BlogPost later, we will have an
    // import cycle and no correct order to load both modules (one depends on the other and vice-versa)
    // Since this callback function will only run after our app boots up, even if we have the same line
    // as above in the BlogPost schema to access the User model, we won't have any cycle problems because
    // both models will be defined by then.
    const BlogPost = mongoose.model('blogPost');

    BlogPost.remove({ _id: { $in: this.blogPosts } })
        .then(() => next());
});

// Represents the user collection - Can be seen as the Repository (SPRING analogy)
const User = mongoose.model('user', UserSchema);

module.exports = User;