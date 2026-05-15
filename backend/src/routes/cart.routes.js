const { Router } = require('express');
const { getCart, addItem, updateItem, removeItem, clearCart } = require('../controllers/cartController');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateAddCartItem, validateUpdateCartItem } = require('../validators/cart.validators');
const { validate } = require('../middlewares/validate.middleware');

const router = Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/items', validateAddCartItem, validate, addItem);
router.put('/items/:id', validateUpdateCartItem, validate, updateItem);
router.delete('/items/:id', removeItem);
router.delete('/', clearCart);

module.exports = router;
