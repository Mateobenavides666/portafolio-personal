const router = require('express').Router();
const c = require('../controller/artistaController');

router.get('/', c.listar);
router.post('/', c.crear);

module.exports = router;
