const express = require('express');
const router = express.Router();
const { createRules, updateRules } = require('../validation_rules/user');
const { index, show, store, update, destroy } = require('../controllers/users_controller')

/*
 *
 * GET /
 */
router.get('/', index );

/*
 * Store a new resource
 * POST /
 */
router.post('/', createRules, store );

/*
 * Get a specific resource
 * GET /:userId
 */
router.get('/:userId', show );

/*
 * Update a specific resorce
 * PUT /:userId
 */
router.put('/:userId', updateRules, update );

/*
 * Destroy a specific resource
 * DELETE /:userId
 */
router.delete('/:userId', destroy );


module.exports = router;
