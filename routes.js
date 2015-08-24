var Router = require('express').Router,
    controller = require('./controller');

var router = Router();

router.route('/')
.get((req, res, next) => {
  res.send('Hello, World!')
})

router.route('/find_tv')
.post(controller.find_tv)

module.exports = router;