const { Router } = require('express');
const productController = require('../controllers/productController');
const {
  listRules,
  idParamRules,
  createRules,
  updateRules,
} = require('../validators/product.validators');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/admin.middleware');

const router = Router();

router.get('/', listRules, validate, productController.list);
router.get('/:id', idParamRules, validate, productController.getById);
router.post('/', authenticate, requireAdmin, createRules, validate, productController.create);
router.put('/:id', authenticate, requireAdmin, updateRules, validate, productController.update);
router.delete('/:id', authenticate, requireAdmin, idParamRules, validate, productController.remove);

module.exports = router;
