const async = require('async');
const Author = require('../models/author');
const Book = require('../models/book');
const BookInstance = require('../models/bookinstance');
const Genre = require('../models/genre');
const { body,validationResult } = require('express-validator');

exports.index = (req, res) => {
    async.parallel({
        book_count: (callback) => {
            Book.countDocuments({}, callback);
        },
        book_instance_count: (callback) => {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: (callback) => {
            BookInstance.countDocuments({ status:'Available' }, callback);
        },
        author_count: (callback) => {
            Author.countDocuments({}, callback);
        },
        genre_count: (callback) => {
            Genre.countDocuments({}, callback);
        }
    }, (err, results) => {
        res.render('index', {
            title: 'Local Library Home',
            error: err, data: results
        });
    });
};

// Display list of all books
exports.book_list = (req, res, next) => {
    Book.find({}, 'title author')
        .populate('author')
        .exec( (err, list_books) => {
            if (err) { return next(err) }
            res.render('book_list', { title: 'Book List', book_list: list_books });
        });
};

// Display detail page for a specific book
exports.book_detail = (req, res, next) => {
    async.parallel({
        book: (callback) => {
            Book.findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec(callback);
        },
        book_instance: (callback) => {
            BookInstance.find({ 'book': req.params.id }).exec(callback);
        },
    }, (err, results) => {
        if (err) { return next(err) }
        if (results.book == null) {
            const err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        res.render('book_detail', {
            title: results.book.title,
            book: results.book,
            book_instances: results.book_instance
        });
    });
};

// Display book create form on GET
exports.book_create_get = (req, res, next) => {
    // get all authors and genres, which we can use for adding to our book
    async.parallel({
        authors: (callback) => {
            Author.find(callback);
        },
        genres: (callback) => {
            Genre.find(callback);
        },
    }, (err, results) => {
        if (err) { return next(err) }
        res.render('book_form', {
            title: 'Create Book',
            authors: results.authors,
            genres: results.genres
        });
    });
};

// Handle book create on POST
exports.book_create_post = [
    // convert genre to array
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined') {
                req.body.genre = [];
            }
            else {
                req.body.genre = new Array(req.body.genre);
            }
        }
        next();
    },
    
    // validate fields
    body('title', 'Title must not be empty').trim().isLength({ min: 1 }),
    body('author', 'Author must not be empty').trim().isLength({ min: 1 }),
    body('summary', 'Summary must not be empty').trim().isLength({ min: 1 }),
    body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }),
    
    // sanitize fields
    body('*').escape(),
    
    // process request
    (req, res, next) => {
        // extract validation errors from request
        const errors = validationResult(req);
        
        //create a book obj with escaped and trimmed data
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre
        });
        
        if (!errors.isEmpty()) {
            // get all authors and genres for form
            async.parallel({
                authors: (callback) => {
                    Author.find(callback);
                },
                genres: (callback) => {
                    Genres.find(callback);
                },
            }, (err, results) => {
                if (err) { return next(err) }
                
                // mark our selected genres as checked
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked = 'true';
                    }
                }
                res.render('book_form', {
                    title: 'Create Book',
                    authors: results.authors,
                    genres: results.genres,
                    book: book,
                    errors: errors.array()
                });
            });
        }
        else {
            book.save( (err) => {
                if (err) { return next(err) }
                res.redirect(book.url);
            });
        }
    }
];

// Display book delete form on GET
exports.book_delete_get = (req, res) => {
    async.parallel({
        book: (callback) => {
            Book.findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec(callback);
        },
        book_instance: (callback) => {
            BookInstance.find({ 'book': req.params.id }).exec(callback);
        },
    }, (err, results) => {
        if (err) { return next(err) }
        if (results.book == null) {
            const err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        res.render('book_delete', {
            title: 'Delete Book',
            book: results.book,
            book_instances: results.book_instance
        });
    });
};

// Handle book delete on POST
exports.book_delete_post = (req, res) => {
    async.parallel({
        book: (callback) => {
            Book.findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec(callback);
        },
        book_instance: (callback) => {
            BookInstance.find({ 'book': req.params.id }).exec(callback);
        },
    }, (err, results) => {
        if (err) { return next(err) }
        
        // success
        if (results.book_instance.length > 0) {
            res.render('book_delete', {
                title: 'Delete Book',
                book: results.book,
                book_instances: results.book_instance
            });
            return;
        }
        else {
            // author has no books, delete author
            Book.findByIdAndRemove(req.body.bookid, (err) => {
                if (err) { return next(err) }
                res.redirect('/catalog/books');
            });
        }
    });
};

// Display book update form on GET
exports.book_update_get = (req, res) => {
    async.parallel({
        book: (callback) => {
            Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
        },
        authors: (callback) => {
            Author.find(callback);
        },
        genres: (callback) => {
            Genre.find(callback);
        },
    }, (err, results) => {
        if (err) { return next(err) }
        if (results.book == null) {
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        // mark our selected genres as checked
        for (var all_g_iter = 0; all_g_iter < results.genres.lengthl; all_g_iter++) {
            for (var book_g_iter = 0; book_g_iter < results.book.genre.length; book_g_iter++) {
                if (Results.genres[all_g_iter]._id.toString() == results.book.genre[book_g_iter]._id.toString()) {
                    results.genres[all_g_iter].checked = 'true';
                }
            }
        }
        res.render('book_form', {
            title: 'Update Book',
            authors: results.authors,
            genres: results.genres,
            book: results.book
        });
    });
};

// Handle book update on POST
exports.book_update_post = [
    // convert genre to an array
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined') {
                req.body.genre = [];
            }
            else {
                req.body.genre = new Array(req.body.genre);
            }
        }
        next();
    },
    
    body('title', 'Title must not be empty').trim().isLength({ min: 1 }),
    body('author', 'Author must not be empty').trim().isLength({ min: 1 }),
    body('summary', 'Summary must not be empty').trim().isLength({ min: 1 }),
    body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }),
    
    body('*').escape(),
    body('genre.*').escape(),
    
    (req, res, next) => {
        // extract validation errors from req
        const errors = validationResult(req);
        
        // create book obj
        var book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre,
            _id: req.params.id //required or new id will be assigned
        });
        
        if (!errors.isEmpty()) {
            async.parallel({
                authors: (callback) => {
                    Author.find(callback);
                },
                genres: (callback) => {
                    Genres.find(callback);
                },
            }, (err, results) => {
                if (err) { return next(err) }
                
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked = 'true';
                    }
                }
            
                res.render('book_form', {
                    title: 'Update Book',
                    authors: results.authors,
                    genres: results.genres,
                    book: book,
                    errors: errors.array()
                });
            
            });
            return;
        }
        else {
            // update record
            Book.findByIdAndUpdate(req.params.id, book, {}, (err, thebook) => {
                if (err) { next(err) }
                res.redirect(thebook.url);
            });
        }
    }
];