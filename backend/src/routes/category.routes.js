const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const { createRules, idParamRules } = require('../validators/category.validators');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/admin.middleware');

const router = Router();

router.get('/', categoryController.list);
router.post('/', authenticate, requireAdmin, createRules, validate, categoryController.create);
router.delete('/:id', authenticate, requireAdmin, idParamRules, validate, categoryController.remove);

module.exports = router;
