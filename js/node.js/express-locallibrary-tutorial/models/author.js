const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name: { type: String, required: true, max: 100 },
    family_name: { type: String, required: true, max: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
});

// virtual for author's full name
AuthorSchema.virtual('name').get( function() {
    // to avoid errors in cases where an author does not have either a family name or first name
    // we want to make sure we handle the exception by returning an empty string for that case
    var fullname = '';
    if (this.first_name && this.family_name) {
        fullname = `${this.first_name} ${this.family_name}`;
    }
    if (!this.first_name || !this.family_name) {
        fullname = '';
    }
    
    return fullname;
});

// virtual for author's lifespan
AuthorSchema.virtual('lifespan').get( function() {
    const dod = this.date_of_death ? moment(this.date_of_death).format('MMMM Do, YYYY') : '';
    const dob = this.date_of_birth ? moment(this.date_of_birth).format('MMMM Do, YYYY') : '';
    return `${dob} - ${dod}`;
});

// virtual for author's URL
AuthorSchema.virtual('url').get( function() { return `/catalog/author/${this._id}`; });

// export model
module.exports = mongoose.model('Author', AuthorSchema);