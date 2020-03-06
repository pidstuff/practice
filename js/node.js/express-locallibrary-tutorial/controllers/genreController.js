const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');
const validator = require('express-validator');

// Display list of all Genre.
exports.genre_list = (req, res) => {
    Genre.find()
        .populate('genre')
        .sort([['name', 'ascending']])
        .exec( (err, list_genres) => {
            if (err) { return next(err) }
            res.render('genre_list', {
                title: 'Genre List',
                genre_list: list_genres
            });
        });
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
    async.parallel({
        genre: (callback) => {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: (callback) => {
            Book.find({ 'genre': req.params.id }).exec(callback);
        },
    }, (err, results) => {
        if (err) { return next(err) }
        if (results.genre == null) {
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        
        res.render('genre_detail', {
            title: 'Genre Detail',
            genre: results.genre,
            genre_books: results.genre_books
        });
    });
};

// Display Genre create form on GET.
exports.genre_create_get = (req, res) => {
    res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
exports.genre_create_post = [
    // validate that the name field is not empty
    validator.body('name', 'Genre name required').trim().isLength({ min: 1 }),
    
    // sanitize (escape) the name field
    validator.body('name').escape(),
    
    // process request after validation and sanitization
    (req, res, next) => {
        // extract the validation errors from a request
        const errors = validator.validationResult(req);
        
        // create a genre object with escaped and trimmed data
        const genre = new Genre({ name: req.body.name });
        
        if (!errors.isEmpty()) {
            res.render('genre_form', {
                title: 'Create Genre',
                genre: genre,
                errors: errors.array()
            });
            return;
        }
        else {
            // valid data
            Genre.findOne({ 'name': req.body.name })
                .exec( (err, found_genre) => {
                    if (err) { return next(err) }
                    
                    if (found_genre) {
                        // genre exists
                        res.redirect(found_genre.url);
                    }
                    else {
                        genre.save( (err) => {
                            if (err) { return next(err) }
                            res.redirect(genre.url);
                        });
                    }
                });
        }
    }
];
// Display Genre delete form on GET.
exports.genre_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = (req, res) => {
    async.parallel({
        genre: (callback) => {
            Genre.findById(req.params.id).exec(callback);
        },
    }, (err, results) => {
        if (err) { return next(err) }
        if (results.genre == null) {
            const err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        res.render('genre_form', { title: 'Update Genre', genre: results.genre });
    });
};

// Handle Genre update on POST.
exports.genre_update_post = [
    validator.body('name', 'Genre name required').trim().isLength({ min: 1 }),
    
    validator.body('name').escape(),
    
    (req, res, next) => {
        const errors = validator.validationResult(req);
        
        var genre = new Genre({ name: req.body.name, _id: req.params.id });
        
        if (!errors.isEmpty()) {
            async.parallel({
                genres: (callback) => {
                    Genre.find(callback);
                },
            }, (err, results) => {
                if (err) { return next(err) }
                res.render('genre_form', { name: results.name });
            });
            return;
        }
        else {
            Genre.findByIdAndUpdate(req.params.id, genre, {}, (err, thegenre) => {
                if (err) { next(err) }
                res.redirect(thegenre.url);
            });
        }
    }
];