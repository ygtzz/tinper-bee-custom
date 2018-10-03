const Router = require('koa-router');
const router = new Router();
const user = require('./controller/user');
const tinper = require('./controller/tinper');

// router.post('/user/login',user.login);
// router.get('/user/profile',user.profile);
router.get('/tinper/custom',tinper.custom);
router.get('/tinper/download',tinper.download);

module.exports = router;

