const { Router } = require('express');
const { list, getById, create, updateStatus, adminSummary } = require('../controllers/orderController');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/admin.middleware');
const { validateUpdateStatus } = require('../validators/order.validators');
const { validate } = require('../middlewares/validate.middleware');

const router = Router();

router.use(authenticate);

router.get('/admin/summary', requireAdmin, adminSummary);
router.get('/', list);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id/status', requireAdmin, validateUpdateStatus, validate, updateStatus);

module.exports = router;
