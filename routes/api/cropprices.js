const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const pool = require("../../config/db");

// @route     GET /api/cropprices/product/all
// @desc      GET ALL crop pricing listing
// @access    Public (this will be the case for all until we have some form of auth)
router.get('/all', async (req, res) => {
  const { limit } = req.body;
  let query = 'SELECT * FROM price';
  let queryArgs = [];
  if (limit) {
    query = query.concat(' limit ($1)');
    queryArgs.push(limit)
  }
  try {
    pool.query(
      query,
      queryArgs,
      (err, qres) => {
        if (err) {
          throw err;
        }
        res.status(200).json(qres.rows);
      }
    )
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

// @route     GET /api/cropprices/product
// @desc      GET crop pricing listing by product, enter product name in request body as 'product'
// @access    Public (this will be the case for all until we have some form of auth)
router.get('/product', [
  check('product', 'Product name required').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  const { product, limit } = req.body;
  let query = 'SELECT * FROM price WHERE LOWER(product) like LOWER($1)';
  let queryArgs = ['%' + product + '%'];
  if (limit) {
    query = query.concat(' limit ($2)');
    queryArgs.push(limit)
  }
  try {
    pool.query(
      query,
      queryArgs,
      (err, qres) => {
        if (err) {
          throw err;
        }
        res.status(200).json(qres.rows);
      }
    )
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

// @route     GET /api/cropprices/variety
// @desc      GET crop pricing listing by variety, enter variety name in request body as 'variety'
// @access    Public (this will be the case for all until we have some form of auth)
router.get('/variety', [
  check('variety', 'Variety name required').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  const { variety, limit } = req.body;
  let query = 'SELECT * FROM price WHERE LOWER(variety) like LOWER($1)';
  let queryArgs = ['%' + variety + '%'];
  if (limit) {
    query = query.concat(' limit ($2)');
    queryArgs.push(limit)
  }
  try {
    pool.query(
      query,
      queryArgs,
      (err, qres) => {
        if (err) {
          throw err;
        }
        res.status(200).json(qres.rows);
      }
    )
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

// @route     GET /api/cropprices/category
// @desc      GET crop pricing listing by category, enter category name in request body as 'category'
// @access    Public (this will be the case for all until we have some form of auth)
router.get('/category', [
  check('category', 'Category name required').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  const { category, limit } = req.body;
  let query = 'SELECT * FROM price WHERE LOWER(category) like LOWER($1)';
  let queryArgs = ['%' + category + '%'];
  if (limit) {
    query = query.concat(' limit ($2)');
    queryArgs.push(limit)
  }
  try {
    pool.query(
      query,
      queryArgs,
      (err, qres) => {
        if (err) {
          throw err;
        }
        res.status(200).json(qres.rows);
      }
    )
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

// @route     GET /api/cropprices/market
// @desc      GET crop pricing listing by market, enter market name in request body as 'market'
// @access    Public (this will be the case for all until we have some form of auth)
router.get('/market', [
  check('market', 'Market name required').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  const { market, limit } = req.body;
  let query = 'SELECT * FROM price WHERE LOWER(market) like LOWER($1)';
  let queryArgs = ['%' + market + '%'];
  if (limit) {
    query = query.concat(' limit ($2)');
    queryArgs.push(limit)
  }
  try {
    pool.query(
      query,
      queryArgs,
      (err, qres) => {
        if (err) {
          throw err;
        }
        res.status(200).json(qres.rows);
      }
    )
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

// @route     GET /api/cropprices/
// @desc      GET anything based on parameters in the request body
//            (this is a bit experimental -- it seems to work though)
//            (this needs to be tested further)
//            (unsure about package.unit, package.weight, since these have a dot in them)
//            (also note that limit MUST be the last argument in the request body)
// @access    Public (this will be the case for all until we have some form of auth)
router.get('/', async (req, res) => {
  const args = { category, variety, product, market} = req.body;
  const { limit } = req.body;
  if (args && Object.keys(args).length === 0 && args.constructor === Object) {
    
    return res.status(400).json({errors: [{
      "msg": "Category, variety, product, or market required",
      "param": "any",
      "location": "body"
    }]});
  }
  let queryIndex = 1;
  let query = 'SELECT * FROM price WHERE ';
  let queryArgs = [];
  
  for (key in args) {
    if (queryIndex == 1) {
      query = query.concat(`LOWER(${key}) like LOWER($${queryIndex})`);
      queryArgs.push('%' + args[key] + '%');
    } else if (key === 'limit') {
      query = query.concat(` limit ($${queryIndex})`);
      queryArgs.push(`${args[key]}`)
    }
    else {
      query = query.concat(` AND LOWER(${key}) like LOWER($${queryIndex})`);
      queryArgs.push('%' + args[key] + '%');
    }
    queryIndex++;
  }
  console.log("Query", query);
  console.log("args:", queryArgs);
  try {
    pool.query(
      query,
      queryArgs,
      (err, qres) => {
        if (err) {
          throw err;
        }
        res.status(200).json(qres.rows);
      }
    )
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

module.exports = router;
