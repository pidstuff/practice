const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    name: { type: String, required: true, min: 3, max: 100 },
});

// virtual for URL
GenreSchema.virtual('url').get( () => {
    return `/catalog/genre/${this._id}`;
});

// export model
module.exports = mongoose.model('Genre', GenreSchema);