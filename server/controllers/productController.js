const { Product } = require('../models');

exports.listProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar produtos', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await Product.create({ name, description, category, price, stock, image });
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const { name, description, category, price, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : product.image;

    await product.update({ name, description, category, price, stock, image });
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    await product.destroy();
    return res.json({ message: 'Produto removido' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao deletar produto', error: error.message });
  }
};
