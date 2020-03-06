const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');
const { body,validationResult } = require('express-validator');

// Display list of all BookInstances.
exports.bookinstance_list = (req, res) => {
    BookInstance.find()
        .populate('book')
        .exec( (err, list_bookinstances) => {
            if (err) { return next(err) }
            res.render('bookinstance_list', {
                title: 'Book Instance List',
                bookinstance_list: list_bookinstances
            });
        });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = (req, res, next) => {
    BookInstance.findById(req.params.id)
        .populate('book')
        .exec( (err, bookinstance) => {
            if (err) { return next(err) }
            if (bookinstance == null) {
                var err = new Error('Book copy not found');
                err.status = 404;
                return next(err);
            }
            res.render('bookinstance_detail', {
                title: `Copy ${bookinstance.book.title}`,
                bookinstance: bookinstance
            });
        });
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = (req, res, next) => {
    Book.find({}, 'title').exec( (err, books) => {
        if (err) { return next(err) }
        res.render('bookinstance_form',{
            title: 'Create BookInstance',
            book_list: books
        });
    });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    //validate fields
    body('book', 'Book must be specified').trim().isLength({ min: 1 }),
    body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
    
    // sanitize fields
    body('book').escape(),
    body('imprint').escape(),
    body('status').trim().escape(),
    body('due_back').toDate(),
    
    // process request
    (req, res, next) => {
        // extract validation errors
        const errors = validationResult(req);
        
        // create a bookinstance obj
        const bookinstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
        });
        
        if (!errors.isEmpty()) {
            Book.find({}, 'title').exec( (err, books) => {
                if (err) { return next(err) }
                res.render('bookinstance_form', {
                    title: 'Create BookInstance',
                    book_list: books,
                    selected_book: bookinstance.book._id,
                    errors: errors.array(),
                    bookinstance: bookinstance
                });
            });
            return;
        }
        else {
            bookinstance.save( (err) => {
                if (err) { return next(err) }
                res.redirect(bookinstance.url);
            });
        }
    }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};