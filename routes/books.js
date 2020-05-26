const express = require('express');
const router = express.Router();
const { index, show, store, update, destroy } = require('../controllers/book_controller')

/* GET all resources */
router.get('/', index );

/* GET a specific resource */
router.get('/:bookId', show );

/* Store a new resource */
router.post('/', store );

/* Update a specific resorce */
router.put('/:bookId', update );

/* Destroy a specific resource */
router.delete('/:bookId', destroy );

module.exports = router;
