const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const { listProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname.replace(ext, '')}${ext}`);
  }
});

const upload = multer({ storage });

router.get('/', listProducts);
router.post('/', auth, upload.single('image'), createProduct);
router.put('/:id', auth, upload.single('image'), updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;
