const express = require('express');
const { check } = require('express-validator');

const contentControllers = require('../controllers/Content-controllers');

const router = express.Router();

router.get('/:pid', contentControllers.getContentById);

router.get('/user/:uid', contentControllers.getPlacesByUserId);

router.post(
  '/',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  contentControllers.createPlace
);

router.patch(
  '/:pid',
  contentControllers.updatePlace
);

router.delete('/:pid', contentControllers.deletePlace);

module.exports = router;
