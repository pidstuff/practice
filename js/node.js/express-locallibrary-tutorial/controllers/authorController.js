const Author = require('../models/author');
const Book = require('../models/book');
const async = require('async');
const { body,validationResult } = require('express-validator');

// Display list of all authors
exports.author_list = (req, res, next) => {
    Author.find()
        .populate('author')
        .sort([['family_name', 'ascending']])
        .exec( (err, list_authors) => {
            if (err) { return next(err) }
            res.render('author_list', { title: 'Author List', author_list: list_authors });
        });
};

// Display detail page for a specific author
exports.author_detail = (req, res, next) => {
    async.parallel({
        author: (callback) => {
            Author.findById(req.params.id).exec(callback);
        },
        authors_books: (callback) => {
            Book.find({ 'author': req.params.id }, 'title summary')
                .exec(callback);
        },
    },  (err, results) => {
        if (err) { return next(err) }
        if (results.author == null) {
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        res.render('author_detail', {
            title: 'Author Detail',
            author: results.author,
            author_books: results.authors_books
        });
    });
};

// Display Author create form on GET
exports.author_create_get = (req, res, next) => {
    res.render('author_form', { title: 'Create Author'});
};

// Handle Author create on POST
exports.author_create_post = [
    // validate fields
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),
    
    // sanitize fields
    body('first_name').escape(),
    body('family_name').escape(),
    body('date_of_birth').toDate(),
    body('date_of_death').toDate(),
    
    // process request
    (req, res, next) => {
        // extract the validation errors from a request
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            res.render('author_form', {
                title: 'Create Author',
                author: req.body,
                errors: errors.array()
            });
            return;
        }
        else {
            // valid data
            //create an Author obj with escaped and trimmed data
            var author = new Author({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            });
            author.save( (err) => {
                if (err) { return next(err) }
                res.redirect(author.url);
            });
        }
    }
];

// Display Author delete form on GET
exports.author_delete_get = (req, res, next) => {
    async.parallel({
        author: (callback) => {
            Author.findById(req.params.id).exec(callback)
        },
        authors_books: (callback) => {
            Book.find({ 'author': req.params.id }).exec(callback)
        },
    }, (err, results) => {
        if (err) { return next(err) }
        if (results.author == null) {
            res.redirect('/catalog/authors');
        }
        res.render('author_delete', {
            title: 'Delete Author',
            author: results.author,
            author_books: results.authors_books
        });
    });
};

// Handle Author delete on POST
exports.author_delete_post = (req, res, next) => {
    async.parallel({
        author: (callback) => {
            Author.findById(req.body.authorid).exec(callback)
        },
        authors_books: (callback) => {
            Book.find({ 'author': req.body.authorid }).exec(callback)
        },
    }, (err, results) => {
        if (err) { return next(err) }
        
        // success
        if (results.authors_books.length > 0) {
            res.render('author_delete', {
                title: 'Delete Author',
                author: results.author,
                author_books: results.authors_books
            });
            return;
        }
        else {
            // author has no books, delete author
            Author.findByIdAndRemove(req.body.authorid, (err) => {
                if (err) { return next(err) }
                res.redirect('/catalog/authors');
            });
        }
    });
};

// Display Author update form on GET
exports.author_update_get = (req, res) => {
    async.parallel({
        author: (callback) => {
            Author.findById(req.params.id).exec(callback);
        },
        authors_books: (callback) => {
            Book.find({ 'author': req.params.id }, 'title summary')
                .exec(callback);
        },
    },  (err, results) => {
        if (err) { return next(err) }
        if (results.author == null) {
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        res.render('author_form', {
            title: 'Update Author',
            author: results.author,
            author_books: results.authors_books
        });
    });
};

// Handle Author update on POST
exports.author_update_post = [
    // validate fields
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),
    
    // sanitize fields
    body('first_name').escape(),
    body('family_name').escape(),
    body('date_of_birth').toDate(),
    body('date_of_death').toDate(),
    
    // process request
    (req, res, next) => {
        // extract the validation errors from a request
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            async.parallel({
                author: (callback) => {
                    Author.findById(req.params.id).exec(callback);
                },
                authors_books: (callback) => {
                    Book.find({ 'author': req.params.id }, 'title summary')
                        .exec(callback);
                },
            },  (err, results) => {
                if (err) { return next(err) }
                if (results.author == null) {
                    var err = new Error('Author not found');
                    err.status = 404;
                    return next(err);
                }
                res.render('author_form', {
                    title: 'Update Author',
                    author: results.author,
                    author_books: results.authors_books
                });
            });
        }
        else {
            // valid data
            //create an Author obj with escaped and trimmed data
            var author = new Author({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
                _id: req.params.id
            });
            Author.findByIdAndUpdate(req.params.id, author, {}, (err, theauthor) => {
                if (err) { return next(err) }
                res.redirect(theauthor.url);
            });
        }
    }
];

