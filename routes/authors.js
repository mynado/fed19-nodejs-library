const express = require('express');
const router = express.Router();
const { index, show, store, update, destroy } = require('../controllers/authors_controller')

/* GET / */
router.get('/', index );

/* GET /:authorId */
router.get('/:authorId', show );

/* Store a new resource */
router.post('/', store );

/* Update a specific resorce */
router.put('/:authorId', update );

/* Destroy a specific resource */
router.delete('/:authorId', destroy );

module.exports = router;
